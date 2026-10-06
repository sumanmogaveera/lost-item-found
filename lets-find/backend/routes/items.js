const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const Item = require('../models/item');
const ItemImage = require('../models/itemImage');
const User = require('../models/user');
const { SearchInterest, Notification } = require('../models');
const authenticateToken = require('../middleware/auth');

// GET /api/items - get items with smart suggestions
router.get(
    '/',
    [
        query('q').optional().isString(),
        query('category').optional().isString(),
        query('status').optional().isString(),
        query('area').optional().isString()
    ],
    async (req, res) => {
        const { q, category, status, area } = req.query;
        
        try {
            // Fetch all items to perform smart matching in-memory
            // For production, this should be optimized with a more complex SQL query or search engine
            const allItems = await Item.findAll({
                include: [
                    { model: ItemImage, as: 'images' },
                    { model: User, as: 'finder', attributes: ['name', 'phone', 'profile_image'] }
                ],
                order: [['created_at', 'DESC']]
            });

            if (!q && !category && !status && !area) {
                const mappedItems = allItems.map(item => ({
                    ...item.toJSON(),
                    imageUrl: item.images && item.images.length > 0 ? item.images[0].url : null
                }));
                return res.json(mappedItems);
            }

            const scoredItems = allItems.map(item => {
                let score = 0;
                let totalCriteria = 0;
                let keywordMatched = false;

                // 1. Name/Keywords Match
                if (q) {
                    totalCriteria++;
                    const searchTerms = q.toLowerCase().split(' ');
                    const itemText = `${item.title} ${item.description || ''} ${item.keywords || ''}`.toLowerCase();
                    if (searchTerms.some(term => itemText.includes(term))) {
                        score++;
                        keywordMatched = true;
                    }
                }

                // 2. Category Match
                if (category) {
                    totalCriteria++;
                    if (item.category === category) score++;
                }

                // 3. Status Match
                if (status) {
                    totalCriteria++;
                    if (item.status === status) score++;
                }

                // 4. Area Match
                if (area) {
                    totalCriteria++;
                    if (item.area && item.area.toLowerCase().includes(area.toLowerCase())) score++;
                }

                // Determine if it's an exact match or a suggestion
                // We define "Exact Match" as matching ALL provided criteria
                // We define "Suggestion" as matching at least 2 criteria
                // Requirement: If a keyword (q) is provided, it MUST be one of the matching criteria for suggestions
                const isExact = score === totalCriteria && totalCriteria > 0;
                const isSuggestion = q ? (keywordMatched && score >= 2) : (score >= 2);

                const itemData = item.toJSON();
                return {
                    ...itemData,
                    imageUrl: itemData.images && itemData.images.length > 0 ? itemData.images[0].url : null,
                    matchScore: score,
                    isExact,
                    isSuggestion: !isExact && isSuggestion
                };
            });

            // Filter out items that don't meet the minimum smart match threshold
            // and sort by relevance
            const filteredItems = scoredItems
                .filter(item => item.isExact || item.isSuggestion)
                .sort((a, b) => b.matchScore - a.matchScore);

            res.json(filteredItems);
        } catch (err) {
            console.error('Smart Match Error:', err.message);
            res.status(500).send('Server error');
        }
    }
);

