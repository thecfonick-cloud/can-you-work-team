const express = require('express');
const { getWallet, getTransactions } = require('../controllers/walletController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/', protect, getWallet);
router.get('/transactions', protect, getTransactions);

module.exports = router;
