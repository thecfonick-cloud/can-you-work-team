// ─────────────────────────────────────────────────────────────
//  Admin Alexa — API Layer
//  Reads / writes the SAME localStorage keys as the main
//  CanYouWork offline app so both UIs stay in sync.
// ─────────────────────────────────────────────────────────────

// ── localStorage key constants ──────────────────────────────
const KEYS = {
  USERS:          'cw_offline_users',
  WALLETS:        'cw_offline_wallets',
  TASKS:          'cw_offline_tasks',
  SUBMISSIONS:    'cw_offline_submissions',
  TRANSACTIONS:   'cw_offline_transactions',
  NOTIFICATIONS:  'cw_offline_notifications',
  WITHDRAWALS:    'cw_offline_withdrawals',
  REFERRALS:      'cw_offline_referrals',
  STREAKS:        'cw_offline_streaks',
  ACTIVITY_LOG:   'cw_offline_activity_log',
};

// ── Helpers ─────────────────────────────────────────────────

function getLocalStorageItem(key, defaultVal = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) return defaultVal;
    return JSON.parse(raw);
  } catch {
    return defaultVal;
  }
}

function saveLocalStorageItem(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Push an entry to the activity log.
 * @param {'user'|'campaign'|'submission'|'deposit'|'withdrawal'|'notification'|'system'} type
 * @param {string} description  Human-readable summary
 * @param {object} metadata     Arbitrary context (userId, campaignId, etc.)
 */
function pushActivity(type, description, metadata = {}) {
  const log = getLocalStorageItem(KEYS.ACTIVITY_LOG, []);
  log.unshift({
    id:          generateId(),
    type,
    description,
    metadata,
    timestamp:   new Date().toISOString(),
  });
  saveLocalStorageItem(KEYS.ACTIVITY_LOG, log);
}

const OFFLINE_DB_VERSION = '5';
function initOfflineDb() {
  const storedVersion = localStorage.getItem('cw_offline_db_version');
  if (storedVersion !== OFFLINE_DB_VERSION) {
    // Clear all old keys
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    localStorage.removeItem('cw_offline_db_version');

    // Users
    const users = [
      {
        id: 'admin_user',
        _id: 'admin_user',
        fullname: 'Admin Alexa',
        username: 'admin',
        email: 'admin@canyuwork.com',
        phone: '+234 800 000 0000',
        country: 'Nigeria',
        referralCode: 'admincode',
        isVerified: true,
        role: 'admin',
        password: 'admin123',
        status: 'active',
        balance: 0,
        pendingBalance: 0,
        totalEarnings: 0,
        totalWithdrawn: 0,
        socialAccounts: {},
        notificationPreferences: { taskAlerts: true, bonusRewards: true, withdrawalAlerts: true, referrals: true, leaderboard: true, systemUpdates: true, marketing: false },
        doNotDisturb: { enabled: false, quietHoursStart: '22:00', quietHoursEnd: '07:00' }
      },
      {
        id: 'user_john',
        _id: 'user_john',
        fullname: 'John Goodluck',
        username: 'johng',
        email: 'johng@example.com',
        phone: '+234 801 234 5678',
        country: 'Nigeria',
        referralCode: 'JohnG',
        isVerified: true,
        role: 'user',
        password: 'pass123',
        status: 'active',
        balance: 25680.00,
        pendingBalance: 1230.00,
        totalEarnings: 48250.00,
        totalWithdrawn: 36800.00,
        socialAccounts: { instagramUsername: 'john_doe', tiktokUsername: 'johndoe_tt', twitterUsername: 'johndoe_x', facebookUsername: 'john.doe.fb', telegramUsername: 'johndoe_tg', youtubeChannel: 'JohnDoeChannel' },
        notificationPreferences: { taskAlerts: true, bonusRewards: true, withdrawalAlerts: true, referrals: true, leaderboard: true, systemUpdates: true, marketing: false },
        doNotDisturb: { enabled: false, quietHoursStart: '22:00', quietHoursEnd: '07:00' }
      },
      {
        id: 'user_sarah',
        _id: 'user_sarah',
        fullname: 'Sarah Johnson',
        username: 'sarahj',
        email: 'sarahj@example.com',
        phone: '+234 802 345 6789',
        country: 'Nigeria',
        referralCode: 'SarahJ',
        isVerified: true,
        role: 'user',
        password: 'pass123',
        status: 'active',
        balance: 12450.00,
        pendingBalance: 0.00,
        totalEarnings: 15450.00,
        totalWithdrawn: 3000.00,
        socialAccounts: { instagramUsername: 'sarah_j', tiktokUsername: 'sarahj_tt', twitterUsername: 'sarahj_x', facebookUsername: 'sarah.j.fb', telegramUsername: 'sarahj_tg', youtubeChannel: 'SarahJChannel' },
        notificationPreferences: { taskAlerts: true, bonusRewards: true, withdrawalAlerts: true, referrals: true, leaderboard: true, systemUpdates: true, marketing: false },
        doNotDisturb: { enabled: false, quietHoursStart: '22:00', quietHoursEnd: '07:00' }
      },
      {
        id: 'adv_nike',
        _id: 'adv_nike',
        fullname: 'Nike Advertiser',
        username: 'nike_ads',
        email: 'nike@example.com',
        phone: '+234 803 456 7890',
        country: 'Nigeria',
        referralCode: 'NikeAds',
        isVerified: true,
        role: 'advertiser',
        password: 'pass123',
        status: 'active',
        balance: 150000.00,
        pendingBalance: 0.00,
        totalEarnings: 0.00,
        totalWithdrawn: 0.00,
        socialAccounts: {},
        notificationPreferences: { taskAlerts: true, bonusRewards: true, withdrawalAlerts: true, referrals: true, leaderboard: true, systemUpdates: true, marketing: false },
        doNotDisturb: { enabled: false, quietHoursStart: '22:00', quietHoursEnd: '07:00' }
      }
    ];
    saveLocalStorageItem(KEYS.USERS, users);

    // Wallets
    const wallets = {
      'admin_user': { availableBalance: 0, balance: 0, pendingBalance: 0, totalEarnings: 0, earnings: 0, totalWithdrawn: 0, spent: 0 },
      'user_john': { availableBalance: 25680.00, balance: 25680.00, pendingBalance: 1230.00, totalEarnings: 48250.00, earnings: 48250.00, totalWithdrawn: 36800.00, spent: 0 },
      'user_sarah': { availableBalance: 12450.00, balance: 12450.00, pendingBalance: 0, totalEarnings: 15450.00, earnings: 15450.00, totalWithdrawn: 3000.00, spent: 0 },
      'adv_nike': { availableBalance: 150000.00, balance: 150000.00, pendingBalance: 0, totalEarnings: 0, earnings: 0, totalWithdrawn: 0, spent: 75000.00 }
    };
    saveLocalStorageItem(KEYS.WALLETS, wallets);

    // Tasks (Campaigns)
    const tasks = [
      {
        id: 't1',
        _id: 't1',
        title: 'Follow @techworld on Instagram',
        description: 'Follow the Instagram page @techworld and stay active. After completing the task, upload a screenshot as proof.',
        platform: 'instagram',
        taskType: 'social_follow',
        reward: 10,
        rewardAmount: 10,
        targetCount: 1000,
        totalSlots: 1000,
        currentCount: 450,
        subscribersCount: 450,
        totalCost: 10000,
        remainingSlots: 550,
        taskLink: 'https://instagram.com/techworld',
        socialLink: 'https://instagram.com/techworld',
        instructions: [
          'Click on the Start Task button.',
          'You will be redirected to Instagram.',
          'Follow the page @techworld.',
          'Take a screenshot showing that you followed the page.',
          'Upload the screenshot below.'
        ],
        guidelines: 'Follow @techworld on Instagram. Submit username and screenshot.',
        requiredProof: { screenshot: true, username: true },
        advertiserId: 'adv_nike',
        status: 'active',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 't2',
        _id: 't2',
        title: 'Like & Share this Facebook Post',
        description: 'Like the post and share it on your timeline. Take screenshot and upload.',
        platform: 'facebook',
        taskType: 'social_like',
        reward: 15,
        rewardAmount: 15,
        targetCount: 500,
        totalSlots: 500,
        currentCount: 500,
        subscribersCount: 500,
        totalCost: 7500,
        remainingSlots: 0,
        taskLink: 'https://facebook.com/posts/1234',
        socialLink: 'https://facebook.com/posts/1234',
        instructions: [
          'Go to the link.',
          'Like the post.',
          'Share the post on your timeline (must be public).',
          'Upload proof.'
        ],
        guidelines: 'Like and share the Facebook post publicly. Submit link and screenshot.',
        requiredProof: { screenshot: true, username: true },
        advertiserId: 'adv_nike',
        status: 'completed',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 't3',
        _id: 't3',
        title: 'Watch this YouTube Video',
        description: 'Watch the video for at least 60 seconds. Like and subscribe.',
        platform: 'youtube',
        taskType: 'social_like',
        reward: 20,
        rewardAmount: 20,
        targetCount: 1500,
        totalSlots: 1500,
        currentCount: 0,
        subscribersCount: 0,
        totalCost: 30000,
        remainingSlots: 1500,
        taskLink: 'https://youtube.com/watch?v=123',
        socialLink: 'https://youtube.com/watch?v=123',
        instructions: [
          'Open the video link.',
          'Watch for at least 60 seconds.',
          'Like and subscribe to the channel.',
          'Upload a screenshot.'
        ],
        guidelines: 'Watch at least 60s, like, and subscribe. Submit proof.',
        requiredProof: { screenshot: true, username: true },
        advertiserId: 'adv_nike',
        status: 'pending_payment',
        referenceNumber: 'TXN8892104859',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    saveLocalStorageItem(KEYS.TASKS, tasks);

    // Submissions
    const submissions = [
      {
        id: 's1',
        _id: 's1',
        taskId: 't1',
        campaignId: 't1',
        userId: 'user_john',
        socialUsername: 'john_doe_ig',
        proofText: 'Followed as @john_doe_ig',
        status: 'approved',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        approvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 's2',
        _id: 's2',
        taskId: 't1',
        campaignId: 't1',
        userId: 'user_sarah',
        socialUsername: 'sarah_j_ig',
        proofText: 'Followed. Check screenshot.',
        status: 'pending',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      }
    ];
    saveLocalStorageItem(KEYS.SUBMISSIONS, submissions);

    // Withdrawals
    const withdrawals = [
      {
        id: 'w1',
        _id: 'w1',
        userId: 'user_john',
        fullname: 'John Goodluck',
        username: 'johng',
        method: 'PayPal',
        accountDetails: 'john@example.com',
        amount: 30460.00,
        status: 'paid',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        paidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'w2',
        _id: 'w2',
        userId: 'user_john',
        fullname: 'John Goodluck',
        username: 'johng',
        method: 'Bank Transfer',
        accountDetails: 'Access Bank - 0123456789',
        amount: 18732.90,
        status: 'pending',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      }
    ];
    saveLocalStorageItem(KEYS.WITHDRAWALS, withdrawals);

    // Transactions
    const transactions = [
      {
        id: 'tx1',
        _id: 'tx1',
        userId: 'adv_nike',
        type: 'deposit',
        amount: 75000.00,
        status: 'completed',
        description: 'Fund wallet via Crypto',
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'tx2',
        _id: 'tx2',
        userId: 'adv_nike',
        type: 'deposit',
        amount: 150000.00,
        status: 'completed',
        description: 'Fund wallet via Bank Transfer',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'tx3',
        _id: 'tx3',
        userId: 'user_john',
        type: 'withdrawal',
        amount: -30460.00,
        status: 'completed',
        description: 'Withdrawal to PayPal (john@example.com)',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    saveLocalStorageItem(KEYS.TRANSACTIONS, transactions);

    // Activity Log
    const activityLog = [
      {
        id: 'act1',
        _id: 'act1',
        type: 'system',
        description: 'Admin Alexa command cockpit initialized',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'act2',
        _id: 'act2',
        type: 'deposit',
        description: 'Advertiser "Nike Advertiser" requested ₦75,000 deposit',
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'act3',
        _id: 'act3',
        type: 'campaign',
        description: 'Campaign "Follow @techworld on Instagram" created by Nike Advertiser',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'act4',
        _id: 'act4',
        type: 'user_signup',
        description: 'User "John Goodluck" signed up to CanYouWork',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'act5',
        _id: 'act5',
        type: 'submission',
        description: 'User johng submitted proof for "Follow @techworld on Instagram"',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'act6',
        _id: 'act6',
        type: 'submission',
        description: 'Submission s1 approved by Nike Advertiser',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'act7',
        _id: 'act7',
        type: 'withdrawal',
        description: 'User johng requested ₦18,732.90 payout via Bank Transfer',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      }
    ];
    saveLocalStorageItem(KEYS.ACTIVITY_LOG, activityLog);

    saveLocalStorageItem(KEYS.NOTIFICATIONS, []);
    saveLocalStorageItem(KEYS.REFERRALS, []);
    saveLocalStorageItem(KEYS.STREAKS, {});
    localStorage.setItem('cw_offline_db_version', OFFLINE_DB_VERSION);
  }
}

// Run initialization on file load
initOfflineDb();

// ── Exported Admin API ──────────────────────────────────────

export const adminApi = {

  // ──────────────────────────── AUTH ────────────────────────

  /** 1. Admin login — checks cw_offline_users for an admin‑role match */
  login(email, password) {
    const users = getLocalStorageItem(KEYS.USERS, []);
    const user = users.find(
      (u) =>
        u.email === email &&
        u.password === password &&
        (u.role === 'admin' || u.role === 'superadmin')
    );
    if (!user) {
      return { success: false, message: 'Invalid credentials or insufficient privileges.' };
    }
    const token = `admin_${generateId()}`;
    pushActivity('system', `Admin "${user.fullname || user.name || user.email}" logged in`, { userId: user.id });
    return { success: true, user, token };
  },

  // ──────────────────────── DASHBOARD ──────────────────────

  /** 2. Aggregate stats for the dashboard */
  getStats() {
    const users         = getLocalStorageItem(KEYS.USERS, []);
    const wallets       = getLocalStorageItem(KEYS.WALLETS, {});
    const tasks         = getLocalStorageItem(KEYS.TASKS, []);
    const submissions   = getLocalStorageItem(KEYS.SUBMISSIONS, []);
    const transactions  = getLocalStorageItem(KEYS.TRANSACTIONS, []);
    const withdrawals   = getLocalStorageItem(KEYS.WITHDRAWALS, []);

    const totalUsers       = users.length;
    const totalAdvertisers = users.filter((u) => u.role === 'advertiser').length;
    const totalEarners     = users.filter((u) => u.role === 'earner' || u.role === 'user').length;

    const activeCampaigns    = tasks.filter((t) => t.status === 'active').length;
    const completedCampaigns = tasks.filter((t) => t.status === 'completed').length;

    const pendingSubmissions = submissions.filter((s) => s.status === 'pending' || s.status === 'Pending').length;
    const pendingWithdrawals = withdrawals.filter((w) => w.status === 'pending' || w.status === 'Pending').length;

    const pendingDeposits = transactions.filter(
      (t) =>
        (t.type === 'deposit' || t.type === 'Deposit') &&
        (t.status === 'pending' || t.status === 'Pending')
    ).length;

    // Revenue = sum of completed deposits
    const totalRevenue = transactions
      .filter(
        (t) =>
          (t.type === 'deposit' || t.type === 'Deposit') &&
          (t.status === 'completed' || t.status === 'Completed')
      )
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    // Payouts = sum of paid withdrawals
    const totalPayouts = withdrawals
      .filter((w) => w.status === 'paid' || w.status === 'Paid' || w.status === 'completed' || w.status === 'Completed')
      .reduce((sum, w) => sum + (Number(w.amount) || 0), 0);

    return {
      success: true,
      totalUsers,
      totalAdvertisers,
      totalEarners,
      activeCampaigns,
      completedCampaigns,
      pendingSubmissions,
      pendingWithdrawals,
      pendingDeposits,
      totalRevenue,
      totalPayouts,
    };
  },

  // ──────────────────────── USERS ──────────────────────────

  /** 3. All users with wallet data merged */
  getAllUsers() {
    const users   = getLocalStorageItem(KEYS.USERS, []);
    const wallets = getLocalStorageItem(KEYS.WALLETS, {});
    const merged  = users.map((u) => ({
      ...u,
      wallet: wallets[u.id || u._id] || wallets[u._id] || { balance: 0, earnings: 0, spent: 0 },
    }));
    return { success: true, users: merged };
  },

  /** 4. Full user detail: profile + wallet + transactions + submissions + referrals */
  getUserDetail(userId) {
    const users        = getLocalStorageItem(KEYS.USERS, []);
    const wallets      = getLocalStorageItem(KEYS.WALLETS, {});
    const transactions = getLocalStorageItem(KEYS.TRANSACTIONS, []);
    const submissions  = getLocalStorageItem(KEYS.SUBMISSIONS, []);
    const referrals    = getLocalStorageItem(KEYS.REFERRALS, []);
    const streaks      = getLocalStorageItem(KEYS.STREAKS, {});

    const user = users.find((u) => u.id === userId || u._id === userId);
    if (!user) return { success: false, message: 'User not found.' };

    return {
      success: true,
      user: {
        ...user,
        wallet:       wallets[userId] || { balance: 0, earnings: 0, spent: 0 },
        streak:       streaks[userId] || null,
        transactions: transactions.filter((t) => t.userId === userId),
        submissions:  submissions.filter((s) => s.userId === userId),
        referrals:    referrals.filter((r) => r.referrerId === userId || r.referredId === userId),
      },
    };
  },

  /** 5. Update a user's wallet balance directly */
  updateUserBalance(userId, newBalance) {
    const wallets = getLocalStorageItem(KEYS.WALLETS, {});
    if (!wallets[userId]) {
      wallets[userId] = { balance: 0, earnings: 0, spent: 0 };
    }
    const oldBalance = wallets[userId].balance;
    wallets[userId].balance = Number(newBalance);
    saveLocalStorageItem(KEYS.WALLETS, wallets);

    pushActivity('user', `Balance updated for user ${userId}: ₦${oldBalance} → ₦${newBalance}`, {
      userId,
      oldBalance,
      newBalance: Number(newBalance),
    });

    return { success: true, wallet: wallets[userId] };
  },

  /** 6a. Suspend a user */
  suspendUser(userId) {
    const users = getLocalStorageItem(KEYS.USERS, []);
    const idx   = users.findIndex((u) => u.id === userId);
    if (idx === -1) return { success: false, message: 'User not found.' };

    users[idx].status = 'suspended';
    users[idx].suspendedAt = new Date().toISOString();
    saveLocalStorageItem(KEYS.USERS, users);

    pushActivity('user', `User "${users[idx].fullname || users[idx].name || users[idx].email}" suspended`, { userId });
    return { success: true, user: users[idx] };
  },

  /** 6b. Activate (un-suspend) a user */
  activateUser(userId) {
    const users = getLocalStorageItem(KEYS.USERS, []);
    const idx   = users.findIndex((u) => u.id === userId);
    if (idx === -1) return { success: false, message: 'User not found.' };

    users[idx].status = 'active';
    delete users[idx].suspendedAt;
    saveLocalStorageItem(KEYS.USERS, users);

    pushActivity('user', `User "${users[idx].fullname || users[idx].name || users[idx].email}" activated`, { userId });
    return { success: true, user: users[idx] };
  },

  /** 7. Delete a user and their data from ALL stores */
  deleteUser(userId) {
    // Users
    let users = getLocalStorageItem(KEYS.USERS, []);
    const target = users.find((u) => u.id === userId);
    if (!target) return { success: false, message: 'User not found.' };
    users = users.filter((u) => u.id !== userId);
    saveLocalStorageItem(KEYS.USERS, users);

    // Wallet
    const wallets = getLocalStorageItem(KEYS.WALLETS, {});
    delete wallets[userId];
    saveLocalStorageItem(KEYS.WALLETS, wallets);

    // Streaks
    const streaks = getLocalStorageItem(KEYS.STREAKS, {});
    delete streaks[userId];
    saveLocalStorageItem(KEYS.STREAKS, streaks);

    // Transactions
    let txns = getLocalStorageItem(KEYS.TRANSACTIONS, []);
    txns = txns.filter((t) => t.userId !== userId);
    saveLocalStorageItem(KEYS.TRANSACTIONS, txns);

    // Submissions
    let subs = getLocalStorageItem(KEYS.SUBMISSIONS, []);
    subs = subs.filter((s) => s.userId !== userId);
    saveLocalStorageItem(KEYS.SUBMISSIONS, subs);

    // Notifications
    let notifs = getLocalStorageItem(KEYS.NOTIFICATIONS, []);
    notifs = notifs.filter((n) => n.userId !== userId);
    saveLocalStorageItem(KEYS.NOTIFICATIONS, notifs);

    // Withdrawals
    let wds = getLocalStorageItem(KEYS.WITHDRAWALS, []);
    wds = wds.filter((w) => w.userId !== userId);
    saveLocalStorageItem(KEYS.WITHDRAWALS, wds);

    // Referrals
    let refs = getLocalStorageItem(KEYS.REFERRALS, []);
    refs = refs.filter((r) => r.referrerId !== userId && r.referredId !== userId);
    saveLocalStorageItem(KEYS.REFERRALS, refs);

    pushActivity('user', `User "${target.fullname || target.name || target.email}" deleted permanently`, {
      userId,
      email: target.email,
    });

    return { success: true };
  },

  // ──────────────────────── CAMPAIGNS ──────────────────────

  /** 8. All campaigns with advertiser info merged */
  getAllCampaigns() {
    const tasks = getLocalStorageItem(KEYS.TASKS, []);
    const users = getLocalStorageItem(KEYS.USERS, []);

    const campaigns = tasks.map((t) => {
      const advertiser = users.find((u) => u.id === t.advertiserId || u._id === t.advertiserId || u.id === t.userId || u._id === t.userId) || null;
      return {
        ...t,
        advertiser: advertiser
          ? { id: advertiser.id || advertiser._id, name: advertiser.fullname || advertiser.name, email: advertiser.email }
          : null,
      };
    });

    return { success: true, campaigns };
  },

  /** 9. Approve a campaign → status 'active' */
  approveCampaign(campaignId) {
    const tasks = getLocalStorageItem(KEYS.TASKS, []);
    const idx   = tasks.findIndex((t) => t.id === campaignId);
    if (idx === -1) return { success: false, message: 'Campaign not found.' };

    tasks[idx].status     = 'active';
    tasks[idx].approvedAt = new Date().toISOString();
    saveLocalStorageItem(KEYS.TASKS, tasks);

    pushActivity('campaign', `Campaign "${tasks[idx].title || campaignId}" approved`, {
      campaignId,
    });
    return { success: true, campaign: tasks[idx] };
  },

  /** 10. Reject a campaign */
  rejectCampaign(campaignId) {
    const tasks = getLocalStorageItem(KEYS.TASKS, []);
    const idx   = tasks.findIndex((t) => t.id === campaignId);
    if (idx === -1) return { success: false, message: 'Campaign not found.' };

    tasks[idx].status     = 'rejected';
    tasks[idx].rejectedAt = new Date().toISOString();
    saveLocalStorageItem(KEYS.TASKS, tasks);

    pushActivity('campaign', `Campaign "${tasks[idx].title || campaignId}" rejected`, {
      campaignId,
    });
    return { success: true, campaign: tasks[idx] };
  },

  /** 11a. Pause an active campaign */
  pauseCampaign(campaignId) {
    const tasks = getLocalStorageItem(KEYS.TASKS, []);
    const idx   = tasks.findIndex((t) => t.id === campaignId);
    if (idx === -1) return { success: false, message: 'Campaign not found.' };

    tasks[idx].status   = 'paused';
    tasks[idx].pausedAt = new Date().toISOString();
    saveLocalStorageItem(KEYS.TASKS, tasks);

    pushActivity('campaign', `Campaign "${tasks[idx].title || campaignId}" paused`, { campaignId });
    return { success: true, campaign: tasks[idx] };
  },

  /** 11b. Resume a paused campaign */
  resumeCampaign(campaignId) {
    const tasks = getLocalStorageItem(KEYS.TASKS, []);
    const idx   = tasks.findIndex((t) => t.id === campaignId);
    if (idx === -1) return { success: false, message: 'Campaign not found.' };

    tasks[idx].status    = 'active';
    tasks[idx].resumedAt = new Date().toISOString();
    saveLocalStorageItem(KEYS.TASKS, tasks);

    pushActivity('campaign', `Campaign "${tasks[idx].title || campaignId}" resumed`, { campaignId });
    return { success: true, campaign: tasks[idx] };
  },

  /** 12. Delete a campaign */
  deleteCampaign(campaignId) {
    let tasks = getLocalStorageItem(KEYS.TASKS, []);
    const target = tasks.find((t) => t.id === campaignId);
    if (!target) return { success: false, message: 'Campaign not found.' };

    tasks = tasks.filter((t) => t.id !== campaignId);
    saveLocalStorageItem(KEYS.TASKS, tasks);

    pushActivity('campaign', `Campaign "${target.title || campaignId}" deleted`, { campaignId });
    return { success: true };
  },

  // ──────────────────────── SUBMISSIONS ────────────────────

  /** 13. All submissions with user & task info merged */
  getAllSubmissions() {
    const submissions = getLocalStorageItem(KEYS.SUBMISSIONS, []);
    const users       = getLocalStorageItem(KEYS.USERS, []);
    const tasks       = getLocalStorageItem(KEYS.TASKS, []);

    const enriched = submissions.map((s) => {
      const user = users.find((u) => u.id === s.userId || u._id === s.userId) || null;
      const task = tasks.find((t) => t.id === s.taskId || t._id === s.taskId || t.id === s.campaignId || t._id === s.campaignId) || null;
      return {
        ...s,
        user: user ? { id: user.id || user._id, name: user.fullname || user.name, email: user.email } : null,
        task: task ? { id: task.id || task._id, title: task.title, reward: task.rewardAmount || task.reward } : null,
      };
    });

    return { success: true, submissions: enriched };
  },

  /** 14. Approve a submission — credit earner wallet with ₦2 reward, bump task count */
  approveSubmission(submissionId) {
    const submissions = getLocalStorageItem(KEYS.SUBMISSIONS, []);
    const idx         = submissions.findIndex((s) => s.id === submissionId);
    if (idx === -1) return { success: false, message: 'Submission not found.' };

    const sub = submissions[idx];
    sub.status     = 'approved';
    sub.approvedAt = new Date().toISOString();
    saveLocalStorageItem(KEYS.SUBMISSIONS, submissions);

    // Determine reward (default ₦2)
    const tasks   = getLocalStorageItem(KEYS.TASKS, []);
    const taskIdx = tasks.findIndex((t) => t.id === sub.taskId || t.id === sub.campaignId);
    let reward = 2;
    if (taskIdx !== -1) {
      reward = Number(tasks[taskIdx].reward) || 2;
      tasks[taskIdx].currentCount = (tasks[taskIdx].currentCount || 0) + 1;
      // Auto-complete campaign when target reached
      if (tasks[taskIdx].targetCount && tasks[taskIdx].currentCount >= tasks[taskIdx].targetCount) {
        tasks[taskIdx].status = 'completed';
      }
      saveLocalStorageItem(KEYS.TASKS, tasks);
    }

    // Credit earner wallet
    const wallets = getLocalStorageItem(KEYS.WALLETS, {});
    if (!wallets[sub.userId]) {
      wallets[sub.userId] = { balance: 0, earnings: 0, spent: 0 };
    }
    wallets[sub.userId].balance  = (wallets[sub.userId].balance || 0) + reward;
    wallets[sub.userId].earnings = (wallets[sub.userId].earnings || 0) + reward;
    saveLocalStorageItem(KEYS.WALLETS, wallets);

    // Record earning transaction
    const transactions = getLocalStorageItem(KEYS.TRANSACTIONS, []);
    transactions.unshift({
      id:          generateId(),
      userId:      sub.userId,
      type:        'earning',
      amount:      reward,
      status:      'completed',
      description: `Earned ₦${reward} for submission ${submissionId}`,
      createdAt:   new Date().toISOString(),
    });
    saveLocalStorageItem(KEYS.TRANSACTIONS, transactions);

    pushActivity('submission', `Submission ${submissionId} approved — ₦${reward} credited`, {
      submissionId,
      userId: sub.userId,
      reward,
    });

    return { success: true, submission: sub, reward };
  },

  /** 15. Reject a submission */
  rejectSubmission(submissionId) {
    const submissions = getLocalStorageItem(KEYS.SUBMISSIONS, []);
    const idx         = submissions.findIndex((s) => s.id === submissionId);
    if (idx === -1) return { success: false, message: 'Submission not found.' };

    submissions[idx].status     = 'rejected';
    submissions[idx].rejectedAt = new Date().toISOString();
    saveLocalStorageItem(KEYS.SUBMISSIONS, submissions);

    pushActivity('submission', `Submission ${submissionId} rejected`, {
      submissionId,
      userId: submissions[idx].userId,
    });

    return { success: true, submission: submissions[idx] };
  },

  // ──────────────────────── DEPOSITS ───────────────────────

  /** 16. Pending deposits (transactions where type=deposit & status=Pending) */
  getPendingDeposits() {
    const transactions = getLocalStorageItem(KEYS.TRANSACTIONS, []);
    const users        = getLocalStorageItem(KEYS.USERS, []);

    const pending = transactions
      .filter(
        (t) =>
          (t.type === 'deposit' || t.type === 'Deposit') &&
          (t.status === 'pending' || t.status === 'Pending')
      )
      .map((t) => {
        const user = users.find((u) => u.id === t.userId || u._id === t.userId) || null;
        return {
          ...t,
          user: user ? { id: user.id || user._id, name: user.fullname || user.name, email: user.email } : null,
        };
      });

    return { success: true, deposits: pending };
  },

  /** 17. Approve a deposit — mark completed, credit advertiser wallet */
  approveDeposit(transactionId) {
    const transactions = getLocalStorageItem(KEYS.TRANSACTIONS, []);
    const idx          = transactions.findIndex((t) => t.id === transactionId);
    if (idx === -1) return { success: false, message: 'Transaction not found.' };

    const txn = transactions[idx];
    txn.status     = 'completed';
    txn.approvedAt = new Date().toISOString();
    saveLocalStorageItem(KEYS.TRANSACTIONS, transactions);

    // Credit advertiser wallet
    const wallets = getLocalStorageItem(KEYS.WALLETS, {});
    if (!wallets[txn.userId]) {
      wallets[txn.userId] = { balance: 0, earnings: 0, spent: 0 };
    }
    wallets[txn.userId].balance = (wallets[txn.userId].balance || 0) + (Number(txn.amount) || 0);
    saveLocalStorageItem(KEYS.WALLETS, wallets);

    pushActivity('deposit', `Deposit ₦${txn.amount} approved for user ${txn.userId}`, {
      transactionId,
      userId: txn.userId,
      amount: txn.amount,
    });

    return { success: true, transaction: txn };
  },

  /** 18. Reject a deposit */
  rejectDeposit(transactionId) {
    const transactions = getLocalStorageItem(KEYS.TRANSACTIONS, []);
    const idx          = transactions.findIndex((t) => t.id === transactionId);
    if (idx === -1) return { success: false, message: 'Transaction not found.' };

    transactions[idx].status     = 'rejected';
    transactions[idx].rejectedAt = new Date().toISOString();
    saveLocalStorageItem(KEYS.TRANSACTIONS, transactions);

    pushActivity('deposit', `Deposit ₦${transactions[idx].amount} rejected for user ${transactions[idx].userId}`, {
      transactionId,
      userId: transactions[idx].userId,
    });

    return { success: true, transaction: transactions[idx] };
  },

  // ──────────────────────── WITHDRAWALS ────────────────────

  /** 19. All withdrawals with user info merged */
  getAllWithdrawals() {
    const withdrawals = getLocalStorageItem(KEYS.WITHDRAWALS, []);
    const users       = getLocalStorageItem(KEYS.USERS, []);

    const enriched = withdrawals.map((w) => {
      const user = users.find((u) => u.id === w.userId || u._id === w.userId) || null;
      return {
        ...w,
        user: user ? { id: user.id || user._id, name: user.fullname || user.name, email: user.email } : null,
      };
    });

    return { success: true, withdrawals: enriched };
  },

  /** 20. Approve a withdrawal — mark 'paid', debit wallet */
  approveWithdrawal(withdrawalId) {
    const withdrawals = getLocalStorageItem(KEYS.WITHDRAWALS, []);
    const idx         = withdrawals.findIndex((w) => w.id === withdrawalId);
    if (idx === -1) return { success: false, message: 'Withdrawal not found.' };

    const wd = withdrawals[idx];
    wd.status   = 'paid';
    wd.paidAt   = new Date().toISOString();
    saveLocalStorageItem(KEYS.WITHDRAWALS, withdrawals);

    // Debit user wallet
    const wallets = getLocalStorageItem(KEYS.WALLETS, {});
    if (wallets[wd.userId]) {
      wallets[wd.userId].balance = (wallets[wd.userId].balance || 0) - (Number(wd.amount) || 0);
      saveLocalStorageItem(KEYS.WALLETS, wallets);
    }

    pushActivity('withdrawal', `Withdrawal ₦${wd.amount} paid to user ${wd.userId}`, {
      withdrawalId,
      userId: wd.userId,
      amount: wd.amount,
    });

    return { success: true, withdrawal: wd };
  },

  /** 21. Reject a withdrawal with a reason */
  rejectWithdrawal(withdrawalId, reason = '') {
    const withdrawals = getLocalStorageItem(KEYS.WITHDRAWALS, []);
    const idx         = withdrawals.findIndex((w) => w.id === withdrawalId);
    if (idx === -1) return { success: false, message: 'Withdrawal not found.' };

    withdrawals[idx].status     = 'rejected';
    withdrawals[idx].reason     = reason;
    withdrawals[idx].rejectedAt = new Date().toISOString();
    saveLocalStorageItem(KEYS.WITHDRAWALS, withdrawals);

    pushActivity('withdrawal', `Withdrawal ${withdrawalId} rejected — "${reason}"`, {
      withdrawalId,
      userId: withdrawals[idx].userId,
      reason,
    });

    return { success: true, withdrawal: withdrawals[idx] };
  },

  // ──────────────────────── ACTIVITY LOG ───────────────────

  /** 22. Activity log with optional filters: { type, userId, startDate, endDate } */
  getActivityLog(filters = {}) {
    let log = getLocalStorageItem(KEYS.ACTIVITY_LOG, []);

    if (filters.type) {
      log = log.filter((e) => e.type === filters.type);
    }
    if (filters.userId) {
      log = log.filter((e) => e.metadata && e.metadata.userId === filters.userId);
    }
    if (filters.startDate) {
      const start = new Date(filters.startDate).getTime();
      log = log.filter((e) => new Date(e.timestamp).getTime() >= start);
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate).getTime();
      log = log.filter((e) => new Date(e.timestamp).getTime() <= end);
    }

    return { success: true, log };
  },

  // ──────────────────────── TRANSACTIONS ───────────────────

  /** 23. All transactions with user info merged */
  getAllTransactions() {
    const transactions = getLocalStorageItem(KEYS.TRANSACTIONS, []);
    const users        = getLocalStorageItem(KEYS.USERS, []);

    const enriched = transactions.map((t) => {
      const user = users.find((u) => u.id === t.userId || u._id === t.userId) || null;
      return {
        ...t,
        user: user ? { id: user.id || user._id, name: user.fullname || user.name, email: user.email } : null,
      };
    });

    return { success: true, transactions: enriched };
  },

  // ──────────────────────── NOTIFICATIONS ──────────────────

  /** 24. Send a notification to a single user */
  sendNotification(userId, title, message) {
    const notifs = getLocalStorageItem(KEYS.NOTIFICATIONS, []);
    const entry  = {
      id:        generateId(),
      userId,
      title,
      message,
      read:      false,
      createdAt: new Date().toISOString(),
    };
    notifs.unshift(entry);
    saveLocalStorageItem(KEYS.NOTIFICATIONS, notifs);

    pushActivity('notification', `Notification sent to user ${userId}: "${title}"`, {
      userId,
      notificationId: entry.id,
    });

    return { success: true, notification: entry };
  },

  /** 25. Broadcast a notification to every user */
  broadcastNotification(title, message) {
    const users  = getLocalStorageItem(KEYS.USERS, []);
    const notifs = getLocalStorageItem(KEYS.NOTIFICATIONS, []);
    const now    = new Date().toISOString();
    const sent   = [];

    users.forEach((u) => {
      const entry = {
        id:        generateId(),
        userId:    u.id,
        title,
        message,
        read:      false,
        createdAt: now,
      };
      notifs.unshift(entry);
      sent.push(entry);
    });

    saveLocalStorageItem(KEYS.NOTIFICATIONS, notifs);

    pushActivity('notification', `Broadcast sent to ${users.length} users: "${title}"`, {
      recipientCount: users.length,
    });

    return { success: true, count: sent.length, notifications: sent };
  },

  /** 26. Get all notifications for admin_user */
  getNotifications() {
    const notifs = getLocalStorageItem(KEYS.NOTIFICATIONS, []);
    const adminNotifs = notifs.filter(n => n.userId === 'admin_user');
    const unreadCount = adminNotifs.filter(n => !n.isRead && !n.read).length;
    return { success: true, notifications: adminNotifs, unreadCount };
  },

  /** 27. Mark admin notification as read */
  markNotificationRead(id) {
    const notifs = getLocalStorageItem(KEYS.NOTIFICATIONS, []);
    const idx = notifs.findIndex(n => n.id === id || n._id === id);
    if (idx !== -1) {
      notifs[idx].isRead = true;
      notifs[idx].read = true;
      saveLocalStorageItem(KEYS.NOTIFICATIONS, notifs);
    }
    return { success: true };
  },

  /** 28. Clear all admin notifications */
  clearNotifications() {
    let notifs = getLocalStorageItem(KEYS.NOTIFICATIONS, []);
    notifs = notifs.filter(n => n.userId !== 'admin_user');
    saveLocalStorageItem(KEYS.NOTIFICATIONS, notifs);
    return { success: true };
  }
};
