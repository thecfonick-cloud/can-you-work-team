const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['task_reward', 'referral_bonus', 'lucky_bonus', 'withdrawal', 'check_in_bonus', 'challenge_bonus', 'deposit'], 
    required: true 
  },
  amount: { type: Number, required: true }, 
  description: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed', 'rejected'], default: 'completed' },
  txHash: { type: String, default: '' },
  receipt: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
