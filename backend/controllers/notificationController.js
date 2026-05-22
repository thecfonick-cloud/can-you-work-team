const Notification = require('../models/Notification');
const User = require('../models/User');

// Fetch notifications
const getNotifications = async (req, res) => {
  try {
    const { unread, type } = req.query;

    const query = { userId: req.user._id };

    if (unread === 'true') {
      query.isRead = false;
    }

    if (type && type !== 'All') {
      query.type = type.toLowerCase();
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(100);

    const unreadCount = await Notification.countDocuments({ userId: req.user._id, isRead: false });

    res.json({
      success: true,
      unreadCount,
      notifications
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error retrieving notifications' });
  }
};

// Mark notifications as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.body;

    if (id) {
      // Mark specific notification
      await Notification.updateOne({ _id: id, userId: req.user._id }, { isRead: true });
    } else {
      // Mark all as read
      await Notification.updateMany({ userId: req.user._id }, { isRead: true });
    }

    res.json({ success: true, message: 'Notifications marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error updating notifications' });
  }
};

// Get profile settings notifications preferences
const getPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('notificationPreferences doNotDisturb');
    res.json({
      success: true,
      notificationPreferences: user.notificationPreferences,
      doNotDisturb: user.doNotDisturb
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error retrieving notification preferences' });
  }
};

// Update notification preferences
const updatePreferences = async (req, res) => {
  try {
    const { notificationPreferences, doNotDisturb } = req.body;

    const user = await User.findById(req.user._id);

    if (notificationPreferences) {
      user.notificationPreferences = {
        ...user.notificationPreferences.toObject(),
        ...notificationPreferences
      };
    }

    if (doNotDisturb) {
      user.doNotDisturb = {
        ...user.doNotDisturb.toObject(),
        ...doNotDisturb
      };
    }

    await user.save();

    res.json({
      success: true,
      message: 'Notification preferences updated successfully',
      notificationPreferences: user.notificationPreferences,
      doNotDisturb: user.doNotDisturb
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error saving preferences' });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  getPreferences,
  updatePreferences
};
