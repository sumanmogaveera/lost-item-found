const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const authenticateToken = require('../middleware/auth');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * @route   POST /api/auth/google
 * @desc    Authenticate with Google ID Token
 */
router.post('/google', async (req, res) => {
    const { token } = req.body;
    console.log('--- Google Login Debug Start ---');
    console.log('Received Token (first 10 chars):', token?.substring(0, 10));
    console.log('Expected Client ID:', process.env.GOOGLE_CLIENT_ID);

    if (!token) {
        console.log('Error: No token provided');
        return res.status(400).json({ msg: 'No Google token provided' });
    }

    try {
        console.log('Attempting to verify token with Google libraries...');
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        console.log('✓ Token verified successfully');

        const payload = ticket.getPayload();
        console.log('User Payload:', {
            email: payload.email,
            name: payload.name,
            sub: payload.sub
        });

        const { sub: googleId, email, name } = payload;

        let user = await User.findOne({ where: { google_id: googleId } });

        if (!user) {
            console.log('User not found by googleId, checking email:', email);
            user = await User.findOne({ where: { email } });
            if (user) {
                console.log('Found existing user by email, linking Google ID');
                user.google_id = googleId;
                await user.save();
            } else {
                console.log('Creating brand new user...');
                user = await User.create({
                    email,
                    name: name || 'Google User',
                    google_id: googleId,
                });
                console.log('✓ User created');
            }
        } else {
            console.log('✓ Existing user found by googleId');
        }

        console.log('Generating JWT token...');
        const jwtPayload = { user: { id: user.id } };

        jwt.sign(
            jwtPayload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
            (err, jwtToken) => {
                if (err) {
                    console.log('JWT signing error:', err.message);
                    throw err;
                }
                console.log('✓ JWT generated, sending response');
                console.log('--- Google Login Debug End (Success) ---');
                res.json({ token: jwtToken });
            }
        );
    } catch (err) {
        console.error('❌ Google Auth Error Details:', err.message);
        console.log('--- Google Login Debug End (Failure) ---');
        res.status(400).json({ msg: 'Google authentication failed: ' + err.message });
    }
});

/**
 * @route   POST /api/auth/register
 * @desc    Manual user registration (Blueprint)
 */
router.post(
    '/register',
    [
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({ min: 6 }),
        body('name').trim().notEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password, name, phone } = req.body;

        try {
            let user = await User.findOne({ where: { email } });
            if (user) {
                return res.status(400).json({ msg: 'User already exists' });
            }

            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            user = await User.create({
                email,
                password_hash: passwordHash,
                name,
                phone: phone || null
            });

            const payload = { user: { id: user.id } };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '7d' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

/**
 * @route   POST /api/auth/login
 * @desc    Manual user login (Blueprint)
 */
router.post(
    '/login',
    [
        body('email').isEmail().normalizeEmail(),
        body('password').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            let user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }

            if (!user.password_hash) {
                return res.status(400).json({ msg: 'Please use Google Login for this account' });
            }

            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }

            const payload = { user: { id: user.id } };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '7d' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 */
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password_hash'] }
        });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Auth Me Error:', err.message);
        res.status(500).send('Server error');
    }
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update current user profile
 */
router.put(
    '/profile',
    authenticateToken,
    [
        body('name').optional().trim().notEmpty(),
        body('phone').optional().trim(),
        body('profile_image').optional(),
        body('privacy_mode').optional().isBoolean(),
        body('notifications_enabled').optional().isBoolean()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, phone, profile_image, privacy_mode, notifications_enabled } = req.body;

        try {
            const user = await User.findByPk(req.user.id);
            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }

            if (name) user.name = name;
            if (phone !== undefined) user.phone = phone;
            if (profile_image !== undefined) user.profile_image = profile_image;
            if (privacy_mode !== undefined) user.privacy_mode = privacy_mode;
            if (notifications_enabled !== undefined) user.notifications_enabled = notifications_enabled;

            await user.save();
            res.json(user);
        } catch (err) {
            console.error('Update Profile Error:', err.message);
            res.status(500).send('Server error');
        }
    }
);

/**
 * @route   DELETE /api/auth/profile
 * @desc    Delete current user account
 */
router.delete('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Note: Items and images are handled by foreign key ON DELETE SET NULL/CASCADE in DB
        await user.destroy();
        res.json({ msg: 'Account deleted successfully' });
    } catch (err) {
        console.error('Delete Account Error:', err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
