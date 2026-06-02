const User = require('../models/User');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error retrieving profile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { fullname, username, email, phone, country, socialAccounts } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (username && username.trim().toLowerCase() !== user.username) {
      const sanitizedUsername = username.trim().toLowerCase();
      const usernameExists = await User.findOne({ username: sanitizedUsername });
      if (usernameExists) {
        return res.status(400).json({ success: false, message: 'Username is already taken' });
      }
      user.username = sanitizedUsername;
    }

    if (email && email.trim().toLowerCase() !== user.email) {
      const sanitizedEmail = email.trim().toLowerCase();
      const emailExists = await User.findOne({ email: sanitizedEmail });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'Email is already taken' });
      }
      user.email = sanitizedEmail;
    }

    if (fullname) user.fullname = fullname;
    if (phone) user.phone = phone;
    if (country) user.country = country;

    if (socialAccounts) {
      const currentSocial = user.socialAccounts ? 
        (typeof user.socialAccounts.toObject === 'function' ? user.socialAccounts.toObject() : user.socialAccounts) 
        : {};
      user.socialAccounts = {
        ...currentSocial,
        ...socialAccounts
      };
    }

    await user.save();

    const userObj = user.toObject();
    delete userObj.passwordHash;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: userObj
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
};

module.exports = { getProfile, updateProfile };
