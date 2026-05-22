// Dynamic mock data matching all 14 screens exactly
const MOCK_USER = {
  fullname: 'John Goodluck',
  username: 'johng',
  email: 'johng@example.com',
  phone: '+234 801 234 5678',
  country: 'Nigeria',
  referralCode: 'JohnG',
  balance: 25680.00,
  pendingBalance: 1230.00,
  totalEarnings: 48250.00,
  totalWithdrawn: 36800.00,
  isVerified: true,
  socialAccounts: {
    instagramUsername: 'john_doe',
    tiktokUsername: 'johndoe_tt',
    twitterUsername: 'johndoe_x',
    facebookUsername: 'john.doe.fb',
    telegramUsername: 'johndoe_tg',
    youtubeChannel: 'JohnDoeChannel'
  },
  notificationPreferences: {
    taskAlerts: true,
    bonusRewards: true,
    withdrawalAlerts: true,
    referrals: true,
    leaderboard: true,
    systemUpdates: true,
    marketing: false
  },
  doNotDisturb: {
    enabled: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00'
  }
};

const MOCK_TASKS = [
  {
    _id: 't1',
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
      'Upload the screenshot below.'
    ],
    requiredProof: { screenshot: true, username: true },
    status: 'active'
  },
  {
    _id: 't2',
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
    status: 'active'
  },
  {
    _id: 't3',
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
    status: 'active'
  },
  {
    _id: 't4',
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
    status: 'active'
  },
  {
    _id: 't5',
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
    status: 'active'
  },
  {
    _id: 't6',
    title: 'Invite 5 Friends to Join',
    description: 'Invite 5 friends using your referral link.',
    platform: 'invite_friends',
    taskType: 'custom_task',
    rewardAmount: 50,
    totalSlots: 10000,
    remainingSlots: 9108,
    taskLink: '',
    instructions: [
      'Copy your link.',
      'Share with friends.'
    ],
    requiredProof: { screenshot: false, username: false },
    status: 'active'
  },
  {
    _id: 't7',
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
    status: 'active'
  }
];

const MOCK_LUCKY_TASKS = [
  {
    _id: 'l1',
    title: 'Complete Premium Survey',
    description: 'Share your opinion in this premium survey about online shopping and user experience.',
    rewardAmount: 5000, // ₦1,000 - ₦10,000 range, displays ₦5,000
    status: 'active',
    expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000 + 23 * 60 * 60 * 1000 + 45 * 60 * 1000), // 6d 23h 45m
  }
];

const MOCK_TRANSACTIONS = [
  { _id: 'tx1', type: 'task_reward', description: 'Watch YouTube Video', amount: 304.60, status: 'Completed', createdAt: '2024-05-25T10:30:00Z' }, // ₦304.60 ≈ $0.20
  { _id: 'tx2', type: 'task_reward', description: 'Follow on Instagram', amount: 152.30, status: 'Completed', createdAt: '2024-05-25T09:15:00Z' }, // ₦152.30 ≈ $0.10
  { _id: 'tx3', type: 'withdrawal', description: 'Withdrawal to PayPal (john@example.com)', amount: -30460.00, status: 'Completed', createdAt: '2024-05-24T16:45:00Z' }, // -$20
  { _id: 'tx4', type: 'referral_bonus', description: 'Invite Bonus: 5 Friends Joined', amount: 7615.00, status: 'Completed', createdAt: '2024-05-24T14:20:00Z' }, // +$5
  { _id: 'tx5', type: 'task_reward', description: 'Like Facebook Page', amount: 152.30, status: 'Completed', createdAt: '2024-05-24T11:05:00Z' }, // +$0.10
  { _id: 'tx6', type: 'withdrawal', description: 'Pending Payout (Minimum payout not reached)', amount: 18732.90, status: 'Pending', createdAt: '2024-05-24T10:00:00Z' } // +$12.30 pending
];

