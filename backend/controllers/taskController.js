const Task = require('../models/Task');
const TaskSubmission = require('../models/TaskSubmission');
const LuckyTask = require('../models/LuckyTask');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Fetch all active tasks
const getTasks = async (req, res) => {
  try {
    const { platform, sort } = req.query;

    const query = { status: 'active' };

    if (platform && platform !== 'all' && platform !== 'All Tasks') {
      // Handle title casing or platform name matching
      query.platform = platform.toLowerCase();
    }

    let taskQuery = Task.find(query);

    if (sort === 'Latest First' || sort === 'newest') {
      taskQuery = taskQuery.sort({ createdAt: -1 });
    } else {
      taskQuery = taskQuery.sort({ createdAt: -1 }); // Default to latest
    }

    const tasks = await taskQuery;
    res.json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error retrieving tasks' });
  }
};

// Fetch single task details + check user submission status
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Check if current user has already submitted proof for this task
    const submission = await TaskSubmission.findOne({
      taskId: task._id,
      userId: req.user._id
    });

    res.json({
      success: true,
      task,
      submitted: !!submission,
      submissionStatus: submission ? submission.status : null,
      submissionDetails: submission || null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error retrieving task details' });
  }
};

// Submit proof for task
const submitTaskProof = async (req, res) => {
  try {
    const { socialUsername, proofText } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (task.status !== 'active' || task.remainingSlots <= 0) {
      return res.status(400).json({ success: false, message: 'Task is no longer accepting submissions (no slots left)' });
    }

    // Check duplicate submission
    const existingSubmission = await TaskSubmission.findOne({
      taskId: task._id,
      userId: req.user._id
    });

    if (existingSubmission) {
      return res.status(400).json({ success: false, message: 'You have already submitted proof for this task' });
    }

    // Handle uploaded file
    let proofImage = { url: '', publicId: '' };
    if (req.file) {
      proofImage = {
        url: req.file.path || req.file.secure_url || `/uploads/${req.file.filename}`,
        publicId: req.file.filename || req.file.public_id || ''
      };
    } else if (task.requiredProof.screenshot) {
      return res.status(400).json({ success: false, message: 'Screenshot proof is required for this task' });
    }

    if (task.requiredProof.username && !socialUsername) {
      return res.status(400).json({ success: false, message: 'Social media username is required' });
    }

    // Create submission
    const submission = await TaskSubmission.create({
      userId: req.user._id,
      taskId: task._id,
      socialUsername: socialUsername || '',
      proofImage,
      proofText: proofText || '',
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Proof submitted successfully. Pending admin review.',
      submission
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error submitting task proof' });
  }
};

// Fetch current user's task logs
const getMyTasks = async (req, res) => {
  try {
    const submissions = await TaskSubmission.find({ userId: req.user._id })
      .populate('taskId')
      .sort({ createdAt: -1 });

    const grouped = {
      pending: [],
      approved: [],
      rejected: []
    };

    submissions.forEach(sub => {
      if (sub.status === 'pending') grouped.pending.push(sub);
      if (sub.status === 'approved') grouped.approved.push(sub);
      if (sub.status === 'rejected') grouped.rejected.push(sub);
    });

    res.json({
      success: true,
      total: submissions.length,
      grouped,
      submissions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error retrieving user task log' });
  }
};

// Fetch assigned Lucky Tasks
const getLuckyTasks = async (req, res) => {
  try {
    const now = new Date();
    const luckyTasks = await LuckyTask.find({
      assignedUserId: req.user._id,
      status: 'active',
      expiresAt: { $gt: now }
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: luckyTasks.length,
      luckyTasks
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error retrieving lucky tasks' });
  }
};

// Complete a Lucky Task (Survey, etc.)
const completeLuckyTask = async (req, res) => {
  try {
    const luckyTaskId = req.params.id;
    const userId = req.user._id;

    // Find the lucky task assigned to this user
    const luckyTask = await LuckyTask.findOne({
      _id: luckyTaskId,
      assignedUserId: userId,
      status: 'active'
    });

    if (!luckyTask) {
      return res.status(404).json({ success: false, message: 'Active Lucky Task not found or already completed.' });
    }

    // Check expiration
    if (luckyTask.expiresAt < new Date()) {
      luckyTask.status = 'expired';
      await luckyTask.save();
      return res.status(400).json({ success: false, message: 'Lucky Task has expired.' });
    }

    const reward = luckyTask.rewardAmount || 5000.0;

    // Update LuckyTask status to completed
    luckyTask.status = 'completed';
    await luckyTask.save();

    // Credit Wallet
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = await Wallet.create({
        userId,
        availableBalance: 0,
        pendingBalance: 0,
        totalEarned: 0,
        totalWithdrawn: 0
      });
    }

    wallet.availableBalance += reward;
    wallet.totalEarned += reward;
    await wallet.save();

    // Update User model fields to match wallet balance
    await User.findByIdAndUpdate(userId, {
      $inc: { balance: reward, totalEarnings: reward }
    });

    // Create a transaction record
    await Transaction.create({
      userId,
      type: 'task_reward',
      amount: reward,
      description: `Lucky Task: ${luckyTask.title}`,
      status: 'completed'
    });

    // Create a notification
    await Notification.create({
      userId,
      title: 'Lucky Task Completed! 🎁',
      message: `Congratulations! You earned ₦${reward.toLocaleString()} for completing "${luckyTask.title}".`,
      type: 'task'
    });

    res.json({
      success: true,
      message: 'Lucky task completed successfully!',
      rewardAmount: reward,
      balance: wallet.availableBalance
    });

  } catch (error) {
    console.error('Error completing lucky task:', error);
    res.status(500).json({ success: false, message: 'Server error completing lucky task' });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  submitTaskProof,
  getMyTasks,
  getLuckyTasks,
  completeLuckyTask
};