// GET /api/items/me - get items reported by the current user
router.get(
    '/me',
    authenticateToken,
    async (req, res) => {
        try {
            const items = await Item.findAll({
                where: { user_id: req.user.id },
                include: [
                    { model: ItemImage, as: 'images' }
                ],
                order: [['created_at', 'DESC']]
            });
            const mappedItems = items.map(item => ({
                ...item.toJSON(),
                imageUrl: item.images && item.images.length > 0 ? item.images[0].url : null
            }));
            res.json(mappedItems);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// GET /api/items/:id - get single item
router.get(
    '/:id',
    async (req, res) => {
        try {
            const item = await Item.findByPk(req.params.id, {
                include: [
                    { model: ItemImage, as: 'images' },
                    { model: User, as: 'finder', attributes: ['name', 'phone', 'profile_image'] }
                ]
            });
            if (!item) {
                return res.status(404).json({ msg: 'Item not found' });
            }
            const itemData = item.toJSON();
            itemData.imageUrl = itemData.images && itemData.images.length > 0 ? itemData.images[0].url : null;
            // Never return the answer hash to the client
            delete itemData.verification_answer_hash;
            res.json(itemData);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// POST /api/items/:id/verify - Verify ownership challenge answer
router.post(
    '/:id/verify',
    authenticateToken,
    [
        body('answer').trim().notEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const item = await Item.findByPk(req.params.id);
            if (!item) {
                return res.status(404).json({ msg: 'Item not found' });
            }

            const { answer } = req.body;
            
            const isMatch = await bcrypt.compare(answer, item.verification_answer_hash);
            
            // Always return 200, let frontend handle the score reduction
            res.json({ 
                msg: isMatch ? 'Verification successful' : 'Verification answer recorded', 
                success: true,
                isMatch: isMatch
            });
        } catch (err) {
            console.error('Verify Item Error:', err.message);
            res.status(500).send('Server error');
        }
    }
);

// POST /api/items - create a new item
router.post(
    '/',
    authenticateToken,
    [
        body('title').trim().notEmpty(),
        body('category').notEmpty(),
        body('verification_question').trim().notEmpty(),
        body('verification_answer').trim().notEmpty()
    ],
    async (req, res) => {
        console.log('--- Item Upload Debug Start ---');
        console.log('User ID:', req.user?.id);
        console.log('Request Body:', JSON.stringify(req.body, null, 2));

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation Errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            title,
            description,
            category,
            brand,
            color,
            foundDate,
            latitude,
            longitude,
            area,
            verification_question,
            verification_answer,
            keywords,
            imageUrls
        } = req.body;

        try {
            console.log('Hashing verification answer...');
            const salt = await bcrypt.genSalt(10);
            const verificationAnswerHash = await bcrypt.hash(verification_answer, salt);

            console.log('Creating item in database...');
            const item = await Item.create({
                title,
                description: description || null,
                category,
                status: 'Found',
                brand: brand || null,
                color: color || null,
                found_date: foundDate || null,
                latitude: latitude || null,
                longitude: longitude || null,
                area: area || null,
                verification_question,
                verification_answer_hash: verificationAnswerHash,
                user_id: req.user.id,
                keywords: keywords || null
            });
            console.log('✓ Item created with ID:', item.id);

            if (imageUrls && Array.isArray(imageUrls) && imageUrls.length > 0) {
                console.log(`Processing ${imageUrls.length} images...`);
                const imagePromises = imageUrls.map(url =>
                    ItemImage.create({ url, item_id: item.id })
                );
                await Promise.all(imagePromises);
                console.log('✓ Images saved');
            }

            // --- NOTIFICATION LOGIC ---
            // Find all active search interests that might match this new item
            // We fetch all active interests and filter them to ensure robust matching
            const allActiveInterests = await SearchInterest.findAll({
                where: {
                    status: 'active',
                    user_id: { [Op.ne]: req.user.id }
                }
            });

            const itemText = `${title} ${description || ''} ${keywords || ''}`.toLowerCase();
            const matchingInterests = allActiveInterests.filter(interest => {
                // 1. Category Match (if interest has category)
                if (interest.category && interest.category !== category) {
                    return false;
                }

                // 2. Query Match (if interest has query)
                if (interest.query) {
                    const searchTerms = interest.query.toLowerCase().split(' ');
                    // For a more precise match, let's say at least one term must be present
                    if (!searchTerms.some(term => itemText.includes(term))) {
                        return false;
                    }
                }

                // 3. Area Match (if interest has area)
                if (interest.area && area) {
                    if (!area.toLowerCase().includes(interest.area.toLowerCase()) && 
                        !interest.area.toLowerCase().includes(area.toLowerCase())) {
                        return false;
                    }
                }

                // 4. Status Match (if interest has status_filter)
                // Note: The new item's status is likely 'Found', but let's check
                if (interest.status_filter && interest.status_filter !== 'Found' && interest.status_filter !== 'Any status') {
                    // Usually users search for 'Found' items if they lost something.
                    // If they searched for something else, we should respect it.
                    if (interest.status_filter !== 'Found') return false; 
                }

                // 5. Date Range Match
                if (foundDate) {
                    const itemDate = new Date(foundDate);
                    if (interest.start_date && itemDate < new Date(interest.start_date)) {
                        return false;
                    }
                    if (interest.end_date && itemDate > new Date(interest.end_date)) {
                        return false;
                    }
                }

                return true;
            });

            if (matchingInterests.length > 0) {
                console.log(`Found ${matchingInterests.length} matching search interests. Creating notifications...`);
                const notificationPromises = matchingInterests.map(async (interest) => {
                    // Create the notification
                    const notification = await Notification.create({
                        user_id: interest.user_id,
                        title: 'Match Found for Your Search!',
                        message: `Great news! Someone just uploaded an item that matches your search for "${interest.query || interest.category}". Click to view details.`,
                        type: 'match',
                        related_item_id: item.id
                    });

                    // Update the interest status so we don't notify again for the same interest
                    interest.status = 'matched';
                    await interest.save();

                    return notification;
                });
                await Promise.all(notificationPromises);
            }

            console.log('--- Item Upload Debug End (Success) ---');
            res.status(201).json(item);
        } catch (err) {
            console.error('❌ Item Upload Error Details:', err.message);
            if (err.errors) {
                console.log('Database Validation Errors:', err.errors.map(e => e.message));
            }
            console.log('--- Item Upload Debug End (Failure) ---');
            res.status(500).send('Server error: ' + err.message);
        }
    }
);

// DELETE /api/items/:id - delete an item reported by the current user
router.delete(
    '/:id',
    authenticateToken,
    async (req, res) => {
        try {
            const item = await Item.findOne({
                where: { id: req.params.id, user_id: req.user.id }
            });

            if (!item) {
                return res.status(404).json({ msg: 'Item not found or unauthorized' });
            }

            await item.destroy();
            res.json({ msg: 'Item deleted successfully' });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

module.exports = router;
