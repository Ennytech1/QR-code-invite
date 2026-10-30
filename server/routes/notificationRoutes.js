const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

// Notification routes
router.get('/', protect, getNotifications);
router.put('/:id', protect, markAsRead);

module.exports = router;
