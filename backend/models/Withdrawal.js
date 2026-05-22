const mongoose = require('mongoose');

const WithdrawalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true }, // in Nairas (₦) or equivalent USD stored
  method: { 
    type: String, 
    enum: ['PayPal', 'Bank Transfer', 'Bitcoin (BTC)', 'USDT (TRC20)', 'Payoneer'], 
    required: true 
  },
  accountDetails: { type: String, required: true }, // e.g. bank account details, crypto wallet address, or paypal email
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'paid'], 
    default: 'pending' 
  },
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // admin user who reviewed/paid it
  rejectionReason: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Withdrawal', WithdrawalSchema);
