const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { SearchInterest, User } = require('../models');
const authenticateToken = require('../middleware/auth');

// POST /api/search-interests - Subscribe to a search query
router.post(
    '/',
    authenticateToken,
    [
        body('query').trim().notEmpty(),
        body('category').optional().isString(),
        body('area').optional().isString(),
        body('status_filter').optional().isString(),
        body('start_date').optional().isISO8601(),
        body('end_date').optional().isISO8601()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { query, category, area, status_filter, start_date, end_date } = req.body;

        try {
            // Check if similar active interest already exists for this user
            const existingInterest = await SearchInterest.findOne({
                where: {
                    user_id: req.user.id,
                    query: query || null,
                    category: category || null,
                    area: area || null,
                    status_filter: status_filter || null,
                    start_date: start_date || null,
                    end_date: end_date || null,
                    status: 'active'
                }
            });

            if (existingInterest) {
                return res.json(existingInterest);
            }

            const interest = await SearchInterest.create({
                query,
                category: category || null,
                area: area || null,
                status_filter: status_filter || null,
                start_date: start_date || null,
                end_date: end_date || null,
                user_id: req.user.id
            });

            res.status(201).json(interest);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// GET /api/search-interests/me - Get my active subscriptions
router.get(
    '/me',
    authenticateToken,
    async (req, res) => {
        try {
            const interests = await SearchInterest.findAll({
                where: { user_id: req.user.id },
                order: [['created_at', 'DESC']]
            });
            res.json(interests);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

module.exports = router;
