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

// Local Storage Offline Database Engine
const initOfflineDb = () => {
  if (!localStorage.getItem('cw_offline_db_initialized')) {
    localStorage.setItem('cw_offline_users', JSON.stringify([
      {
        _id: '6a10cc2151f6a0a1d2981526',
        fullname: 'John Goodluck',
        username: 'johng',
        email: 'johng@example.com',
        phone: '+234 801 234 5678',
        country: 'Nigeria',
        referralCode: 'JohnG',
        isVerified: true,
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
        },
        password: 'password123'
      }
    ]));

    localStorage.setItem('cw_offline_wallets', JSON.stringify({
      '6a10cc2151f6a0a1d2981526': {
        availableBalance: 25680.00,
        pendingBalance: 1230.00,
        totalEarnings: 48250.00,
        totalWithdrawn: 36800.00
      }
    }));

    localStorage.setItem('cw_offline_tasks', JSON.stringify(MOCK_TASKS));
    localStorage.setItem('cw_offline_submissions', JSON.stringify([
      { _id: 's1', taskId: 't1', userId: '6a10cc2151f6a0a1d2981526', socialUsername: 'john_doe', status: 'approved', createdAt: new Date().toISOString() },
      { _id: 's2', taskId: 't2', userId: '6a10cc2151f6a0a1d2981526', socialUsername: 'john_doe', status: 'approved', createdAt: new Date().toISOString() },
      { _id: 's3', taskId: 't3', userId: '6a10cc2151f6a0a1d2981526', socialUsername: 'john_doe', status: 'approved', createdAt: new Date().toISOString() },
      { _id: 's4', taskId: 't4', userId: '6a10cc2151f6a0a1d2981526', socialUsername: 'johndoe_tg', status: 'approved', createdAt: new Date().toISOString() },
      { _id: 's5', taskId: 't5', userId: '6a10cc2151f6a0a1d2981526', socialUsername: 'john_doe', status: 'pending', createdAt: new Date().toISOString() }
    ]));

    localStorage.setItem('cw_offline_transactions', JSON.stringify([
      { _id: 'tx1', userId: '6a10cc2151f6a0a1d2981526', type: 'task_reward', description: 'Watch YouTube Video', amount: 304.60, status: 'Completed', createdAt: '2024-05-25T10:30:00Z' },
      { _id: 'tx2', userId: '6a10cc2151f6a0a1d2981526', type: 'task_reward', description: 'Follow on Instagram', amount: 152.30, status: 'Completed', createdAt: '2024-05-25T09:15:00Z' },
      { _id: 'tx3', userId: '6a10cc2151f6a0a1d2981526', type: 'withdrawal', description: 'Withdrawal to PayPal (john@example.com)', amount: -30460.00, status: 'Completed', createdAt: '2024-05-24T16:45:00Z' },
      { _id: 'tx4', userId: '6a10cc2151f6a0a1d2981526', type: 'referral_bonus', description: 'Invite Bonus: 5 Friends Joined', amount: 7615.00, status: 'Completed', createdAt: '2024-05-24T14:20:00Z' },
      { _id: 'tx5', userId: '6a10cc2151f6a0a1d2981526', type: 'task_reward', description: 'Like Facebook Page', amount: 152.30, status: 'Completed', createdAt: '2024-05-24T11:05:00Z' },
      { _id: 'tx6', userId: '6a10cc2151f6a0a1d2981526', type: 'withdrawal', description: 'Pending Payout (Minimum payout not reached)', amount: 18732.90, status: 'Pending', createdAt: '2024-05-24T10:00:00Z' }
    ]));

    localStorage.setItem('cw_offline_notifications', JSON.stringify(MOCK_NOTIFICATIONS));
    
    localStorage.setItem('cw_offline_streaks', JSON.stringify({
      '6a10cc2151f6a0a1d2981526': {
        streakCount: 7,
        checkedInToday: true,
        lastCheckedIn: new Date().toISOString().split('T')[0],
        streakList: [
          { day: 'Mon', checked: true },
          { day: 'Tue', checked: true },
          { day: 'Wed', checked: true },
          { day: 'Thu', checked: true },
          { day: 'Fri', checked: true },
          { day: 'Sat', checked: true },
          { day: 'Sun', checked: false }
        ]
      }
    }));

    localStorage.setItem('cw_offline_withdrawals', JSON.stringify([
      { _id: 'w1', userId: '6a10cc2151f6a0a1d2981526', amount: 30460, method: 'PayPal', accountDetails: 'john@example.com', status: 'paid', createdAt: '2024-05-24T16:45:00Z' },
      { _id: 'w2', userId: '6a10cc2151f6a0a1d2981526', amount: 76150, method: 'Bank Transfer', accountDetails: 'Access Bank - 0123456789', status: 'paid', createdAt: '2024-05-10T09:10:00Z' },
      { _id: 'w3', userId: '6a10cc2151f6a0a1d2981526', amount: 45690, method: 'Payoneer', accountDetails: 'payoneer@example.com', status: 'paid', createdAt: '2024-04-28T15:30:00Z' }
    ]));

    localStorage.setItem('cw_offline_referrals', JSON.stringify([
      { referrerId: '6a10cc2151f6a0a1d2981526', fullname: 'Sarah Johnson', email: 'sarahj@example.com', status: 'Active', joinedOn: '2024-05-25T00:00:00Z', totalEarned: 500 },
      { referrerId: '6a10cc2151f6a0a1d2981526', fullname: 'Michael Brown', email: 'michaelb@example.com', status: 'Active', joinedOn: '2024-05-24T00:00:00Z', totalEarned: 500 },
      { referrerId: '6a10cc2151f6a0a1d2981526', fullname: 'Emily Davis', email: 'emilyd@example.com', status: 'Pending', joinedOn: '2024-05-23T00:00:00Z', totalEarned: 0 },
      { referrerId: '6a10cc2151f6a0a1d2981526', fullname: 'David Wilson', email: 'davidw@example.com', status: 'Active', joinedOn: '2024-05-20T00:00:00Z', totalEarned: 500 },
      { referrerId: '6a10cc2151f6a0a1d2981526', fullname: 'Jessica Taylor', email: 'jessicat@example.com', status: 'Completed', joinedOn: '2024-05-18T00:00:00Z', totalEarned: 500 }
    ]));

    localStorage.setItem('cw_offline_db_initialized', 'true');
  }
};

