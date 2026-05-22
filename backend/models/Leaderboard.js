const mongoose = require('mongoose');

const LeaderboardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  totalEarnings: { type: Number, default: 0 },
  referralsCount: { type: Number, default: 0 },
  weeklyRank: { type: Number, default: 0 },
  monthlyRank: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Leaderboard', LeaderboardSchema);
