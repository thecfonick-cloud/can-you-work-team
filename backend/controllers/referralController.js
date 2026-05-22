const Referral = require('../models/Referral');
const User = require('../models/User');
const TaskSubmission = require('../models/TaskSubmission');
const ReferralCommission = require('../models/ReferralCommission');

// Get referral details & lists
const getReferrals = async (req, res) => {
  try {
    const referrals = await Referral.find({ referrerId: req.user._id })
      .populate('referredUserId', 'fullname username email status createdAt')
      .sort({ createdAt: -1 });

    const totalReferrals = referrals.length;

    // Calculate Active, Pending and Completed referrals
    let activeReferralsCount = 0;
    let pendingReferralsCount = 0;
    let completedReferralsCount = 0;

    const referralHistory = [];

    for (const ref of referrals) {
      if (!ref.referredUserId) continue;

      const referee = ref.referredUserId;

      // Count tasks submitted by referee
      const submissionCount = await TaskSubmission.countDocuments({
        userId: referee._id,
        status: 'approved'
      });

      // Calculate total commission earned from this referee
      const commissions = await ReferralCommission.find({
        referrerId: req.user._id,
        referredUserId: referee._id
      });

      const totalEarnedFromReferee = commissions.reduce((sum, item) => sum + item.commissionAmount, 0) + ref.signupBonus + (ref.milestonesPaid.firstTaskPaid ? 200 : 0) + (ref.milestonesPaid.fifthTaskPaid ? 300 : 0);

      let status = 'Pending';
      if (submissionCount >= 5) {
        status = 'Completed';
        completedReferralsCount++;
      } else if (submissionCount > 0) {
        status = 'Active';
        activeReferralsCount++;
      } else {
        pendingReferralsCount++;
      }

      referralHistory.push({
        _id: ref._id,
        fullname: referee.fullname,
        username: referee.username,
        email: referee.email,
        status,
        joinedOn: referee.createdAt,
        totalEarned: totalEarnedFromReferee
      });
    }

    // Calculate earnings breakdown
    const commissionsSum = await ReferralCommission.find({ referrerId: req.user._id });
    const commissionTotal = commissionsSum.reduce((sum, item) => sum + item.commissionAmount, 0);

    // Sum milestones (firstTaskPaid ₦200, fifthTaskPaid ₦300)
    let milestoneTotal = 0;
    referrals.forEach(ref => {
      if (ref.milestonesPaid.firstTaskPaid) milestoneTotal += 200;
      if (ref.milestonesPaid.fifthTaskPaid) milestoneTotal += 300;
    });

    const totalEarnings = commissionTotal + milestoneTotal;
    const paidToWallet = totalEarnings; // All approved milestones and commissions are directly credited to wallet balance
    const pendingEarnings = 0; // commissions are credited instantly, so pending is 0

    res.json({
      success: true,
      referralCode: req.user.referralCode,
      referralLink: `https://canyuwork.com?ref=${req.user.referralCode}`,
      stats: {
        totalReferrals,
        activeReferrals: activeReferralsCount + completedReferralsCount,
        totalEarnings,
        pendingEarnings
      },
      earningsBreakdown: {
        totalEarnings,
        paidToWallet,
        pending: pendingEarnings
      },
      referralHistory
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error retrieving referral info' });
  }
};

module.exports = { getReferrals };
