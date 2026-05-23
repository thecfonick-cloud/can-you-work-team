const User = require('../models/User');
const Task = require('../models/Task');
const TaskSubmission = require('../models/TaskSubmission');
const Referral = require('../models/Referral');
const ReferralCommission = require('../models/ReferralCommission');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const Withdrawal = require('../models/Withdrawal');
const Notification = require('../models/Notification');
const Leaderboard = require('../models/Leaderboard');

// 1. Create a task
const createTask = async (req, res) => {
  try {
    const { title, description, platform, taskType, rewardAmount, totalSlots, taskLink, instructions, requiredProof } = req.body;

    if (!title || !description || !platform || !taskType || !rewardAmount || !totalSlots || !taskLink) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const task = await Task.create({
      title,
      description,
      platform: platform.toLowerCase(),
      taskType,
      rewardAmount: parseFloat(rewardAmount),
      totalSlots: parseInt(totalSlots),
      remainingSlots: parseInt(totalSlots),
      taskLink,
      instructions: instructions || [],
      requiredProof: requiredProof || { screenshot: true, username: true },
      createdByAdmin: req.user._id,
      status: 'active'
    });

    res.status(201).json({ success: true, message: 'Task created successfully', task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error creating task' });
  }
};

// 2. Edit a task
const editTask = async (req, res) => {
  try {
    const { title, description, platform, taskType, rewardAmount, totalSlots, remainingSlots, taskLink, instructions, requiredProof, status } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (platform) task.platform = platform.toLowerCase();
    if (taskType) task.taskType = taskType;
    if (rewardAmount) task.rewardAmount = parseFloat(rewardAmount);
    if (totalSlots) task.totalSlots = parseInt(totalSlots);
    if (remainingSlots !== undefined) task.remainingSlots = parseInt(remainingSlots);
    if (taskLink) task.taskLink = taskLink;
    if (instructions) task.instructions = instructions;
    if (requiredProof) task.requiredProof = requiredProof;
    if (status) task.status = status;

    await task.save();
    res.json({ success: true, message: 'Task updated successfully', task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error updating task' });
  }
};

// 3. Review a task submission (Approve / Reject)
const reviewTaskSubmission = async (req, res) => {
  try {
    const { submissionId, status, rejectionReason } = req.body;

    if (!submissionId || !status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid review payload' });
    }

    const submission = await TaskSubmission.findById(submissionId).populate('taskId');
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    if (submission.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Submission has already been reviewed' });
    }

    const task = submission.taskId;
    const userId = submission.userId;

    if (status === 'approved') {
      // 1. Decrement remaining slots
      if (task.remainingSlots > 0) {
        task.remainingSlots -= 1;
        if (task.remainingSlots === 0) {
          task.status = 'completed';
        }
        await task.save();
      }

      // 2. Credit reward to User Wallet
      const wallet = await Wallet.findOne({ userId });
      if (wallet) {
        wallet.availableBalance += task.rewardAmount;
        wallet.totalEarned += task.rewardAmount;
        await wallet.save();

        // Sync User document
        const submissionUser = await User.findById(userId);
        if (submissionUser) {
          submissionUser.balance = wallet.availableBalance;
          submissionUser.totalEarnings = wallet.totalEarned;
          await submissionUser.save();
        }
      }

      // 3. Log Transaction
      await Transaction.create({
        userId,
        type: 'task_reward',
        amount: task.rewardAmount,
        description: `Task Completed: ${task.title}`,
        status: 'completed'
      });

      // 4. Create Notification
      await Notification.create({
        userId,
        title: 'Task Completed ✅',
        message: `Great job! You earned ₦${task.rewardAmount} for completing "${task.title}".`,
        type: 'task'
      });

      // 5. Handle Referral Commissions & Milestones
      const referral = await Referral.findOne({ referredUserId: userId });
      if (referral) {
        const referrerId = referral.referrerId;

        // a. Calculate 10% commission
        const commissionAmount = task.rewardAmount * 0.10;
        const referrerWallet = await Wallet.findOne({ userId: referrerId });
        
        if (referrerWallet) {
          referrerWallet.availableBalance += commissionAmount;
          referrerWallet.totalEarned += commissionAmount;
          await referrerWallet.save();

          const referrer = await User.findById(referrerId);
          if (referrer) {
            referrer.balance = referrerWallet.availableBalance;
            referrer.totalEarnings = referrerWallet.totalEarned;
            await referrer.save();
          }

          // Create ReferralCommission document
          await ReferralCommission.create({
            referrerId,
            referredUserId: userId,
            taskId: task._id,
            commissionAmount
          });

          // Log Referral Commission Transaction
          await Transaction.create({
            userId: referrerId,
            type: 'referral_bonus',
            amount: commissionAmount,
            description: `10% Commission on referred friend task: ${task.title}`,
            status: 'completed'
          });

          // Notify Referrer
          await Notification.create({
            userId: referrerId,
            title: 'Referral Commission! 💰',
            message: `You earned ₦${commissionAmount.toFixed(2)} from your referral's completion of "${task.title}".`,
            type: 'referral'
          });
        }

        // b. Milestone Bonuses Check: Count referee's approved tasks
        const approvedTasksCount = await TaskSubmission.countDocuments({
          userId: userId,
          status: 'approved'
        }) + 1; // including the one we are approving now

        // Milestone 1: 1st task completed -> ₦200 bonus
        if (approvedTasksCount >= 1 && !referral.milestonesPaid.firstTaskPaid) {
          referral.milestonesPaid.firstTaskPaid = true;
          await referral.save();

          if (referrerWallet) {
            referrerWallet.availableBalance += 200;
            referrerWallet.totalEarned += 200;
            await referrerWallet.save();

            const referrer = await User.findById(referrerId);
            if (referrer) {
              referrer.balance = referrerWallet.availableBalance;
              referrer.totalEarnings = referrerWallet.totalEarned;
              await referrer.save();
            }

            await Transaction.create({
              userId: referrerId,
              type: 'referral_bonus',
              amount: 200,
              description: 'Referral Milestone: Friend completed their first task',
              status: 'completed'
            });

            await Notification.create({
              userId: referrerId,
              title: 'Milestone Bonus Earned! 🎉',
              message: 'You earned ₦200 because your referred friend completed their first task.',
              type: 'bonus'
            });
          }
        }

        // Milestone 2: 5th task completed -> ₦300 bonus
        if (approvedTasksCount >= 5 && !referral.milestonesPaid.fifthTaskPaid) {
          referral.milestonesPaid.fifthTaskPaid = true;
          await referral.save();

          if (referrerWallet) {
            referrerWallet.availableBalance += 300;
            referrerWallet.totalEarned += 300;
            await referrerWallet.save();

            const referrer = await User.findById(referrerId);
            if (referrer) {
              referrer.balance = referrerWallet.availableBalance;
              referrer.totalEarnings = referrerWallet.totalEarned;
              await referrer.save();
            }

            await Transaction.create({
              userId: referrerId,
              type: 'referral_bonus',
              amount: 300,
              description: 'Referral Milestone: Friend completed 5 tasks',
              status: 'completed'
            });

            await Notification.create({
              userId: referrerId,
              title: 'Milestone Bonus Earned! 🏆',
              message: 'You earned ₦300 because your referred friend completed 5 tasks.',
              type: 'bonus'
            });
          }
        }
      }

      // Update submission status
      submission.status = 'approved';
      submission.reviewedBy = req.user._id;
      await submission.save();

    } else if (status === 'rejected') {
      submission.status = 'rejected';
      submission.rejectionReason = rejectionReason || 'Proofs are incorrect or blurred.';
      submission.reviewedBy = req.user._id;
      await submission.save();

      // Notify User of Rejection
      await Notification.create({
        userId,
        title: 'Task Rejected ❌',
        message: `Your proof submission for "${task.title}" was rejected. Reason: ${submission.rejectionReason}`,
        type: 'task'
      });
    }

    // Refresh Leaderboard cache for this user
    await refreshLeaderboard(userId);

    res.json({ success: true, message: `Submission reviewed successfully as ${status}`, submission });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error reviewing submission' });
  }
};

// 4. Approve/Reject pending withdrawal
const reviewWithdrawal = async (req, res) => {
  try {
    const { withdrawalId, status, rejectionReason } = req.body;

    if (!withdrawalId || !status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid payload' });
    }

    const withdrawal = await Withdrawal.findById(withdrawalId);
    if (!withdrawal) {
      return res.status(404).json({ success: false, message: 'Withdrawal not found' });
    }

    if (withdrawal.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Withdrawal already processed' });
    }

    const userId = withdrawal.userId;
    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.status(404).json({ success: false, message: 'Wallet not found' });
    }

    if (status === 'approved') {
      // Release from pendingBalance, increment totalWithdrawn
      wallet.pendingBalance -= withdrawal.amount;
      wallet.totalWithdrawn += withdrawal.amount;
      await wallet.save();

      // Sync User document
      const user = await User.findById(userId);
      user.pendingBalance = wallet.pendingBalance;
      user.totalWithdrawn = wallet.totalWithdrawn;
      await user.save();

      // Mark withdrawal as approved/paid
      withdrawal.status = 'paid';
      withdrawal.processedBy = req.user._id;
      await withdrawal.save();

      // Update Transaction status to completed
      await Transaction.updateOne(
        { userId, type: 'withdrawal', amount: -withdrawal.amount, status: 'pending' },
        { status: 'completed' }
      );

      // Notify User
      await Notification.create({
        userId,
        title: 'Withdrawal Successful 💰',
        message: `Your withdrawal of ₦${withdrawal.amount.toLocaleString()} via ${withdrawal.method} was successful.`,
        type: 'withdrawal'
      });

    } else if (status === 'rejected') {
      // Refund user wallet: restore availableBalance, deduct pendingBalance
      wallet.availableBalance += withdrawal.amount;
      wallet.pendingBalance -= withdrawal.amount;
      await wallet.save();

      // Sync User
      const user = await User.findById(userId);
      user.balance = wallet.availableBalance;
      user.pendingBalance = wallet.pendingBalance;
      await user.save();

      // Mark withdrawal as rejected
      withdrawal.status = 'rejected';
      withdrawal.rejectionReason = rejectionReason || 'Invalid details provided.';
      withdrawal.processedBy = req.user._id;
      await withdrawal.save();

      // Update Transaction status to failed
      await Transaction.updateOne(
        { userId, type: 'withdrawal', amount: -withdrawal.amount, status: 'pending' },
        { status: 'failed', description: `Withdrawal Rejected: ${rejectionReason}` }
      );

      // Notify User
      await Notification.create({
        userId,
        title: 'Withdrawal Rejected ❌',
        message: `Your withdrawal request of ₦${withdrawal.amount.toLocaleString()} was rejected. Reason: ${withdrawal.rejectionReason}. Funds returned.`,
        type: 'withdrawal'
      });
    }

    res.json({ success: true, message: `Withdrawal successfully reviewed as ${status}`, withdrawal });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error reviewing withdrawal' });
  }
};

// 5. Suspend User
const suspendUser = async (req, res) => {
  try {
    const { userId, status } = req.body; // status: 'suspended' or 'active'

    if (!userId || !['suspended', 'active'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid payload' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.status = status;
    await user.save();

    res.json({ success: true, message: `User status changed to ${status}`, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error updating user status' });
  }
};

// 6. Give User custom bonus
const createBonus = async (req, res) => {
  try {
    const { userId, amount, description } = req.body;

    if (!userId || !amount || !description) {
      return res.status(400).json({ success: false, message: 'Please provide all details' });
    }

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ success: false, message: 'User wallet not found' });
    }

    const bonusAmount = parseFloat(amount);
    wallet.availableBalance += bonusAmount;
    wallet.totalEarned += bonusAmount;
    await wallet.save();

    // Sync User
    const user = await User.findById(userId);
    user.balance = wallet.availableBalance;
    user.totalEarnings = wallet.totalEarned;
    await user.save();

    // Create transaction log
    await Transaction.create({
      userId,
      type: 'challenge_bonus',
      amount: bonusAmount,
      description: `Admin Bonus: ${description}`,
      status: 'completed'
    });

    // Notify User
    await Notification.create({
      userId,
      title: 'Bonus Awarded! 🎉',
      message: `Admin awarded you a bonus of ₦${bonusAmount} for: ${description}`,
      type: 'bonus'
    });

    // Refresh Leaderboard cache
    await refreshLeaderboard(userId);

    res.json({ success: true, message: 'Bonus successfully awarded', balance: wallet.availableBalance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error awarding custom bonus' });
  }
};

// 7. Get Admin Analytics
const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const suspendedUsers = await User.countDocuments({ status: 'suspended' });
    const activeTasks = await Task.countDocuments({ status: 'active' });
    const pendingSubmissions = await TaskSubmission.countDocuments({ status: 'pending' });

    const totalEarnedWallet = await Wallet.aggregate([{ $group: { _id: null, total: { $sum: '$totalEarned' } } }]);
    const totalWithdrawnWallet = await Wallet.aggregate([{ $group: { _id: null, total: { $sum: '$totalWithdrawn' } } }]);

    res.json({
      success: true,
      analytics: {
        totalUsers,
        suspendedUsers,
        activeTasks,
        pendingSubmissions,
        totalRewardsPaid: totalEarnedWallet[0] ? totalEarnedWallet[0].total : 0,
        totalWithdrawn: totalWithdrawnWallet[0] ? totalWithdrawnWallet[0].total : 0
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error retrieving analytics' });
  }
};

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
        referralsCount: referralsCount,
        updatedAt: Date.now()
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error('Leaderboard Refresh Error:', error);
  }
};

// 8. Get pending deposits
const getPendingDeposits = async (req, res) => {
  try {
    const deposits = await Transaction.find({ type: 'deposit', status: 'pending' }).populate('userId', 'fullname username');
    const formattedDeposits = deposits.map(tx => {
      const doc = tx.toObject ? tx.toObject() : tx;
      return {
        ...doc,
        fullname: doc.userId ? doc.userId.fullname : 'Unknown Advertiser',
        username: doc.userId ? doc.userId.username : 'unknown'
      };
    });
    res.json({ success: true, deposits: formattedDeposits });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error fetching pending deposits' });
  }
};

// 9. Approve deposit
const approveDeposit = async (req, res) => {
  try {
    const { transactionId } = req.body;
    if (!transactionId) {
      return res.status(400).json({ success: false, message: 'Transaction ID is required' });
    }

    const tx = await Transaction.findById(transactionId);
    if (!tx) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    if (tx.status !== 'pending' || tx.type !== 'deposit') {
      return res.status(400).json({ success: false, message: 'Transaction is not pending or is not a deposit' });
    }

    tx.status = 'completed';
    await tx.save();

    const wallet = await Wallet.findOne({ userId: tx.userId });
    if (wallet) {
      wallet.availableBalance += tx.amount;
      wallet.totalEarned += tx.amount;
      await wallet.save();

      const user = await User.findById(tx.userId);
      if (user) {
        user.balance = wallet.availableBalance;
        user.totalEarnings = wallet.totalEarned;
        await user.save();
      }
    }

    await Notification.create({
      userId: tx.userId,
      title: 'Deposit Approved! 💳',
      message: `Your deposit of ₦${Number(tx.amount).toLocaleString()} has been verified and credited.`,
      type: 'withdrawal'
    });

    res.json({ success: true, message: 'Deposit approved and funded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error approving deposit' });
  }
};

// 10. Reject deposit
const rejectDeposit = async (req, res) => {
  try {
    const { transactionId } = req.body;
    if (!transactionId) {
      return res.status(400).json({ success: false, message: 'Transaction ID is required' });
    }

    const tx = await Transaction.findById(transactionId);
    if (!tx) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    if (tx.status !== 'pending' || tx.type !== 'deposit') {
      return res.status(400).json({ success: false, message: 'Transaction is not pending or is not a deposit' });
    }

    tx.status = 'rejected';
    await tx.save();

    await Notification.create({
      userId: tx.userId,
      title: 'Deposit Rejected ❌',
      message: `Your deposit of ₦${Number(tx.amount).toLocaleString()} could not be verified by admin.`,
      type: 'withdrawal'
    });

    res.json({ success: true, message: 'Deposit rejected successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error rejecting deposit' });
  }
};

// 11. Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error fetching users' });
  }
};

// 12. Update user balance
const updateUserBalance = async (req, res) => {
  try {
    const { userId, balance } = req.body;
    if (!userId || balance === undefined) {
      return res.status(400).json({ success: false, message: 'User ID and balance are required' });
    }

    const wallet = await Wallet.findOne({ userId });
    if (wallet) {
      wallet.availableBalance = Number(balance);
      await wallet.save();
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.balance = Number(balance);
    await user.save();

    res.json({ success: true, message: 'Balance updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error updating user balance' });
  }
};

// 13. Get all campaigns
const getAllCampaigns = async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.json({ success: true, campaigns: tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error fetching campaigns' });
  }
};

// 14. Update campaign status (or delete)
const updateCampaignStatus = async (req, res) => {
  try {
    const { campaignId, status } = req.body;
    if (!campaignId || !status) {
      return res.status(400).json({ success: false, message: 'Campaign ID and status are required' });
    }

    if (status === 'deleted') {
      await Task.findByIdAndDelete(campaignId);
      return res.json({ success: true, message: 'Campaign deleted successfully' });
    }

    const task = await Task.findById(campaignId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    task.status = status;
    await task.save();

    res.json({ success: true, message: `Campaign status updated to ${status}`, campaign: task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error updating campaign status' });
  }
};

// 15. Get all submissions
const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await TaskSubmission.find({})
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
    res.status(500).json({ success: false, message: 'Server error fetching submissions' });
  }
};

// 16. Get all withdrawals
const getAllWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({}).populate('userId', 'fullname username');
    const formatted = withdrawals.map(w => {
      const doc = w.toObject ? w.toObject() : w;
      return {
        ...doc,
        fullname: doc.userId ? doc.userId.fullname : 'Unknown User',
        username: doc.userId ? doc.userId.username : 'unknown'
      };
    });
    res.json({ success: true, withdrawals: formatted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error fetching withdrawals' });
  }
};

module.exports = {
  createTask,
  editTask,
  reviewTaskSubmission,
  reviewWithdrawal,
  suspendUser,
  createBonus,
  getAnalytics,
  getPendingDeposits,
  approveDeposit,
  rejectDeposit,
  getAllUsers,
  updateUserBalance,
  getAllCampaigns,
  updateCampaignStatus,
  getAllSubmissions,
  getAllWithdrawals
};
