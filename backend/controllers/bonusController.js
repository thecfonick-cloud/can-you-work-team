const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Referral = require('../models/Referral');
const TaskSubmission = require('../models/TaskSubmission');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');

// Get all active challenges & check-in streak status
const getBonusProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    // 1. Calculate approved tasks count
    const approvedTasksCount = await TaskSubmission.countDocuments({
      userId,
      status: 'approved'
    });

    // 2. Count referrals
    const referralsCount = await Referral.countDocuments({ referrerId: userId });

    // 3. Count watch video tasks completed
    const watchVideoCount = await TaskSubmission.countDocuments({
      userId,
      status: 'approved',
      taskId: {
        $in: await require('../models/Task').find({ taskType: 'social_like', platform: 'youtube' }).distinct('_id')
      }
    });

    // 4. Determine check-in status
    const now = new Date();
    const todayStr = now.toDateString();
    
    let checkedInToday = false;
    if (user.dailyStreak.lastCheckInDate) {
      checkedInToday = user.dailyStreak.lastCheckInDate.toDateString() === todayStr;
    }

    // Determine current streak progress list (Mon-Sun check status)
    // For mock streak details in design: Mon-Sat checked, Sun unchecked
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const currentDayIdx = now.getDay() === 0 ? 6 : now.getDay() - 1; // 0 for Mon, 6 for Sun
    
    const streakList = daysOfWeek.map((day, idx) => {
      const checked = idx < currentDayIdx || (idx === currentDayIdx && checkedInToday);
      return { day, checked };
    });

    // 5. Structure list of bonuses matching mockup
    const wallet = await Wallet.findOne({ userId });
    const totalBonusEarned = await Transaction.aggregate([
      { $match: { userId, type: { $in: ['check_in_bonus', 'challenge_bonus', 'referral_bonus'] } } },
      { $group: { _id: null, sum: { $sum: '$amount' } } }
    ]);

    const bonuses = [
      {
        id: 'signup_bonus',
        title: 'Sign Up Bonus',
        description: 'Complete your profile and verify your email',
        reward: 200,
        type: 'One Time',
        status: 'Completed',
        progress: 1,
        target: 1
      },
      {
        id: 'invite_5',
        title: 'Invite 5 Friends',
        description: 'Invite 5 friends to join using your referral link',
        reward: 300,
        type: 'Challenge',
        status: referralsCount >= 5 ? 'Completed' : 'In Progress',
        progress: Math.min(referralsCount, 5),
        target: 5
      },
      {
        id: 'complete_50',
        title: 'Complete 50 Tasks',
        description: 'Complete 50 tasks to unlock this bonus',
        reward: 500,
        type: 'Challenge',
        status: approvedTasksCount >= 50 ? 'Completed' : 'In Progress',
        progress: Math.min(approvedTasksCount, 50),
        target: 50
      },
      {
        id: 'daily_checkin_bonus',
        title: 'Daily Check-in',
        description: 'Check in every day and earn bonus',
        reward: 10,
        type: 'Daily',
        status: checkedInToday ? 'Checked' : 'Check In',
        progress: checkedInToday ? 1 : 0,
        target: 1
      },
      {
        id: 'weekend_bonus',
        title: 'Weekend Bonus',
        description: 'Complete any 10 tasks this weekend',
        reward: 150,
        type: 'Limited Time',
        status: approvedTasksCount >= 10 ? 'Completed' : 'In Progress',
        progress: Math.min(approvedTasksCount, 10), // mock progress
        target: 10,
        timeLeft: '1d 12h 45m'
      },
      {
        id: 'watch_5_videos',
        title: 'Watch 5 Videos Bonus',
        description: 'Watch 5 videos and earn extra',
        reward: 50,
        type: 'Offer',
        status: watchVideoCount >= 5 ? 'Completed' : 'In Progress',
        progress: Math.min(watchVideoCount, 5),
        target: 5
      }
    ];

    res.json({
      success: true,
      streak: {
        streakCount: user.dailyStreak.streakCount,
        checkedInToday,
        streakList
      },
      summary: {
        totalBonusEarned: totalBonusEarned[0] ? totalBonusEarned[0].sum : 200, // fallback to signup bonus
        pendingBonuses: wallet.pendingBalance > 0 ? wallet.pendingBalance * 0.1 : 50, // mock pending check
        availableToWithdraw: wallet.availableBalance
      },
      bonuses
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error retrieving bonus details' });
  }
};

// Handle Daily Check-in
const checkIn = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const wallet = await Wallet.findOne({ userId });

    const now = new Date();
    const todayStr = now.toDateString();

    if (user.dailyStreak.lastCheckInDate) {
      const lastCheckInStr = user.dailyStreak.lastCheckInDate.toDateString();
      if (lastCheckInStr === todayStr) {
        return res.status(400).json({ success: false, message: 'You have already checked in today.' });
      }
    }

    // Determine streak increments
    let currentStreak = user.dailyStreak.streakCount;
    if (user.dailyStreak.lastCheckInDate) {
      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);
      
      if (user.dailyStreak.lastCheckInDate.toDateString() === yesterday.toDateString()) {
        currentStreak = currentStreak >= 7 ? 1 : currentStreak + 1;
      } else {
        currentStreak = 1; // broke streak, reset
      }
    } else {
      currentStreak = 1; // first check-in
    }

    // Credit reward ₦10
    wallet.availableBalance += 10;
    wallet.totalEarned += 10;
    await wallet.save();

    // Sync User
    user.balance = wallet.availableBalance;
    user.totalEarnings = wallet.totalEarned;
    user.dailyStreak = {
      streakCount: currentStreak,
      lastCheckInDate: now
    };
    await user.save();

    // Log Transaction
    await Transaction.create({
      userId,
      type: 'check_in_bonus',
      amount: 10,
      description: `Daily check-in (Day ${currentStreak})`,
      status: 'completed'
    });

    // Create Notification
    await Notification.create({
      userId,
      title: 'Bonus Earned! 🌟',
      message: `You earned ₦10 for completing your daily check-in streak Day ${currentStreak}.`,
      type: 'bonus'
    });

    res.json({
      success: true,
      message: 'Checked in successfully!',
      streakCount: currentStreak,
      rewardAmount: 10,
      balance: wallet.availableBalance
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error performing check-in' });
  }
};

module.exports = { getBonusProgress, checkIn };
