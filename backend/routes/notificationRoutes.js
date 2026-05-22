const express = require('express');
const { getNotifications, markAsRead, getPreferences, updatePreferences } = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/', protect, getNotifications);
router.post('/read', protect, markAsRead);
router.get('/preferences', protect, getPreferences);
router.put('/preferences', protect, updatePreferences);

module.exports = router;
