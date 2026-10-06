const express = require('express');
const router = express.Router();
const { Notification, Item } = require('../models');
const authenticateToken = require('../middleware/auth');

// GET /api/notifications - Get all notifications for current user
router.get(
    '/',
    authenticateToken,
    async (req, res) => {
        try {
            const notifications = await Notification.findAll({
                where: { user_id: req.user.id },
                include: [{ model: Item, as: 'relatedItem', attributes: ['id', 'title'] }],
                order: [['created_at', 'DESC']]
            });
            res.json(notifications);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// PATCH /api/notifications/:id/read - Mark notification as read
router.patch(
    '/:id/read',
    authenticateToken,
    async (req, res) => {
        try {
            const notification = await Notification.findOne({
                where: { id: req.params.id, user_id: req.user.id }
            });

            if (!notification) {
                return res.status(404).json({ msg: 'Notification not found' });
            }

            notification.is_read = true;
            await notification.save();

            res.json(notification);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

module.exports = router;
