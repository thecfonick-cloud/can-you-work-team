// Intercept require('mongoose') to use our custom mock
const path = require('path');
const mockMongoose = require('./mongoose-mock');
const Module = require('module');
const originalRequire = Module.prototype.require;
Module.prototype.require = function(request) {
  if (request === 'mongoose') {
    return mockMongoose;
  }
  return originalRequire.apply(this, arguments);
};

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Wallet = require('./models/Wallet');
const Task = require('./models/Task');
const LuckyTask = require('./models/LuckyTask');
const Transaction = require('./models/Transaction');
const Referral = require('./models/Referral');
const Notification = require('./models/Notification');
const Leaderboard = require('./models/Leaderboard');

require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/canyuwork';

async function seed() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    // Clear existing data
    console.log('Clearing database collections...');
    await User.deleteMany({});
    await Wallet.deleteMany({});
    await Task.deleteMany({});
    await LuckyTask.deleteMany({});
    await Transaction.deleteMany({});
    await Referral.deleteMany({});
    await Notification.deleteMany({});
    await Leaderboard.deleteMany({});

    console.log('Collections cleared.');

    // Create Hashed Passwords
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const userPasswordHash = await bcrypt.hash('password123', 10);

    // Seed Admin
    console.log('Creating Admin User...');
    const admin = await User.create({
      fullname: 'Admin Canyuwork',
      username: 'admin',
      email: 'admin@canyuwork.com',
      phone: '+234 800 000 0000',
      country: 'Nigeria',
      passwordHash: adminPasswordHash,
      role: 'admin',
      isVerified: true,
      referralCode: 'admincode',
      balance: 0,
      totalEarnings: 0
    });

    await Wallet.create({
      userId: admin._id,
      availableBalance: 0,
      pendingBalance: 0,
      totalEarned: 0,
      totalWithdrawn: 0
    });

    console.log('Admin user created successfully.');

    // Seed Regular User (matching frontend mock)
    console.log('Creating Mock Regular User...');
    const john = await User.create({
      fullname: 'John Goodluck',
      username: 'johng',
      email: 'johng@example.com',
      phone: '+234 801 234 5678',
      country: 'Nigeria',
      passwordHash: userPasswordHash,
      role: 'user',
      isVerified: true,
      referralCode: 'JohnG',
      balance: 25680.00,
      pendingBalance: 1230.00,
      totalEarnings: 48250.00,
      totalWithdrawn: 36800.00,
      socialAccounts: {
        instagramUsername: 'john_doe',
        tiktokUsername: 'johndoe_tt',
        twitterUsername: 'johndoe_x',
        facebookUsername: 'john.doe.fb',
        telegramUsername: 'johndoe_tg',
        youtubeChannel: 'JohnDoeChannel'
      }
    });

    await Wallet.create({
      userId: john._id,
      availableBalance: 25680.00,
      pendingBalance: 1230.00,
      totalEarned: 48250.00,
      totalWithdrawn: 36800.00
    });

    console.log('Mock regular user created successfully.');

    // Seed Tasks
    console.log('Creating Sample Tasks...');
    const tasksData = [
      {
        title: 'Follow @techworld on Instagram',
        description: 'Follow the Instagram page @techworld and stay active. After completing the task, upload a screenshot as proof.',
        platform: 'instagram',
        taskType: 'social_follow',
        rewardAmount: 10,
        totalSlots: 50000,
        remainingSlots: 43250,
        taskLink: 'https://instagram.com/techworld',
        instructions: [
          'Click on the Start Task button.',
          'You will be redirected to Instagram.',
          'Follow the page @techworld.',
          'Take a screenshot showing that you followed the page.',
          'Upload the screenshot proof below.'
        ],
        requiredProof: { screenshot: true, username: true },
        status: 'active',
        createdByAdmin: admin._id
      },
      {
        title: 'Like & Share this Facebook Post',
        description: 'Like the post and share it on your timeline. Take screenshot and upload.',
        platform: 'facebook',
        taskType: 'social_like',
        rewardAmount: 15,
        totalSlots: 30000,
        remainingSlots: 25180,
        taskLink: 'https://facebook.com/posts/1234',
        instructions: [
          'Go to the link.',
          'Like the post.',
          'Share the post on your timeline (must be public).',
          'Upload proof.'
        ],
        requiredProof: { screenshot: true, username: true },
        status: 'active',
        createdByAdmin: admin._id
      },
      {
        title: 'Watch this YouTube Video',
        description: 'Watch the video for at least 60 seconds. Like and subscribe.',
        platform: 'youtube',
        taskType: 'social_like',
        rewardAmount: 20,
        totalSlots: 20000,
        remainingSlots: 18975,
        taskLink: 'https://youtube.com/watch?v=123',
        instructions: [
          'Open the video link.',
          'Watch for at least 60 seconds.',
          'Like and subscribe to the channel.',
          'Upload a screenshot of the video showing you have watched and subscribed.'
        ],
        requiredProof: { screenshot: true, username: true },
        status: 'active',
        createdByAdmin: admin._id
      },
      {
        title: 'Join our Telegram Channel',
        description: 'Join the channel and stay active.',
        platform: 'telegram',
        taskType: 'telegram_join',
        rewardAmount: 10,
        totalSlots: 40000,
        remainingSlots: 31402,
        taskLink: 'https://t.me/canyuwork',
        instructions: [
          'Open the Telegram channel.',
          'Click join.',
          'Submit your telegram handle.'
        ],
        requiredProof: { screenshot: true, username: true },
        status: 'active',
        createdByAdmin: admin._id
      },
      {
        title: 'Comment on this Instagram Post',
        description: 'Leave a meaningful comment.',
        platform: 'instagram',
        taskType: 'social_like',
        rewardAmount: 20,
        totalSlots: 25000,
        remainingSlots: 22654,
        taskLink: 'https://instagram.com/p/123',
        instructions: [
          'Comment on the post.',
          'Take screenshot.'
        ],
        requiredProof: { screenshot: true, username: true },
        status: 'active',
        createdByAdmin: admin._id
      },
      {
        title: 'Invite 5 Friends to Join',
        description: 'Invite 5 friends using your referral link.',
        platform: 'invite_friends',
        taskType: 'custom_task',
        rewardAmount: 50,
        totalSlots: 10000,
        remainingSlots: 9108,
        taskLink: 'https://canyuwork.com',
        instructions: [
          'Copy your link.',
          'Share with friends.'
        ],
        requiredProof: { screenshot: false, username: false },
        status: 'active',
        createdByAdmin: admin._id
      },
      {
        title: 'Like our Facebook Page',
        description: 'Like the official Facebook page.',
        platform: 'facebook',
        taskType: 'social_like',
        rewardAmount: 10,
        totalSlots: 20000,
        remainingSlots: 16230,
        taskLink: 'https://facebook.com/canyuwork',
        instructions: [
          'Go to page.',
          'Like it.',
          'Upload proof.'
        ],
        requiredProof: { screenshot: true, username: true },
        status: 'active',
        createdByAdmin: admin._id
      }
    ];

    // Generate random social media microtasks dynamically as requested by the user
    console.log('Generating random social media microtasks...');
    const platforms = ['tiktok', 'instagram', 'twitter', 'youtube', 'facebook', 'telegram'];
    const actions = [
      { name: 'Follow', type: 'social_follow', descPrefix: 'Follow the page or handle', rewards: [10, 15, 20, 25] },
      { name: 'Like & Comment on', type: 'social_like', descPrefix: 'Like and leave a positive comment on this post', rewards: [15, 20, 30, 45] },
      { name: 'Share/Retweet', type: 'social_like', descPrefix: 'Share or retweet this post publicly', rewards: [20, 25, 35, 50] },
      { name: 'Subscribe to', type: 'social_follow', descPrefix: 'Subscribe to this channel and turn on notifications', rewards: [30, 40, 50, 75] }
    ];
    
    const randomAccounts = ['hype_deals', 'crypto_king', 'daily_funny', 'tech_insider', 'fashion_hub', 'gaming_legend', 'fitness_guru', 'chef_bites'];

    for (let i = 0; i < 15; i++) {
      const platform = platforms[Math.floor(Math.random() * platforms.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      const account = randomAccounts[Math.floor(Math.random() * randomAccounts.length)] + Math.floor(10 + Math.random() * 90);
      const title = `${action.name} @${account} on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`;
      const reward = action.rewards[Math.floor(Math.random() * action.rewards.length)];
      
      let link = '';
      if (platform === 'twitter') link = `https://twitter.com/${account}`;
      else if (platform === 'instagram') link = `https://instagram.com/${account}`;
      else if (platform === 'tiktok') link = `https://tiktok.com/@${account}`;
      else if (platform === 'youtube') link = `https://youtube.com/c/${account}`;
      else if (platform === 'facebook') link = `https://facebook.com/${account}`;
      else if (platform === 'telegram') link = `https://t.me/${account}`;

      const slots = Math.floor(5000 + Math.random() * 45000);
      const remaining = Math.floor(slots * (0.2 + Math.random() * 0.7));

      tasksData.push({
        title,
        description: `${action.descPrefix}. Take a screenshot showing you completed the action and submit it as proof.`,
        platform,
        taskType: action.type,
        rewardAmount: reward,
        totalSlots: slots,
        remainingSlots: remaining,
        taskLink: link,
        instructions: [
          `Click the link to redirect to ${platform}.`,
          `Perform the required ${action.name.toLowerCase()} action.`,
          `Capture a screenshot demonstrating completion.`,
          `Submit the screenshot along with your username.`
        ],
        requiredProof: { screenshot: true, username: true },
        status: 'active',
        createdByAdmin: admin._id
      });
    }

    await Task.insertMany(tasksData);
    console.log('Sample tasks inserted successfully.');

    // Seed Lucky Task
    console.log('Creating Lucky Task...');
    await LuckyTask.create({
      title: 'Complete Premium Survey',
      description: 'Share your opinion in this premium survey about online shopping and user experience.',
      rewardAmount: 5000,
      assignedUserId: john._id,
      status: 'active',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    console.log('Lucky task created.');

    // Seed Transactions
    console.log('Creating Mock Transactions...');
    await Transaction.insertMany([
      { userId: john._id, type: 'task_reward', amount: 304.60, description: 'Watch YouTube Video', status: 'completed' },
      { userId: john._id, type: 'task_reward', amount: 152.30, description: 'Follow on Instagram', status: 'completed' },
      { userId: john._id, type: 'withdrawal', amount: -30460.00, description: 'Withdrawal to PayPal (john@example.com)', status: 'completed' },
      { userId: john._id, type: 'referral_bonus', amount: 7615.00, description: 'Invite Bonus: 5 Friends Joined', status: 'completed' },
      { userId: john._id, type: 'task_reward', amount: 152.30, description: 'Like Facebook Page', status: 'completed' }
    ]);
    console.log('Transactions created.');

    // Seed Leaderboard entries
    console.log('Creating Leaderboard Rankings...');
    const leaderboardData = [
      { rank: 1, fullname: 'James O.', username: 'jameso', country: 'Nigeria', tasksCompleted: 1245, totalEarnings: 125450 },
      { rank: 2, fullname: 'Sarah J.', username: 'sarahj', country: 'South Africa', tasksCompleted: 1102, totalEarnings: 98230 },
      { rank: 3, fullname: 'Michael B.', username: 'michaelb', country: 'Kenya', tasksCompleted: 987, totalEarnings: 76540 },
      { rank: 4, fullname: 'Emily D.', username: 'emilyd', country: 'Ghana', tasksCompleted: 876, totalEarnings: 63210 },
      { rank: 5, fullname: 'David W.', username: 'davidw', country: 'Nigeria', tasksCompleted: 754, totalEarnings: 52890 },
      { rank: 6, fullname: 'Jessica T.', username: 'jessicat', country: 'Nigeria', tasksCompleted: 688, totalEarnings: 45670 },
      { rank: 7, fullname: 'Daniel A.', username: 'daniela', country: 'Ghana', tasksCompleted: 642, totalEarnings: 39880 },
      { rank: 8, fullname: 'Linda M.', username: 'lindam', country: 'Kenya', tasksCompleted: 589, totalEarnings: 34200 },
      { rank: 9, fullname: 'Chris P.', username: 'chrisp', country: 'South Africa', tasksCompleted: 532, totalEarnings: 28760 },
      { rank: 10, fullname: 'Olivia R.', username: 'oliviar', country: 'Nigeria', tasksCompleted: 498, totalEarnings: 25430 },
      { rank: 23, fullname: 'John Goodluck', username: 'johng', country: 'Nigeria', tasksCompleted: 156, totalEarnings: 48250 }
    ];

    for (const rank of leaderboardData) {
      let userId = john._id;
      if (rank.username !== 'johng') {
        const u = await User.create({
          fullname: rank.fullname,
          username: rank.username,
          email: `${rank.username}@example.com`,
          phone: '+234 000 000 0000',
          country: rank.country,
          passwordHash: userPasswordHash,
          role: 'user',
          isVerified: true,
          referralCode: `${rank.username}Ref`,
          balance: rank.totalEarnings,
          totalEarnings: rank.totalEarnings
        });
        userId = u._id;
      }
      await Leaderboard.create({
        userId: userId,
        rank: rank.rank,
        fullname: rank.fullname,
        username: rank.username,
        country: rank.country,
        tasksCompleted: rank.tasksCompleted,
        totalEarnings: rank.totalEarnings
      });
    }
    console.log('Leaderboard created.');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
