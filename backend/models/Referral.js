const mongoose = require('mongoose');

const ReferralSchema = new mongoose.Schema({
  referrerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  referredUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  signupBonus: { type: Number, default: 0 },
  // Milestone track: to check if we paid out the ₦200 and ₦300 milestone rewards
  milestonesPaid: {
    firstTaskPaid: { type: Boolean, default: false }, // ₦200 at 1st task
    fifthTaskPaid: { type: Boolean, default: false }  // ₦300 at 5th task
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Referral', ReferralSchema);
