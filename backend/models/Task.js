const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  platform: { type: String, required: true }, // e.g. instagram, facebook, youtube, telegram, survey, custom
  taskType: { 
    type: String, 
    enum: ['social_follow', 'social_like', 'survey', 'telegram_join', 'app_install', 'custom_task'], 
    required: true 
  },
  rewardAmount: { type: Number, required: true }, // in Nairas (₦)
  totalSlots: { type: Number, required: true },
  remainingSlots: { type: Number, required: true },
  taskLink: { type: String, required: true },
  instructions: [{ type: String }],
  
  requiredProof: {
    screenshot: { type: Boolean, default: true },
    username: { type: Boolean, default: true }
  },

  status: { type: String, enum: ['active', 'paused', 'completed'], default: 'active' },
  createdByAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', TaskSchema);
