const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Referral = require('../models/Referral');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'canyuwork_secret_key_12345', {
    expiresIn: '30d',
  });
};

// Register User
const register = async (req, res) => {
  try {
    const { fullname, username, email, phone, country, password, referredBy, socialAccounts, deviceFingerprint, role } = req.body;

    if (!fullname || !username || !email || !phone || !country || !password) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields' });
    }

    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedUsername = username.trim().toLowerCase();

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email: sanitizedEmail }, { username: sanitizedUsername }] });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Username or email already exists' });
    }

    // Check device fingerprint for duplicate signups
    if (deviceFingerprint) {
      const existingDevice = await User.findOne({ deviceFingerprint });
      if (existingDevice) {
        console.warn(`[REGISTRATION FRAUD WARNING] Duplicate device fingerprint detected for ${sanitizedUsername}. Fingerprint: ${deviceFingerprint}`);
        // We will let the account register but keep it flag-unverified, or restrict functionality
      }
    }

    // Resolve referredBy code if provided
    let referrerId = null;
    if (referredBy) {
      const referrer = await User.findOne({ referralCode: referredBy.trim().toLowerCase() });
      if (referrer) {
        referrerId = referrer._id;
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create unique referral code
    const generatedReferralCode = sanitizedUsername + Math.floor(100 + Math.random() * 900);

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

    // Create user
    const user = await User.create({
      fullname,
      username: sanitizedUsername,
      email: sanitizedEmail,
      phone,
      country,
      passwordHash,
      socialAccounts: socialAccounts || {},
      referralCode: generatedReferralCode,
      referredBy: referrerId,
      ipAddress: ip,
      deviceFingerprint: deviceFingerprint || '',
      isVerified: false, // Admin must verify, or auto-verify unless flagged
      role: role || 'user'
    });

    // Create user's wallet
    const wallet = await Wallet.create({
      userId: user._id,
      availableBalance: 0,
      pendingBalance: 0,
      totalEarned: 0,
      totalWithdrawn: 0
    });

    // Automatically award sign up bonus of ₦200 to earners
    if (user.role === 'user') {
      wallet.availableBalance += 200;
      wallet.totalEarned += 200;
      await wallet.save();

      user.balance = wallet.availableBalance;
      user.totalEarnings = wallet.totalEarned;
      await user.save();

      await Transaction.create({
        userId: user._id,
        type: 'challenge_bonus',
        amount: 200,
        description: 'Sign Up Bonus: Profile created successfully',
        status: 'completed'
      });

      await Notification.create({
        userId: user._id,
        title: 'Bonus Earned! 🎉',
        message: 'You earned ₦200 for completing your profile sign up bonus.',
        type: 'bonus'
      });
    } else {
      user.balance = 0;
      user.totalEarnings = 0;
      await user.save();
    }

    // Handle Referral logic
    if (referrerId) {
      await Referral.create({
        referrerId: referrerId,
        referredUserId: user._id,
        signupBonus: 0 // Will reward referrer when milestones are reached (₦200 on 1st task, ₦300 on 5th task)
      });

      // Notify the referrer that a new friend joined
      await Notification.create({
        userId: referrerId,
        title: 'New Referral Joined 👥',
        message: `${fullname} joined using your referral link.`,
        type: 'referral'
      });
    }

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        phone: user.phone,
        country: user.country,
        referralCode: user.referralCode,
        balance: user.balance,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// Login User
const login = async (req, res) => {
  try {
    const { email, password, deviceFingerprint } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email/username and password' });
    }

    const sanitizedEmail = email.trim().toLowerCase();

    // Find by email or username
    const user = await User.findOne({
      $or: [{ email: sanitizedEmail }, { username: sanitizedEmail }]
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended. Please contact support.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Update IP and Fingerprint
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    user.ipAddress = ip;
    if (deviceFingerprint) {
      user.deviceFingerprint = deviceFingerprint;
    }
    await user.save();

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        phone: user.phone,
        country: user.country,
        referralCode: user.referralCode,
        balance: user.balance,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

module.exports = { register, login };