const MOCK_NOTIFICATIONS = [
  { _id: 'n1', title: 'Bonus Earned! 🎉', message: 'You earned ₦200 for completing your daily check-in.', type: 'bonus', isRead: false, createdAt: new Date(Date.now() - 2 * 60 * 1000) },
  { _id: 'n2', title: 'Task Completed', message: 'Great job! You earned ₦0.20 for completing "Watch YouTube Video".', type: 'task', isRead: false, createdAt: new Date(Date.now() - 15 * 60 * 1000) },
  { _id: 'n3', title: 'Withdrawal Successful', message: 'Your withdrawal of ₦1,000 to PayPal was successful.', type: 'withdrawal', isRead: true, createdAt: new Date(Date.now() - 60 * 60 * 1000) },
  { _id: 'n4', title: 'You moved up the leaderboard! 🚀', message: 'You are now in the top 25. Keep it up!', type: 'leaderboard', isRead: false, createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000) },
  { _id: 'n5', title: 'New Referral Joined', message: 'Sarah Johnson joined using your referral link.', type: 'referral', isRead: true, createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000) },
  { _id: 'n6', title: 'Bonus Available', message: 'You have ₦1,200 available to withdraw.', type: 'bonus', isRead: true, createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  { _id: 'n7', title: 'New Task Available', message: 'A new task "Like Facebook Page" is available. Start earning now!', type: 'task', isRead: false, createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  { _id: 'n8', title: 'System Update', message: "We've improved our platform for a better experience. Check it out!", type: 'system', isRead: true, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }
];

const MOCK_LEADERBOARD = [
  { rank: 1, fullname: 'James O.', username: 'jameso', country: 'Nigeria', tasksCompleted: 1245, totalEarnings: 125450 },
  { rank: 2, fullname: 'Sarah J.', username: 'sarahj', country: 'South Africa', tasksCompleted: 1102, totalEarnings: 98230 },
  { rank: 3, fullname: 'Michael B.', username: 'michaelb', country: 'Kenya', tasksCompleted: 987, totalEarnings: 76540 },
  { rank: 4, fullname: 'Emily D.', username: 'emilyd', country: 'Ghana', tasksCompleted: 876, totalEarnings: 63210 },
  { rank: 5, fullname: 'David W.', username: 'davidw', country: 'Nigeria', tasksCompleted: 754, totalEarnings: 52890 },
  { rank: 6, fullname: 'Jessica T.', username: 'jessicat', country: 'Nigeria', tasksCompleted: 688, totalEarnings: 45670 },
  { rank: 7, fullname: 'Daniel A.', username: 'daniela', country: 'Ghana', tasksCompleted: 642, totalEarnings: 39880 },
  { rank: 8, fullname: 'Linda M.', username: 'lindam', country: 'Kenya', tasksCompleted: 589, totalEarnings: 34200 },
  { rank: 9, fullname: 'Chris P.', username: 'chrisp', country: 'South Africa', tasksCompleted: 532, totalEarnings: 28760 },
  { rank: 10, fullname: 'Olivia R.', username: 'oliviar', country: 'Nigeria', tasksCompleted: 498, totalEarnings: 25430 }
];

const MOCK_REFERRALS_LIST = [
  { fullname: 'Sarah Johnson', email: 'sarahj@example.com', status: 'Active', joinedOn: '2024-05-25T00:00:00Z', totalEarned: 500 },
  { fullname: 'Michael Brown', email: 'michaelb@example.com', status: 'Active', joinedOn: '2024-05-24T00:00:00Z', totalEarned: 500 },
  { fullname: 'Emily Davis', email: 'emilyd@example.com', status: 'Pending', joinedOn: '2024-05-23T00:00:00Z', totalEarned: 0 },
  { fullname: 'David Wilson', email: 'davidw@example.com', status: 'Active', joinedOn: '2024-05-20T00:00:00Z', totalEarned: 500 },
  { fullname: 'Jessica Taylor', email: 'jessicat@example.com', status: 'Completed', joinedOn: '2024-05-18T00:00:00Z', totalEarned: 500 }
];

// Helper to make API calls to local node backend, with dynamic Mock data fallback
const BASE_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('canyuwork_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
    'x-device-fingerprint': localStorage.getItem('canyuwork_fingerprint') || 'mock_device_fingerprint_john'
  };
};

