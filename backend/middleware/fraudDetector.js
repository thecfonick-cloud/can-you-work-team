const User = require('../models/User');

const fraudDetector = async (req, res, next) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const fingerprint = req.headers['x-device-fingerprint'] || req.body.deviceFingerprint || '';

    // Bind details to request
    req.clientIp = ip;
    req.clientFingerprint = fingerprint;

    // Skip check if fingerprint is not supplied yet (e.g. initial setup)
    if (!fingerprint) {
      return next();
    }

    // Identify current user ID (if logged in)
    const currentUserId = req.user ? req.user._id : null;

    // Find other users with the same device fingerprint
    const query = { deviceFingerprint: fingerprint };
    if (currentUserId) {
      query._id = { $ne: currentUserId };
    }

    const duplicateUsers = await User.find(query);

    if (duplicateUsers.length > 0) {
      const duplicateUsernames = duplicateUsers.map(u => u.username).join(', ');
      console.warn(`[FRAUD ALERT] Device Fingerprint matching detected! Device: ${fingerprint} is shared by current user and: ${duplicateUsernames}`);

      // We attach fraud warnings to req object so downstream controllers can take actions 
      // (e.g., auto-flagging withdrawals or blocking duplicate signups)
      req.fraudDetected = true;
      req.fraudLog = `Device fingerprint shared with: ${duplicateUsernames}`;
    }

    next();
  } catch (error) {
    console.error('Fraud Detector Error:', error);
    next(); // Don't crash request, fail safe but log
  }
};

module.exports = fraudDetector;
