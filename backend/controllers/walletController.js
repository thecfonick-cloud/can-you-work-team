const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');

// Get wallet balance details
const getWallet = async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      // Create wallet if it doesn't exist for some reason
      wallet = await Wallet.create({
        userId: req.user._id,
        availableBalance: 0,
        pendingBalance: 0,
        totalEarned: 0,
        totalWithdrawn: 0
      });
    }

    // Dynamic USD rate conversion matching the designs (approx. ₦1,523 per $1)
    const EXCHANGE_RATE = 1523.0;

    const balances = {
      availableBalance: wallet.availableBalance,
      availableBalanceUSD: wallet.availableBalance / EXCHANGE_RATE,
      pendingBalance: wallet.pendingBalance,
      pendingBalanceUSD: wallet.pendingBalance / EXCHANGE_RATE,
      totalEarned: wallet.totalEarned,
      totalEarnedUSD: wallet.totalEarned / EXCHANGE_RATE,
      totalWithdrawn: wallet.totalWithdrawn,
      totalWithdrawnUSD: wallet.totalWithdrawn / EXCHANGE_RATE
    };

    res.json({ success: true, balances });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error retrieving wallet details' });
  }
};

// Get wallet transaction logs
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50); // limit to last 50 transactions for fast rendering

    res.json({ success: true, count: transactions.length, transactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error retrieving transaction logs' });
  }
};

module.exports = { getWallet, getTransactions };