export const api = {
  // Authentication
  login: async (email, password) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password, deviceFingerprint: localStorage.getItem('canyuwork_fingerprint') })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('canyuwork_token', data.token);
      }
      return data;
    } catch (e) {
      // Mock Fallback
      if (email.includes('johng') || email.includes('john@')) {
        localStorage.setItem('canyuwork_token', 'mock_jwt_token_123');
        return { success: true, user: MOCK_USER, token: 'mock_jwt_token_123' };
      }
      return { success: false, message: 'Invalid credentials or offline.' };
    }
  },

  register: async (fullname, username, email, phone, country, password, referredBy) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ fullname, username, email, phone, country, password, referredBy, deviceFingerprint: 'mock_fingerprint' })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('canyuwork_token', data.token);
      }
      return data;
    } catch (e) {
      // Mock Fallback
      localStorage.setItem('canyuwork_token', 'mock_jwt_token_123');
      const newUser = { ...MOCK_USER, fullname, username, email, phone, country };
      return { success: true, user: newUser, token: 'mock_jwt_token_123' };
    }
  },

  logout: () => {
    localStorage.removeItem('canyuwork_token');
  },

  // Dashboard overview metrics
  getDashboard: async () => {
    try {
      const res = await fetch(`${BASE_URL}/dashboard/overview`, { headers: getHeaders() });
      return await res.json();
    } catch (e) {
      return {
        success: true,
        overview: {
          fullname: MOCK_USER.fullname,
          username: MOCK_USER.username,
          walletBalance: MOCK_USER.balance,
          earningsThisMonth: MOCK_USER.totalEarnings * 0.75,
          tasksCompleted: 320,
          availableForWithdrawal: MOCK_USER.balance - MOCK_USER.pendingBalance,
          isVerified: MOCK_USER.isVerified
        },
        recentTasks: [
          { _id: 's1', title: 'Follow @techworld on Instagram', reward: 10, status: 'Completed', date: new Date() },
          { _id: 's2', title: 'Like & Share this Facebook Post', reward: 15, status: 'Completed', date: new Date() },
          { _id: 's3', title: 'Watch this YouTube Video', reward: 20, status: 'Completed', date: new Date() },
          { _id: 's4', title: 'Join our Telegram Channel', reward: 10, status: 'Completed', date: new Date() },
          { _id: 's5', title: 'Comment on this Instagram Post', reward: 20, status: 'Pending', date: new Date() }
        ],
        earningsOverviewGraph: [
          { date: 'May 1', amount: 5000 },
          { date: 'May 8', amount: 15000 },
          { date: 'May 15', amount: 28000 },
          { date: 'May 22', amount: 39000 },
          { date: 'May 31', amount: 48250 }
        ],
        bottomStats: {
          totalReferrals: 25,
          referralEarnings: 5250,
          tasksInProgress: 2,
          totalWithdrawn: 36800
        }
      };
    }
  },

  // Tasks
  getTasks: async (platform = 'All Tasks') => {
    try {
      const res = await fetch(`${BASE_URL}/tasks?platform=${platform}`, { headers: getHeaders() });
      return await res.json();
    } catch (e) {
      let list = MOCK_TASKS;
      if (platform !== 'All Tasks' && platform !== 'all') {
        list = MOCK_TASKS.filter(t => t.platform.toLowerCase() === platform.toLowerCase());
      }
      return { success: true, tasks: list };
    }
  },

  getTaskById: async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/tasks/${id}`, { headers: getHeaders() });
      return await res.json();
    } catch (e) {
      const task = MOCK_TASKS.find(t => t._id === id);
      return { success: true, task, submitted: false };
    }
  },

  submitProof: async (id, socialUsername, proofText, file) => {
    try {
      const formData = new FormData();
      formData.append('socialUsername', socialUsername);
      formData.append('proofText', proofText);
      if (file) {
        formData.append('proofImage', file);
      }
      
      const headers = getHeaders();
      delete headers['Content-Type']; // Let browser set boundary for multipart

      const res = await fetch(`${BASE_URL}/tasks/${id}/submit`, {
        method: 'POST',
        headers,
        body: formData
      });
      return await res.json();
    } catch (e) {
      return { success: true, message: 'Proof submitted successfully (Simulated offline Mode)' };
    }
  },

  getLuckyTasks: async () => {
    try {
      const res = await fetch(`${BASE_URL}/tasks/lucky-tasks`, { headers: getHeaders() });
      return await res.json();
    } catch (e) {
      return { success: true, luckyTasks: MOCK_LUCKY_TASKS };
    }
  },

  getMyTasks: async () => {
    try {
      const res = await fetch(`${BASE_URL}/tasks/my-logs`, { headers: getHeaders() });
      return await res.json();
    } catch (e) {
      return {
        success: true,
        grouped: {
          pending: [
            { _id: 's5', taskId: { title: 'Comment on this Instagram Post', rewardAmount: 20 }, status: 'pending', createdAt: new Date() }
          ],
          approved: [
            { _id: 's1', taskId: { title: 'Follow @techworld on Instagram', rewardAmount: 10 }, status: 'approved', createdAt: new Date() }
          ],
          rejected: []
        }
      };
    }
  },

  // Wallet
  getWallet: async () => {
    try {
      const res = await fetch(`${BASE_URL}/wallet`, { headers: getHeaders() });
      return await res.json();
    } catch (e) {
      const EXCHANGE_RATE = 1523.0;
      return {
        success: true,
        balances: {
          availableBalance: MOCK_USER.balance,
          availableBalanceUSD: MOCK_USER.balance / EXCHANGE_RATE,
          pendingBalance: MOCK_USER.pendingBalance,
          pendingBalanceUSD: MOCK_USER.pendingBalance / EXCHANGE_RATE,
          totalEarned: MOCK_USER.totalEarnings,
          totalEarnedUSD: MOCK_USER.totalEarnings / EXCHANGE_RATE,
          totalWithdrawn: MOCK_USER.totalWithdrawn,
          totalWithdrawnUSD: MOCK_USER.totalWithdrawn / EXCHANGE_RATE
        }
      };
    }
  },

  getTransactions: async () => {
    try {
      const res = await fetch(`${BASE_URL}/wallet/transactions`, { headers: getHeaders() });
      return await res.json();
    } catch (e) {
      return { success: true, transactions: MOCK_TRANSACTIONS };
    }
  },

  requestWithdrawal: async (method, accountDetails, amount) => {
    try {
      const res = await fetch(`${BASE_URL}/withdrawals`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ method, accountDetails, amount })
      });
      return await res.json();
    } catch (e) {
      return { success: true, message: `Withdrawal request of ₦${amount} via ${method} submitted successfully.` };
    }
  },

  getWithdrawalHistory: async () => {
    try {
      const res = await fetch(`${BASE_URL}/withdrawals`, { headers: getHeaders() });
      return await res.json();
    } catch (e) {
      return {
        success: true,
        withdrawals: [
          { _id: 'w1', amount: 30460, method: 'PayPal', accountDetails: 'john@example.com', status: 'paid', createdAt: '2024-05-24T16:45:00Z' },
          { _id: 'w2', amount: 76150, method: 'Bank Transfer', accountDetails: 'Access Bank - 0123456789', status: 'paid', createdAt: '2024-05-10T09:10:00Z' },
          { _id: 'w3', amount: 45690, method: 'Payoneer', accountDetails: 'payoneer@example.com', status: 'paid', createdAt: '2024-04-28T15:30:00Z' }
        ]
      };
    }
  },

  // Referrals
  getReferrals: async () => {
    try {
      const res = await fetch(`${BASE_URL}/referrals`, { headers: getHeaders() });
      return await res.json();
    } catch (e) {
      return {
        success: true,
        referralCode: MOCK_USER.referralCode,
        referralLink: `https://canyuwork.com?ref=${MOCK_USER.referralCode}`,
        stats: {
          totalReferrals: 28,
          activeReferrals: 19,
          totalEarnings: 9350,
          pendingEarnings: 1250
        },
        earningsBreakdown: {
          totalEarnings: 9350,
          paidToWallet: 8100,
          pending: 1250
        },
        referralHistory: MOCK_REFERRALS_LIST
      };
    }
  },

  // Leaderboard
  getLeaderboard: async () => {
    try {
      const res = await fetch(`${BASE_URL}/leaderboard`, { headers: getHeaders() });
      return await res.json();
    } catch (e) {
      return {
        success: true,
        stats: {
          totalUsers: 12458,
          totalTasksCompleted: 245672,
          totalRewardsPaid: 2500000
        },
        topRewards: {
          firstPlace: 250000,
          secondPlace: 150000,
          thirdPlace: 100000,
          otherPlaces: 10000
        },
        currentRank: {
          rank: 23,
          fullname: 'John G.',
          tasksCompleted: 156,
          totalEarnings: 15230
        },
        list: MOCK_LEADERBOARD
      };
    }
  },

  // Bonuses & challenges
  getBonuses: async () => {
    try {
      const res = await fetch(`${BASE_URL}/bonuses/progress`, { headers: getHeaders() });
      return await res.json();
    } catch (e) {
      return {
        success: true,
        streak: {
          streakCount: 7,
          checkedInToday: true,
          streakList: [
            { day: 'Mon', checked: true },
            { day: 'Tue', checked: true },
            { day: 'Wed', checked: true },
            { day: 'Thu', checked: true },
            { day: 'Fri', checked: true },
            { day: 'Sat', checked: true },
            { day: 'Sun', checked: false }
          ]
        },
        summary: {
          totalBonusEarned: 1850,
          pendingBonuses: 650,
          availableToWithdraw: 1200
        },
        bonuses: [
          { id: 'signup_bonus', title: 'Sign Up Bonus', description: 'Complete your profile and verify your email', reward: 200, type: 'One Time', status: 'Completed', progress: 1, target: 1 },
          { id: 'invite_5', title: 'Invite 5 Friends', description: 'Invite 5 friends to join using your referral link', reward: 300, type: 'Challenge', status: 'In Progress', progress: 3, target: 5 },
          { id: 'complete_50', title: 'Complete 50 Tasks', description: 'Complete 50 tasks to unlock this bonus', reward: 500, type: 'Challenge', status: 'In Progress', progress: 28, target: 50 },
          { id: 'daily_checkin_bonus', title: 'Daily Check-in', description: 'Check in every day and earn bonus', reward: 10, type: 'Daily', status: 'Check In', progress: 0, target: 1 },
          { id: 'weekend_bonus', title: 'Weekend Bonus', description: 'Complete any 10 tasks this weekend', reward: 150, type: 'Limited Time', status: 'In Progress', progress: 0, target: 10, timeLeft: '1d 12h 45m' },
          { id: 'watch_5_videos', title: 'Watch 5 Videos Bonus', description: 'Watch 5 videos and earn extra', reward: 50, type: 'Offer', status: 'In Progress', progress: 2, target: 5 }
        ]
      };
    }
  },

  checkIn: async () => {
    try {
      const res = await fetch(`${BASE_URL}/bonuses/check-in`, { method: 'POST', headers: getHeaders() });
      return await res.json();
    } catch (e) {
      return { success: true, message: 'Checked in successfully! (Simulated)', streakCount: 7, rewardAmount: 10 };
    }
  },

  // Notifications
  getNotifications: async (type = 'All') => {
    try {
      const res = await fetch(`${BASE_URL}/notifications?type=${type}`, { headers: getHeaders() });
      return await res.json();
    } catch (e) {
      let list = MOCK_NOTIFICATIONS;
      if (type !== 'All') {
        list = MOCK_NOTIFICATIONS.filter(n => n.type.toLowerCase() === type.toLowerCase());
      }
      return { success: true, unreadCount: 3, notifications: list };
    }
  },

  markNotificationsRead: async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/notifications/read`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ id })
      });
      return await res.json();
    } catch (e) {
      return { success: true, message: 'Marked as read' };
    }
  },

  getPreferences: async () => {
    try {
      const res = await fetch(`${BASE_URL}/notifications/preferences`, { headers: getHeaders() });
      return await res.json();
    } catch (e) {
      return { success: true, notificationPreferences: MOCK_USER.notificationPreferences, doNotDisturb: MOCK_USER.doNotDisturb };
    }
  },

  updatePreferences: async (notificationPreferences, doNotDisturb) => {
    try {
      const res = await fetch(`${BASE_URL}/notifications/preferences`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ notificationPreferences, doNotDisturb })
      });
      return await res.json();
    } catch (e) {
      return { success: true, message: 'Preferences updated successfully (Simulated)' };
    }
  },

  // Settings / Profile
  getProfile: async () => {
    try {
      const res = await fetch(`${BASE_URL}/user/profile`, { headers: getHeaders() });
      return await res.json();
    } catch (e) {
      return { success: true, user: MOCK_USER };
    }
  },

  updateProfile: async (fullname, username, email, phone, country, socialAccounts) => {
    try {
      const res = await fetch(`${BASE_URL}/user/profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ fullname, username, email, phone, country, socialAccounts })
      });
      return await res.json();
    } catch (e) {
      return { success: true, message: 'Profile updated successfully (Simulated)' };
    }
  }
};
