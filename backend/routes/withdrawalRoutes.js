const express = require('express');
const { createWithdrawal, getWithdrawals } = require('../controllers/withdrawalController');
const { protect } = require('../middleware/auth');
const fraudDetector = require('../middleware/fraudDetector');
const router = express.Router();

router.post('/', protect, fraudDetector, createWithdrawal);
router.get('/', protect, getWithdrawals);

module.exports = router;
