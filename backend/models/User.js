const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  country: { type: String, required: true },
  passwordHash: { type: String, required: true },
  
  socialAccounts: {
    instagramUsername: { type: String, default: '' },
    tiktokUsername: { type: String, default: '' },
    twitterUsername: { type: String, default: '' },
    facebookUsername: { type: String, default: '' },
    telegramUsername: { type: String, default: '' },
    youtubeChannel: { type: String, default: '' }
  },

  referralCode: { type: String, unique: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

  balance: { type: Number, default: 0 },
  pendingBalance: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  totalWithdrawn: { type: Number, default: 0 },

  status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  isVerified: { type: Boolean, default: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },

  notificationPreferences: {
    taskAlerts: { type: Boolean, default: true },
    bonusRewards: { type: Boolean, default: true },
    withdrawalAlerts: { type: Boolean, default: true },
    referrals: { type: Boolean, default: true },
    leaderboard: { type: Boolean, default: true },
    systemUpdates: { type: Boolean, default: true },
    marketing: { type: Boolean, default: false }
  },

  doNotDisturb: {
    enabled: { type: Boolean, default: false },
    quietHoursStart: { type: String, default: '22:00' },
    quietHoursEnd: { type: String, default: '07:00' }
  },

  dailyStreak: {
    streakCount: { type: Number, default: 0 },
    lastCheckInDate: { type: Date, default: null }
  },

  ipAddress: { type: String, default: '' },
  deviceFingerprint: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
