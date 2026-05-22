const express = require('express');
const { getBonusProgress, checkIn } = require('../controllers/bonusController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/progress', protect, getBonusProgress);
router.post('/check-in', protect, checkIn);

module.exports = router;
