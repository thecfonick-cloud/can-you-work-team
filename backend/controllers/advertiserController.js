const User = require('../models/User');
const Task = require('../models/Task');
const TaskSubmission = require('../models/TaskSubmission');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');
const Leaderboard = require('../models/Leaderboard');
const Referral = require('../models/Referral');

// Helper: Refresh leaderboard row for a user
const refreshLeaderboard = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;
    
    const referralsCount = await Referral.countDocuments({ referrerId: userId });
    
    await Leaderboard.findOneAndUpdate(
      { userId },
      { 
        totalEarnings: user.totalEarnings,
        referralsCount,
        updatedAt: Date.now()
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error('Leaderboard Refresh Error:', error);
  }
};

// 1. Submit deposit
const depositFunds = async (req, res) => {
  try {
    const { amount, txHash, receipt } = req.body;
    if (!amount) {
      return res.status(400).json({ success: false, message: 'Amount is required' });
    }

    const transaction = await Transaction.create({
      userId: req.user._id,
      type: 'deposit',
      amount: Number(amount),
      description: `Mock USDT Deposit (Hash: ${txHash || 'N/A'})`,
      status: 'pending',
      txHash: txHash || '',
      receipt: receipt || ''
    });

    await Notification.create({
      userId: req.user._id,
      title: 'Deposit Submitted 💳',
      message: `Your deposit of ₦${Number(amount).toLocaleString()} is pending admin verification.`,
      type: 'withdrawal'
    });

    res.status(201).json({ success: true, message: 'Deposit submitted for verification', transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error processing deposit' });
  }
};

// 2. Create campaign
const createCampaign = async (req, res) => {
  try {
    const { title, platform, guidelines, rewardPerTask, totalBudget } = req.body;

    if (!title || !platform || !guidelines || !rewardPerTask || !totalBudget) {
      return res.status(400).json({ success: false, message: 'Please provide all details' });
    }

    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet || wallet.availableBalance < Number(totalBudget)) {
      return res.status(400).json({ success: false, message: 'Insufficient budget balance' });
    }

    wallet.availableBalance -= Number(totalBudget);
    await wallet.save();

    // Sync User document
    const user = await User.findById(req.user._id);
    if (user) {
      user.balance = wallet.availableBalance;
      await user.save();
    }

    const task = await Task.create({
      title,
      description: `Follow guidelines to complete the ${platform} task.`,
      platform: platform.toLowerCase(),
      taskType: 'custom_task',
      rewardAmount: Number(rewardPerTask),
      totalSlots: Math.floor(Number(totalBudget) / Number(rewardPerTask)),
      remainingSlots: Math.floor(Number(totalBudget) / Number(rewardPerTask)),
      taskLink: 'https://canyuwork.com',
      instructions: guidelines.split('\n').map(line => line.trim()).filter(line => line !== ''),
      createdByAdmin: req.user._id,
      status: 'active'
    });

    await Transaction.create({
      userId: req.user._id,
      type: 'withdrawal',
      amount: -Number(totalBudget),
      description: `Campaign Launched: ${title}`,
      status: 'completed'
    });

    await Notification.create({
      userId: req.user._id,
      title: 'Campaign Live! 🚀',
      message: `Your campaign "${title}" is live for ₦${Number(totalBudget).toLocaleString()} budget.`,
      type: 'task'
    });

    res.status(201).json({ success: true, message: 'Campaign created successfully', task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error launching campaign' });
  }
};

// 3. Get advertiser campaigns
const getAdvertiserCampaigns = async (req, res) => {
  try {
    const campaigns = await Task.find({ createdByAdmin: req.user._id });
    res.json({ success: true, campaigns });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error fetching advertiser campaigns' });
  }
};

// 4. Get advertiser submissions
const getAdvertiserSubmissions = async (req, res) => {
  try {
    const campaigns = await Task.find({ createdByAdmin: req.user._id });
    const campaignIds = campaigns.map(c => c._id);

    const submissions = await TaskSubmission.find({ taskId: { $in: campaignIds } })
      .populate('taskId', 'title platform rewardAmount')
      .populate('userId', 'fullname username');

    const formatted = submissions.map(s => {
      const doc = s.toObject ? s.toObject() : s;
      return {
        ...doc,
        taskTitle: doc.taskId ? doc.taskId.title : 'Deleted Task',
        platform: doc.taskId ? doc.taskId.platform : 'Unknown',
        reward: doc.taskId ? doc.taskId.rewardAmount : 0,
        username: doc.userId ? doc.userId.username : 'unknown',
        fullname: doc.userId ? doc.userId.fullname : 'Unknown User'
      };
    });

    res.json({ success: true, submissions: formatted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error fetching advertiser submissions' });
  }
};

// 5. Verify submission
const verifySubmission = async (req, res) => {
  try {
    const { submissionId, status } = req.body;

    if (!submissionId || !status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid payload' });
    }

    const submission = await TaskSubmission.findById(submissionId).populate('taskId');
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    const task = submission.taskId;
    if (task.createdByAdmin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to review this submission' });
    }

    if (submission.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Submission already processed' });
    }

    submission.status = status;
    submission.reviewedBy = req.user._id;
    await submission.save();

    if (status === 'approved') {
      if (task.remainingSlots > 0) {
        task.remainingSlots -= 1;
        if (task.remainingSlots === 0) {
          task.status = 'completed';
        }
        await task.save();
      }

      const earnerWallet = await Wallet.findOne({ userId: submission.userId });
      const reward = task.rewardAmount;
      if (earnerWallet) {
        earnerWallet.availableBalance += reward;
        earnerWallet.totalEarned += reward;
        await earnerWallet.save();

        const earner = await User.findById(submission.userId);
        if (earner) {
          earner.balance = earnerWallet.availableBalance;
          earner.totalEarnings = earnerWallet.totalEarned;
          await earner.save();
          await refreshLeaderboard(submission.userId);
        }
      }

      await Transaction.create({
        userId: submission.userId,
        type: 'task_reward',
        amount: reward,
        description: `Approved Task Proof: ${task.title}`,
        status: 'completed'
      });

      await Notification.create({
        userId: submission.userId,
        title: 'Proof Approved! ✅',
        message: `Your proof for "${task.title}" was approved. +₦${reward}`,
        type: 'task'
      });
    } else {
      await Notification.create({
        userId: submission.userId,
        title: 'Proof Rejected ❌',
        message: `Your proof for "${task.title}" was rejected. Please review task guidelines.`,
        type: 'task'
      });
    }

    res.json({ success: true, message: `Submission successfully ${status}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error verifying submission' });
  }
};

module.exports = {
  depositFunds,
  createCampaign,
  getAdvertiserCampaigns,
  getAdvertiserSubmissions,
  verifySubmission
};