const getOfflineUsers = () => { initOfflineDb(); return JSON.parse(localStorage.getItem('cw_offline_users') || '[]'); };
const saveOfflineUsers = (users) => localStorage.setItem('cw_offline_users', JSON.stringify(users));

const getOfflineWallets = () => { initOfflineDb(); return JSON.parse(localStorage.getItem('cw_offline_wallets') || '{}'); };
const saveOfflineWallets = (wallets) => localStorage.setItem('cw_offline_wallets', JSON.stringify(wallets));

const getOfflineTasks = () => { initOfflineDb(); return JSON.parse(localStorage.getItem('cw_offline_tasks') || '[]'); };
const saveOfflineTasks = (tasks) => localStorage.setItem('cw_offline_tasks', JSON.stringify(tasks));

const getOfflineSubmissions = () => { initOfflineDb(); return JSON.parse(localStorage.getItem('cw_offline_submissions') || '[]'); };
const saveOfflineSubmissions = (subs) => localStorage.setItem('cw_offline_submissions', JSON.stringify(subs));

const getOfflineTransactions = () => { initOfflineDb(); return JSON.parse(localStorage.getItem('cw_offline_transactions') || '[]'); };
const saveOfflineTransactions = (txs) => localStorage.setItem('cw_offline_transactions', JSON.stringify(txs));

const getOfflineNotifications = () => { initOfflineDb(); return JSON.parse(localStorage.getItem('cw_offline_notifications') || '[]'); };
const saveOfflineNotifications = (notifs) => localStorage.setItem('cw_offline_notifications', JSON.stringify(notifs));

const getOfflineStreaks = () => { initOfflineDb(); return JSON.parse(localStorage.getItem('cw_offline_streaks') || '{}'); };
const saveOfflineStreaks = (streaks) => localStorage.setItem('cw_offline_streaks', JSON.stringify(streaks));

const getOfflineWithdrawals = () => { initOfflineDb(); return JSON.parse(localStorage.getItem('cw_offline_withdrawals') || '[]'); };
const saveOfflineWithdrawals = (withdrawals) => localStorage.setItem('cw_offline_withdrawals', JSON.stringify(withdrawals));

const getOfflineReferrals = () => { initOfflineDb(); return JSON.parse(localStorage.getItem('cw_offline_referrals') || '[]'); };
const saveOfflineReferrals = (refs) => localStorage.setItem('cw_offline_referrals', JSON.stringify(refs));

