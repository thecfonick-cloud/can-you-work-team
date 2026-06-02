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

    console.log('Database seeded with admin only.');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
