const Withdrawal = require('../models/Withdrawal');
const Wallet = require('../models/Wallet');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');

// Create withdrawal request
const createWithdrawal = async (req, res) => {
  try {
    const { method, accountDetails, amount } = req.body; // amount is supplied in Nairas (₦) or USD

    if (!method || !accountDetails || !amount) {
      return res.status(400).json({ success: false, message: 'Please provide all details' });
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid withdrawal amount' });
    }

    // Get user's wallet
    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet || wallet.availableBalance < amountNum) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    // Min withdrawal rules based on design:
    // PayPal: Min $1 (₦1,500)
    // Others: Min $5 (₦7,500)
    const EXCHANGE_RATE = 1523.0; // matching designs
    const amountInUSD = amountNum / EXCHANGE_RATE;

    if (method === 'PayPal') {
      if (amountInUSD < 1.0) {
        return res.status(400).json({ success: false, message: 'Minimum withdrawal for PayPal is $1.00 (₦1,500)' });
      }
    } else {
      if (amountInUSD < 5.0) {
        return res.status(400).json({ success: false, message: `Minimum withdrawal for ${method} is $5.00 (₦7,615)` });
      }
    }

    // Deduct available balance, hold in pending balance
    wallet.availableBalance -= amountNum;
    wallet.pendingBalance += amountNum;
    await wallet.save();

    // Sync User balance
    const user = await User.findById(req.user._id);
    user.balance = wallet.availableBalance;
    user.pendingBalance = wallet.pendingBalance;
    await user.save();

    // Create withdrawal log
    const withdrawal = await Withdrawal.create({
      userId: req.user._id,
      amount: amountNum,
      method,
      accountDetails,
      status: 'pending'
    });

    // Create transaction log (flagged pending)
    await Transaction.create({
      userId: req.user._id,
      type: 'withdrawal',
      amount: -amountNum, // negative for withdrawal
      description: `Withdrawal to ${method} (${accountDetails})`,
      status: 'pending'
    });

    // Send notification
    await Notification.create({
      userId: req.user._id,
      title: 'Withdrawal Pending ⏳',
      message: `Your withdrawal request of ₦${amountNum.toLocaleString()} via ${method} is pending review.`,
      type: 'withdrawal'
    });

    res.status(201).json({
      success: true,
      message: 'Withdrawal request submitted successfully.',
      withdrawal
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error processing withdrawal' });
  }
};

// Fetch withdrawal history logs
const getWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ success: true, count: withdrawals.length, withdrawals });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error retrieving withdrawal logs' });
  }
};

module.exports = { createWithdrawal, getWithdrawals };
