const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');

const adminUser = [
  {
    "fullname": "Admin Canyuwork",
    "username": "admin",
    "email": "admin@canyuwork.com",
    "phone": "+234 800 000 0000",
    "country": "Nigeria",
    "passwordHash": "$2a$10$qDOiAekB44WyLRy.wc84AeTA.16uaA8LBPvjsgm75KhIAwOJrMHnS",
    "role": "admin",
    "isVerified": true,
    "referralCode": "admincode",
    "balance": 0,
    "totalEarnings": 0,
    "socialAccounts": {
      "instagramUsername": "",
      "tiktokUsername": "",
      "twitterUsername": "",
      "facebookUsername": "",
      "telegramUsername": "",
      "youtubeChannel": ""
    },
    "referredBy": null,
    "pendingBalance": 0,
    "totalWithdrawn": 0,
    "status": "active",
    "notificationPreferences": {
      "taskAlerts": true,
      "bonusRewards": true,
      "withdrawalAlerts": true,
      "referrals": true,
      "leaderboard": true,
      "systemUpdates": true,
      "marketing": false
    },
    "doNotDisturb": {
      "enabled": false,
      "quietHoursStart": "22:00",
      "quietHoursEnd": "07:00"
    },
    "dailyStreak": {
      "streakCount": 0,
      "lastCheckInDate": null
    },
    "ipAddress": "",
    "deviceFingerprint": "",
    "createdAt": 1779533282917,
    "_id": "6a1185e235c04d6ad2989aaa"
  }
];

const adminWallet = [
  {
    "userId": "6a1185e235c04d6ad2989aaa",
    "availableBalance": 0,
    "pendingBalance": 0,
    "totalEarned": 0,
    "totalWithdrawn": 0,
    "updatedAt": 1779533282918,
    "_id": "6a1185e26e95e26bddbcd016"
  }
];

// Verify directory exists
if (fs.existsSync(DATA_DIR)) {
  fs.writeFileSync(path.join(DATA_DIR, 'user.json'), JSON.stringify(adminUser, null, 2));
  fs.writeFileSync(path.join(DATA_DIR, 'wallet.json'), JSON.stringify(adminWallet, null, 2));
  fs.writeFileSync(path.join(DATA_DIR, 'task.json'), '[]');
  fs.writeFileSync(path.join(DATA_DIR, 'leaderboard.json'), '[]');
  fs.writeFileSync(path.join(DATA_DIR, 'transaction.json'), '[]');
  fs.writeFileSync(path.join(DATA_DIR, 'withdrawal.json'), '[]');
  fs.writeFileSync(path.join(DATA_DIR, 'notification.json'), '[]');
  fs.writeFileSync(path.join(DATA_DIR, 'tasksubmission.json'), '[]');
  fs.writeFileSync(path.join(DATA_DIR, 'referral.json'), '[]');
  fs.writeFileSync(path.join(DATA_DIR, 'referralcommission.json'), '[]');
  fs.writeFileSync(path.join(DATA_DIR, 'luckytask.json'), '[]');
  console.log('Successfully cleared all existing regular users, tasks, and logs!');
} else {
  console.error('Error: data directory not found.');
}