const getActiveUserIdOffline = () => {
  const token = localStorage.getItem('canyuwork_token');
  if (!token) return null;
  if (token === 'mock_jwt_token_123') return '6a10cc2151f6a0a1d2981526';
  return token;
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
      const users = getOfflineUsers();
      let user = users.find(u => u.email.toLowerCase() === email.toLowerCase() || u.username.toLowerCase() === email.toLowerCase());
      if (user) {
        const wallets = getOfflineWallets();
        const wallet = wallets[user._id];
        if (wallet) {
          user.balance = wallet.availableBalance;
          user.pendingBalance = wallet.pendingBalance;
          user.totalEarnings = wallet.totalEarnings;
          user.totalWithdrawn = wallet.totalWithdrawn;
        }
        localStorage.setItem('canyuwork_token', user._id);
        return { success: true, user, token: user._id };
      }
      if (email.includes('johng') || email.includes('john@')) {
        const john = users.find(u => u.username === 'johng');
        if (john) {
          const wallets = getOfflineWallets();
          const wallet = wallets[john._id];
          if (wallet) {
            john.balance = wallet.availableBalance;
            john.pendingBalance = wallet.pendingBalance;
            john.totalEarnings = wallet.totalEarnings;
            john.totalWithdrawn = wallet.totalWithdrawn;
          }
        }
        localStorage.setItem('canyuwork_token', john._id);
        return { success: true, user: john, token: john._id };
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
      const users = getOfflineUsers();
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase() || u.username.toLowerCase() === username.toLowerCase())) {
        return { success: false, message: 'Username or email already exists' };
      }
      
      const newUserId = 'mock_user_' + Math.random().toString(36).substr(2, 9);
      const referralCode = username.toLowerCase() + Math.floor(100 + Math.random() * 900);
      
      const newUser = {
        _id: newUserId,
        fullname,
        username,
        email,
        phone,
        country,
        referralCode,
        referredBy: referredBy || null,
        isVerified: true,
        balance: 200.0,
        pendingBalance: 0.0,
        totalEarnings: 200.0,
        totalWithdrawn: 0.0,
        socialAccounts: {
          instagramUsername: '',
          tiktokUsername: '',
          twitterUsername: '',
          facebookUsername: '',
          telegramUsername: '',
          youtubeChannel: ''
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
          enabled: false,
          quietHoursStart: '22:00',
          quietHoursEnd: '07:00'
        }
      };

      users.push(newUser);
      saveOfflineUsers(users);

      const wallets = getOfflineWallets();
      wallets[newUserId] = {
        availableBalance: 200.0,
        pendingBalance: 0.0,
        totalEarnings: 200.0,
        totalWithdrawn: 0.0
      };
      saveOfflineWallets(wallets);

      const txs = getOfflineTransactions();
      txs.push({
        _id: 'tx_signup_' + Date.now(),
        userId: newUserId,
        type: 'challenge_bonus',
        description: 'Sign Up Bonus: Profile created successfully',
        amount: 200,
        status: 'Completed',
        createdAt: new Date().toISOString()
      });
      saveOfflineTransactions(txs);

      const notifs = getOfflineNotifications();
      notifs.push({
        _id: 'notif_signup_' + Date.now(),
        userId: newUserId,
        title: 'Bonus Earned! 🎉',
        message: 'You earned ₦200 for completing your profile sign up bonus.',
        type: 'bonus',
        isRead: false,
        createdAt: new Date().toISOString()
      });
      saveOfflineNotifications(notifs);

      const streaks = getOfflineStreaks();
      streaks[newUserId] = {
        streakCount: 0,
        checkedInToday: false,
        lastCheckedIn: null,
        streakList: [
          { day: 'Mon', checked: false },
          { day: 'Tue', checked: false },
          { day: 'Wed', checked: false },
          { day: 'Thu', checked: false },
          { day: 'Fri', checked: false },
          { day: 'Sat', checked: false },
          { day: 'Sun', checked: false }
        ]
      };
      saveOfflineStreaks(streaks);

      localStorage.setItem('canyuwork_token', newUserId);
      return { success: true, user: newUser, token: newUserId };
    }
  },

  logout: () => {
    localStorage.removeItem('canyuwork_token');
  },

  getDashboard: async () => {
    try {
      const res = await fetch(`${BASE_URL}/dashboard/overview`, { headers: getHeaders() });
      return await res.json();
    } catch (e) {
      const userId = getActiveUserIdOffline();
      const users = getOfflineUsers();
      const user = users.find(u => u._id === userId) || users[0];
      if (!user) return { success: false, message: 'Offline user not found' };

      const wallets = getOfflineWallets();
      const wallet = wallets[user._id] || { availableBalance: 0, pendingBalance: 0, totalEarnings: 0, totalWithdrawn: 0 };

      const subs = getOfflineSubmissions().filter(s => s.userId === user._id);
      const approvedCount = subs.filter(s => s.status === 'approved').length;
      const pendingCount = subs.filter(s => s.status === 'pending').length;

      const refs = getOfflineReferrals().filter(r => r.referrerId === user._id);

      const tasks = getOfflineTasks();
      const recentTasks = subs.slice(0, 5).map(sub => {
        const t = tasks.find(task => task._id === sub.taskId);
        return {
          _id: sub._id,
          title: t ? t.title : 'Task Completion',
          reward: t ? t.rewardAmount : 0,
          status: sub.status === 'approved' ? 'Completed' : sub.status === 'pending' ? 'Pending' : 'Rejected',
          date: sub.createdAt
        };
      });

      const txs = getOfflineTransactions().filter(tx => tx.userId === user._id && tx.type !== 'withdrawal');
      const earningsThisMonth = txs.reduce((sum, tx) => sum + tx.amount, 0);

      return {
        success: true,
        overview: {
          fullname: user.fullname,
          username: user.username,
          walletBalance: wallet.availableBalance,
          earningsThisMonth: earningsThisMonth,
          tasksCompleted: approvedCount,
          availableForWithdrawal: wallet.availableBalance - wallet.pendingBalance,
          isVerified: user.isVerified
        },
        recentTasks,
        earningsOverviewGraph: [
          { date: 'May 1', amount: earningsThisMonth * 0.1 },
          { date: 'May 8', amount: earningsThisMonth * 0.35 },
          { date: 'May 15', amount: earningsThisMonth * 0.6 },
          { date: 'May 22', amount: earningsThisMonth * 0.85 },
          { date: 'May 31', amount: earningsThisMonth }
        ],
        bottomStats: {
          totalReferrals: refs.length,
          referralEarnings: refs.filter(r => r.status === 'Active' || r.status === 'Completed').length * 210,
          tasksInProgress: pendingCount,
          totalWithdrawn: wallet.totalWithdrawn
        }
      };
    }
  },

  getTasks: async (platform = 'All Tasks') => {
    try {
      const res = await fetch(`${BASE_URL}/tasks?platform=${platform}`, { headers: getHeaders() });
      return await res.json();
    } catch (e) {
      const tasks = getOfflineTasks();
      let list = tasks;
      if (platform !== 'All Tasks' && platform !== 'all') {
        list = tasks.filter(t => t.platform.toLowerCase() === platform.toLowerCase());
      }
      return { success: true, tasks: list };
    }
  },

  getTaskById: async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/tasks/${id}`, { headers: getHeaders() });
      return await res.json();
    } catch (e) {
      const tasks = getOfflineTasks();
      const task = tasks.find(t => t._id === id);
      const userId = getActiveUserIdOffline();
      const submitted = getOfflineSubmissions().some(s => s.taskId === id && s.userId === userId);
      return { success: true, task, submitted };
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
      delete headers['Content-Type'];

      const res = await fetch(`${BASE_URL}/tasks/${id}/submit`, {
        method: 'POST',
        headers,
        body: formData
      });
      return await res.json();
    } catch (e) {
      const userId = getActiveUserIdOffline();
      const subs = getOfflineSubmissions();
      
      const tasks = getOfflineTasks();
      const taskIdx = tasks.findIndex(t => t._id === id);
      if (taskIdx !== -1) {
        tasks[taskIdx].remainingSlots = Math.max(0, tasks[taskIdx].remainingSlots - 1);
        saveOfflineTasks(tasks);
      }

      const newSub = {
        _id: 'sub_' + Date.now(),
        taskId: id,
        userId: userId,
        socialUsername,
        proofText,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      subs.push(newSub);
      saveOfflineSubmissions(subs);

      const notifs = getOfflineNotifications();
      notifs.push({
        _id: 'notif_sub_' + Date.now(),
        userId: userId,
        title: 'Task Proof Submitted',
        message: 'Your proof for task has been submitted and is pending review.',
        type: 'task',
        isRead: false,
        createdAt: new Date().toISOString()
      });
      saveOfflineNotifications(notifs);

      return { success: true, message: 'Proof submitted successfully (Simulated offline Mode)' };
    }
  },

  getLuckyTasks: async () => {
    try {
      const res = await fetch(`${BASE_URL}/tasks/lucky-tasks`, { headers: getHeaders() });
      return await res.json();
    } catch (e) {
      const isCompleted = localStorage.getItem('cw_lucky_task_completed_l1') === 'true';
      return { success: true, luckyTasks: isCompleted ? [] : MOCK_LUCKY_TASKS };
    }
  },

  completeLuckyTask: async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/tasks/lucky-tasks/${id}/complete`, {
        method: 'POST',
        headers: getHeaders()
      });
      return await res.json();
    } catch (e) {
      const userId = getActiveUserIdOffline();
      
      localStorage.setItem('cw_lucky_task_completed_l1', 'true');

      const wallets = getOfflineWallets();
      const wallet = wallets[userId];
      if (wallet) {
        wallet.availableBalance += 5000.0;
        wallet.totalEarnings += 5000.0;
        wallets[userId] = wallet;
        saveOfflineWallets(wallets);
      }

      const users = getOfflineUsers();
      const userIdx = users.findIndex(u => u._id === userId);
      if (userIdx !== -1 && wallet) {
        users[userIdx].balance = wallet.availableBalance;
        users[userIdx].totalEarnings = wallet.totalEarnings;
        saveOfflineUsers(users);
      }

      const txs = getOfflineTransactions();
      txs.push({
        _id: 'tx_lucky_' + Date.now(),
        userId: userId,
        type: 'task_reward',
        description: 'Lucky Task: Complete Premium Survey',
        amount: 5000.0,
        status: 'Completed',
        createdAt: new Date().toISOString()
      });
      saveOfflineTransactions(txs);

      const notifs = getOfflineNotifications();
      notifs.push({
        _id: 'notif_lucky_' + Date.now(),
        userId: userId,
        title: 'Lucky Task Completed! 🎁',
        message: 'Congratulations! You earned ₦5,000 for completing the Premium Survey.',
        type: 'task',
        isRead: false,
        createdAt: new Date().toISOString()
      });
      saveOfflineNotifications(notifs);

      return { 
        success: true, 
        message: 'Lucky task completed successfully! ₦5,000 credited to your wallet.',
        rewardAmount: 5000.0,
        balance: wallet ? wallet.availableBalance : 0
      };
    }
  },

  getMyTasks: async () => {
    try {
      const res = await fetch(`${BASE_URL}/tasks/my-logs`, { headers: getHeaders() });
      return await res.json();
    } catch (e) {
      const userId = getActiveUserIdOffline();
      const subs = getOfflineSubmissions().filter(s => s.userId === userId);
      const tasks = getOfflineTasks();
      
      const populatedSubs = subs.map(sub => {
        const t = tasks.find(task => task._id === sub.taskId) || { title: 'Unknown Task', rewardAmount: 0 };
        return {
          _id: sub._id,
          taskId: { title: t.title, rewardAmount: t.rewardAmount },
          status: sub.status,
          createdAt: sub.createdAt
        };
      });

      const grouped = {
        pending: populatedSubs.filter(s => s.status === 'pending'),
        approved: populatedSubs.filter(s => s.status === 'approved'),
        rejected: populatedSubs.filter(s => s.status === 'rejected')
      };

      return { success: true, grouped };
    }
  },

  getWallet: async () => {
    try {
      const res = await fetch(`${BASE_URL}/wallet`, { headers: getHeaders() });
      return await res.json();
    } catch (e) {
      const EXCHANGE_RATE = 1523.0;
      const userId = getActiveUserIdOffline();
      const wallets = getOfflineWallets();
      const wallet = wallets[userId] || { availableBalance: 0, pendingBalance: 0, totalEarnings: 0, totalWithdrawn: 0 };
      
      return {
        success: true,
        balances: {
          availableBalance: wallet.availableBalance,
          availableBalanceUSD: wallet.availableBalance / EXCHANGE_RATE,
          pendingBalance: wallet.pendingBalance,
          pendingBalanceUSD: wallet.pendingBalance / EXCHANGE_RATE,
          totalEarned: wallet.totalEarnings,
          totalEarnedUSD: wallet.totalEarnings / EXCHANGE_RATE,
          totalWithdrawn: wallet.totalWithdrawn,
          totalWithdrawnUSD: wallet.totalWithdrawn / EXCHANGE_RATE
        }
      };
    }
  },

  getTransactions: async () => {
    try {
      const res = await fetch(`${BASE_URL}/wallet/transactions`, { headers: getHeaders() });
      return await res.json();
    } catch (e) {
      const userId = getActiveUserIdOffline();
      const txs = getOfflineTransactions().filter(tx => tx.userId === userId);
      txs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return { success: true, transactions: txs };
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
      const userId = getActiveUserIdOffline();
      const wallets = getOfflineWallets();
      const wallet = wallets[userId];
      
      if (!wallet || wallet.availableBalance < amount) {
        return { success: false, message: 'Insufficient funds.' };
      }

      wallet.availableBalance -= amount;
      wallet.pendingBalance += amount;
      wallets[userId] = wallet;
      saveOfflineWallets(wallets);

      const txs = getOfflineTransactions();
      txs.push({
        _id: 'tx_w_' + Date.now(),
        userId: userId,
        type: 'withdrawal',
        description: `Pending Payout via ${method} (${accountDetails})`,
        amount: -amount,
        status: 'Pending',
        createdAt: new Date().toISOString()
      });
      saveOfflineTransactions(txs);

      const withdrawals = getOfflineWithdrawals();
      withdrawals.push({
        _id: 'w_' + Date.now(),
        userId: userId,
        amount: amount,
        method: method,
        accountDetails: accountDetails,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      saveOfflineWithdrawals(withdrawals);

      const users = getOfflineUsers();
      const userIdx = users.findIndex(u => u._id === userId);
      if (userIdx !== -1) {
        users[userIdx].balance = wallet.availableBalance;
        users[userIdx].pendingBalance = wallet.pendingBalance;
        users[userIdx].totalWithdrawn = wallet.totalWithdrawn;
        saveOfflineUsers(users);
      }

      const notifs = getOfflineNotifications();
      notifs.push({
        _id: 'notif_w_' + Date.now(),
        userId: userId,
        title: 'Withdrawal Request Received',
        message: `Your withdrawal request of ₦${amount} via ${method} has been submitted.`,
        type: 'withdrawal',
        isRead: false,
        createdAt: new Date().toISOString()
      });
      saveOfflineNotifications(notifs);

      return { success: true, message: `Withdrawal request of ₦${amount} via ${method} submitted successfully.` };
    }
  },

  getWithdrawalHistory: async () => {
    try {
      const res = await fetch(`${BASE_URL}/withdrawals`, { headers: getHeaders() });
      return await res.json();
    } catch (e) {
      const userId = getActiveUserIdOffline();
      const withdrawals = getOfflineWithdrawals().filter(w => w.userId === userId);
      withdrawals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return { success: true, withdrawals };
    }
  },

  getReferrals: async () => {
    try {
      const res = await fetch(`${BASE_URL}/referrals`, { headers: getHeaders() });
      return await res.json();
    } catch (e) {
      const userId = getActiveUserIdOffline();
      const users = getOfflineUsers();
      const user = users.find(u => u._id === userId) || users[0];
      
      const refs = getOfflineReferrals().filter(r => r.referrerId === user._id);
      const activeCount = refs.filter(r => r.status === 'Active' || r.status === 'Completed').length;
      const earnings = activeCount * 210;

      return {
        success: true,
        referralCode: user.referralCode,
        referralLink: `https://canyuwork.com?ref=${user.referralCode}`,
        stats: {
          totalReferrals: refs.length,
          activeReferrals: activeCount,
          totalEarnings: earnings,
          pendingEarnings: refs.filter(r => r.status === 'Pending').length * 210
        },
        earningsBreakdown: {
          totalEarnings: earnings,
          paidToWallet: earnings,
          pending: refs.filter(r => r.status === 'Pending').length * 210
        },
        referralHistory: refs
      };
    }
  },

  getLeaderboard: async () => {
    try {
      const res = await fetch(`${BASE_URL}/leaderboard`, { headers: getHeaders() });
      return await res.json();
    } catch (e) {
      const userId = getActiveUserIdOffline();
      const users = getOfflineUsers();
      
      const list = users.map((u, index) => {
        const subsCount = getOfflineSubmissions().filter(s => s.userId === u._id && s.status === 'approved').length;
        const totalEarnings = u.totalEarnings || u.balance || 0;
        return {
          fullname: u.fullname,
          username: u.username,
          country: u.country,
          tasksCompleted: subsCount || (u.username === 'johng' ? 156 : 10),
          totalEarnings: totalEarnings
        };
      });

      const combinedList = [...list];
      for (const mockItem of MOCK_LEADERBOARD) {
        if (!combinedList.some(item => item.username === mockItem.username)) {
          combinedList.push(mockItem);
        }
      }

      combinedList.sort((a, b) => b.totalEarnings - a.totalEarnings);

      const rankedList = combinedList.map((item, index) => ({
        rank: index + 1,
        ...item
      }));

      const activeUser = users.find(u => u._id === userId) || users[0];
      const activeUserRanked = rankedList.find(item => item.username === activeUser.username) || {
        rank: 23,
        fullname: activeUser.fullname,
        tasksCompleted: 0,
        totalEarnings: 0
      };

      return {
        success: true,
        stats: {
          totalUsers: Math.max(12458, rankedList.length),
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
          rank: activeUserRanked.rank,
          fullname: activeUserRanked.fullname,
          tasksCompleted: activeUserRanked.tasksCompleted,
          totalEarnings: activeUserRanked.totalEarnings
        },
        list: rankedList.slice(0, 10)
      };
    }
  },

  getBonuses: async () => {
    try {
      const res = await fetch(`${BASE_URL}/bonuses/progress`, { headers: getHeaders() });
      return await res.json();
    } catch (e) {
      const userId = getActiveUserIdOffline();
      const users = getOfflineUsers();
      const user = users.find(u => u._id === userId) || users[0];
      
      const streaks = getOfflineStreaks();
      const userStreak = streaks[user._id] || {
        streakCount: 0,
        checkedInToday: false,
        streakList: [
          { day: 'Mon', checked: false },
          { day: 'Tue', checked: false },
          { day: 'Wed', checked: false },
          { day: 'Thu', checked: false },
          { day: 'Fri', checked: false },
          { day: 'Sat', checked: false },
          { day: 'Sun', checked: false }
        ]
      };

      const wallets = getOfflineWallets();
      const wallet = wallets[user._id] || { availableBalance: 0, pendingBalance: 0, totalEarnings: 0, totalWithdrawn: 0 };

      const txs = getOfflineTransactions().filter(tx => tx.userId === user._id);
      const bonusTxs = txs.filter(tx => ['check_in_bonus', 'challenge_bonus', 'referral_bonus'].includes(tx.type));
      const totalBonusEarned = bonusTxs.reduce((sum, tx) => sum + tx.amount, 0);

      const approvedCount = getOfflineSubmissions().filter(s => s.userId === user._id && s.status === 'approved').length;
      const referralsCount = getOfflineReferrals().filter(r => r.referrerId === user._id).length;

      const bonuses = [
        { id: 'signup_bonus', title: 'Sign Up Bonus', description: 'Complete your profile and verify your email', reward: 200, type: 'One Time', status: 'Completed', progress: 1, target: 1 },
        { id: 'invite_5', title: 'Invite 5 Friends', description: 'Invite 5 friends to join using your referral link', reward: 300, type: 'Challenge', status: referralsCount >= 5 ? 'Completed' : 'In Progress', progress: Math.min(referralsCount, 5), target: 5 },
        { id: 'complete_50', title: 'Complete 50 Tasks', description: 'Complete 50 tasks to unlock this bonus', reward: 500, type: 'Challenge', status: approvedCount >= 50 ? 'Completed' : 'In Progress', progress: Math.min(approvedCount, 50), target: 50 },
        { id: 'daily_checkin_bonus', title: 'Daily Check-in', description: 'Check in every day and earn bonus', reward: 10, type: 'Daily', status: userStreak.checkedInToday ? 'Checked' : 'Check In', progress: userStreak.checkedInToday ? 1 : 0, target: 1 },
        { id: 'weekend_bonus', title: 'Weekend Bonus', description: 'Complete any 10 tasks this weekend', reward: 150, type: 'Limited Time', status: approvedCount >= 10 ? 'Completed' : 'In Progress', progress: Math.min(approvedCount, 10), target: 10, timeLeft: '1d 12h 45m' },
        { id: 'watch_5_videos', title: 'Watch 5 Videos Bonus', description: 'Watch 5 videos and earn extra', reward: 50, type: 'Offer', status: 'In Progress', progress: 0, target: 5 }
      ];

      return {
        success: true,
        streak: userStreak,
        summary: {
          totalBonusEarned: totalBonusEarned,
          pendingBonuses: wallet.pendingBalance * 0.1,
          availableToWithdraw: wallet.availableBalance
        },
        bonuses
      };
    }
  },

  checkIn: async () => {
    try {
      const res = await fetch(`${BASE_URL}/bonuses/check-in`, { method: 'POST', headers: getHeaders() });
      return await res.json();
    } catch (e) {
      const userId = getActiveUserIdOffline();
      const streaks = getOfflineStreaks();
      const userStreak = streaks[userId];

      if (!userStreak) return { success: false, message: 'Streak state not found.' };

      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];

      if (userStreak.lastCheckedIn === todayStr || userStreak.checkedInToday) {
        return { success: false, message: 'You have already checked in today.' };
      }

      userStreak.streakCount = (userStreak.streakCount >= 7) ? 1 : userStreak.streakCount + 1;
      userStreak.checkedInToday = true;
      userStreak.lastCheckedIn = todayStr;

      const dayOfWeekIdx = now.getDay() === 0 ? 6 : now.getDay() - 1;
      if (userStreak.streakList[dayOfWeekIdx]) {
        userStreak.streakList[dayOfWeekIdx].checked = true;
      }
      
      streaks[userId] = userStreak;
      saveOfflineStreaks(streaks);

      const wallets = getOfflineWallets();
      const wallet = wallets[userId];
      if (wallet) {
        wallet.availableBalance += 10.0;
        wallet.totalEarnings += 10.0;
        wallets[userId] = wallet;
        saveOfflineWallets(wallets);
      }

      const txs = getOfflineTransactions();
      txs.push({
        _id: 'tx_checkin_' + Date.now(),
        userId: userId,
        type: 'check_in_bonus',
        description: `Daily check-in (Day ${userStreak.streakCount})`,
        amount: 10.0,
        status: 'Completed',
        createdAt: now.toISOString()
      });
      saveOfflineTransactions(txs);

      const notifs = getOfflineNotifications();
      notifs.push({
        _id: 'notif_checkin_' + Date.now(),
        userId: userId,
        title: 'Check-in Reward Earned! 🌟',
        message: `You earned ₦10 for checking in Day ${userStreak.streakCount}.`,
        type: 'bonus',
        isRead: false,
        createdAt: now.toISOString()
      });
      saveOfflineNotifications(notifs);

      const users = getOfflineUsers();
      const userIdx = users.findIndex(u => u._id === userId);
      if (userIdx !== -1) {
        users[userIdx].balance = wallet ? wallet.availableBalance : users[userIdx].balance;
        saveOfflineUsers(users);
      }

      return {
        success: true,
        message: 'Checked in successfully!',
        streakCount: userStreak.streakCount,
        rewardAmount: 10,
        balance: wallet ? wallet.availableBalance : 0
      };
    }
  },

  getNotifications: async (type = 'All') => {
    try {
      const res = await fetch(`${BASE_URL}/notifications?type=${type}`, { headers: getHeaders() });
      return await res.json();
    } catch (e) {
      const userId = getActiveUserIdOffline();
      const allNotifs = getOfflineNotifications().filter(n => n.userId === userId);
      let list = allNotifs;
      if (type !== 'All') {
        list = allNotifs.filter(n => n.type.toLowerCase() === type.toLowerCase());
      }
      const unreadCount = allNotifs.filter(n => !n.isRead).length;
      return { success: true, unreadCount, notifications: list };
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
      const userId = getActiveUserIdOffline();
      const notifs = getOfflineNotifications();
      let updated = false;

      for (const n of notifs) {
        if (n.userId === userId) {
          if (!id || n._id === id) {
            n.isRead = true;
            updated = true;
          }
        }
      }

      if (updated) {
        saveOfflineNotifications(notifs);
      }
      return { success: true, message: 'Marked as read' };
    }
  },

  getPreferences: async () => {
    try {
      const res = await fetch(`${BASE_URL}/notifications/preferences`, { headers: getHeaders() });
      return await res.json();
    } catch (e) {
      const userId = getActiveUserIdOffline();
      const users = getOfflineUsers();
      const user = users.find(u => u._id === userId) || users[0];
      return {
        success: true,
        notificationPreferences: user.notificationPreferences,
        doNotDisturb: user.doNotDisturb
      };
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
      const userId = getActiveUserIdOffline();
      const users = getOfflineUsers();
      const userIdx = users.findIndex(u => u._id === userId);
      
      if (userIdx !== -1) {
        if (notificationPreferences) {
          users[userIdx].notificationPreferences = {
            ...users[userIdx].notificationPreferences,
            ...notificationPreferences
          };
        }
        if (doNotDisturb) {
          users[userIdx].doNotDisturb = {
            ...users[userIdx].doNotDisturb,
            ...doNotDisturb
          };
        }
        saveOfflineUsers(users);
      }
      return { success: true, message: 'Preferences updated successfully (Simulated)' };
    }
  },

  getProfile: async () => {
    try {
      const res = await fetch(`${BASE_URL}/user/profile`, { headers: getHeaders() });
      return await res.json();
    } catch (e) {
      const userId = getActiveUserIdOffline();
      const users = getOfflineUsers();
      const user = users.find(u => u._id === userId) || users[0];
      if (user) {
        const wallets = getOfflineWallets();
        const wallet = wallets[user._id];
        if (wallet) {
          user.balance = wallet.availableBalance;
          user.pendingBalance = wallet.pendingBalance;
          user.totalEarnings = wallet.totalEarnings;
          user.totalWithdrawn = wallet.totalWithdrawn;
        }
      }
      return { success: true, user };
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
      const userId = getActiveUserIdOffline();
      const users = getOfflineUsers();
      const userIdx = users.findIndex(u => u._id === userId);

      if (userIdx !== -1) {
        if (fullname) users[userIdx].fullname = fullname;
        if (username) users[userIdx].username = username;
        if (email) users[userIdx].email = email;
        if (phone) users[userIdx].phone = phone;
        if (country) users[userIdx].country = country;
        if (socialAccounts) {
          users[userIdx].socialAccounts = {
            ...users[userIdx].socialAccounts,
            ...socialAccounts
          };
        }
        saveOfflineUsers(users);
      }
      return { success: true, message: 'Profile updated successfully (Simulated)' };
    }
  }
};
