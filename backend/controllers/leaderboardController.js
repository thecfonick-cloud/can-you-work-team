const User = require('../models/User');
const Leaderboard = require('../models/Leaderboard');
const TaskSubmission = require('../models/TaskSubmission');

// Get leaderboard entries
const getLeaderboard = async (req, res) => {
  try {
    const { period, country } = req.query; // period: This Month, All Time, This Week

    // Build filter query for user country
    let userFilter = { role: 'user', status: 'active' };
    if (country && country !== 'All Countries') {
      userFilter.country = country;
    }

    // Resolve matching users
    const users = await User.find(userFilter).select('_id fullname username country totalEarnings');
    const userIds = users.map(u => u._id);

    // Fetch leaderboard rows matching user ids, sorted by totalEarnings descending
    const leaderboardRows = await Leaderboard.find({ userId: { $in: userIds } })
      .populate('userId', 'fullname username country')
      .sort({ totalEarnings: -1 })
      .limit(10); // top 10

    const list = [];
    for (let idx = 0; idx < leaderboardRows.length; idx++) {
      const row = leaderboardRows[idx];
      if (!row.userId) continue;
      const completedCount = await TaskSubmission.countDocuments({
        userId: row.userId._id,
        status: 'approved'
      });
      list.push({
        rank: idx + 1,
        fullname: row.userId.fullname,
        username: row.userId.username,
        country: row.userId.country,
        tasksCompleted: completedCount,
        totalEarnings: row.totalEarnings
      });
    }

    // Find current user's rank
    const allLeaderboard = await Leaderboard.find({}).sort({ totalEarnings: -1 });
    const userRankIdx = allLeaderboard.findIndex(row => row.userId.toString() === req.user._id.toString());
    const userRank = userRankIdx !== -1 ? userRankIdx + 1 : '--';

    const userTasksCompleted = await TaskSubmission.countDocuments({
      userId: req.user._id,
      status: 'approved'
    });

    const currentRankDetails = {
      rank: userRank,
      fullname: req.user.fullname,
      username: req.user.username,
      tasksCompleted: userTasksCompleted,
      totalEarnings: req.user.totalEarnings
    };

    // Calculate Leaderboard Statistics
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalTasksCompleted = await TaskSubmission.countDocuments({ status: 'approved' });
    
    // Aggregation of total payouts
    const totalPayouts = await User.aggregate([
      { $group: { _id: null, sum: { $sum: '$totalEarnings' } } }
    ]);
    const totalRewardsPaid = totalPayouts[0] ? totalPayouts[0].sum : 0;

    res.json({
      success: true,
      stats: {
        totalUsers: totalUsers,
        totalTasksCompleted: totalTasksCompleted,
        totalRewardsPaid: totalRewardsPaid
      },
      topRewards: {
        firstPlace: 250000,
        secondPlace: 150000,
        thirdPlace: 100000,
        otherPlaces: 10000
      },
      currentRank: currentRankDetails,
      list
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error retrieving leaderboard' });
  }
};

module.exports = { getLeaderboard };
