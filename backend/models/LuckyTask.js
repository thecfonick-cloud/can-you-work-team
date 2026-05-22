const mongoose = require('mongoose');

const LuckyTaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  rewardAmount: { type: Number, required: true }, // in Nairas (₦)
  assignedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active', 'completed', 'expired'], default: 'active' },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LuckyTask', LuckyTaskSchema);
