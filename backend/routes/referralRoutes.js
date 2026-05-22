const express = require('express');
const { getReferrals } = require('../controllers/referralController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/', protect, getReferrals);

module.exports = router;
