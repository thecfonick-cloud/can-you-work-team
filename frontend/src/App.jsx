import React, { useState, useEffect, Suspense, lazy, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { api } from './api';

// Components
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

// Pages Lazy Imports
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Login = lazy(() => import('./pages/Login'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Tasks = lazy(() => import('./pages/Tasks'));
const MyTasks = lazy(() => import('./pages/MyTasks'));
const Wallet = lazy(() => import('./pages/Wallet'));
const Withdraw = lazy(() => import('./pages/Withdraw'));
const Referrals = lazy(() => import('./pages/Referrals'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Bonus = lazy(() => import('./pages/Bonus'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Settings = lazy(() => import('./pages/Settings'));
const HelpSupport = lazy(() => import('./pages/HelpSupport'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Refund = lazy(() => import('./pages/Refund'));

const AdvertiserDashboard = lazy(() => import('./pages/AdvertiserDashboard'));
const CreateCampaign = lazy(() => import('./pages/CreateCampaign'));
const ManageCampaigns = lazy(() => import('./pages/ManageCampaigns'));
const VerifySubmissions = lazy(() => import('./pages/VerifySubmissions'));
const FundWallet = lazy(() => import('./pages/FundWallet'));
const AdminPortal = lazy(() => import('./pages/AdminPortal'));

// Wrapper to set topbar titles and load notification badge count
const AppLayout = ({ user, handleLogout, theme, toggleTheme, children }) => {
  const location = useLocation();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchUnreadCount();
  }, [location]);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.getNotifications();
      if (res.success) {
        setUnreadNotifications(res.unreadCount || 0);
      }
    } catch (err) {
      console.error("Error fetching unread notifications:", err);
    }
  };

  const getPageTitle = (path) => {
    switch (path) {
      case '/dashboard': return 'Dashboard Overview';
      case '/tasks': return 'Available Microtasks';
      case '/my-tasks': return 'My Task Logbook';
      case '/wallet': return 'My Wallet balance';
      case '/withdraw': return 'Request Payout';
      case '/referrals': return 'Referrals Hub';
      case '/leaderboard': return 'Leaderboard Standings';
      case '/bonus': return 'Attendance Streaks & Bonuses';
      case '/notifications': return 'Notifications & DND';
      case '/settings': return 'Account Settings';
      case '/help': return 'Help & Support';
      case '/advertiser/dashboard': return 'Advertiser Workspace';
      case '/advertiser/create-campaign': return 'Create Social Campaign';
      case '/advertiser/manage-campaigns': return 'Manage Campaigns';
      case '/advertiser/verify-submissions': return 'Verify Submissions';
      case '/advertiser/fund-wallet': return 'Fund Campaign Budget';
      case '/admin': return 'System Administration Portal';
      default: return 'CanYouWork Platform';
    }
  };

  return (
    <div className="app-container">
      <Sidebar user={user} handleLogout={handleLogout} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      {sidebarOpen && (
        <div className="sidebar-mobile-backdrop" onClick={() => setSidebarOpen(false)}></div>
      )}
      <div className="main-content">
        <Topbar
          pageTitle={getPageTitle(location.pathname)}
          user={user}
          theme={theme}
          toggleTheme={toggleTheme}
          unreadNotificationsCount={unreadNotifications}
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        />
        <div className="page-view-wrapper">
          {children}
        </div>
      </div>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('canyuwork_theme') || 'light');

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    // Set theme attribute on html node
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const checkAuth = async () => {
    const token = localStorage.getItem('canyuwork_token');
    if (token) {
      const res = await api.getProfile();
      if (res.success) {
        setUser(res.user);
      } else {
        // Clear corrupt token
        localStorage.removeItem('canyuwork_token');
      }
    }
    setLoading(false);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('canyuwork_theme', newTheme);
  };

  const refreshUser = async () => {
    const res = await api.getProfile();
    if (res.success) {
      setUser(res.user);
    }
  };

  if (loading) {
    return <div className="loading-spinner-container">Loading User Session...</div>;
  }

  return (
    <Router>
      <Suspense fallback={<div className="loading-spinner-container">Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={user ? (user.role === 'advertiser' ? <Navigate to="/advertiser/dashboard" /> : <Navigate to="/dashboard" />) : <LandingPage />} />
          <Route path="/login" element={user ? (user.role === 'advertiser' ? <Navigate to="/advertiser/dashboard" /> : <Navigate to="/dashboard" />) : <Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={user ? (user.role === 'advertiser' ? <Navigate to="/advertiser/dashboard" /> : <Navigate to="/dashboard" />) : <SignUp onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/refund" element={<Refund />} />

          {/* Private Shell Routes */}
          <Route 
            path="/dashboard" 
            element={
              user ? (
                user.role === 'advertiser' ? <Navigate to="/advertiser/dashboard" /> : (
                  <AppLayout user={user} handleLogout={handleLogout} theme={theme} toggleTheme={toggleTheme}>
                    <Dashboard user={user} refreshUser={refreshUser} />
                  </AppLayout>
                )
              ) : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/tasks" 
            element={
              user ? (
                <AppLayout user={user} handleLogout={handleLogout} theme={theme} toggleTheme={toggleTheme}>
                  <Tasks refreshUser={refreshUser} />
                </AppLayout>
              ) : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/my-tasks" 
            element={
              user ? (
                <AppLayout user={user} handleLogout={handleLogout} theme={theme} toggleTheme={toggleTheme}>
                  <MyTasks refreshUser={refreshUser} />
                </AppLayout>
              ) : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/wallet" 
            element={
              user ? (
                <AppLayout user={user} handleLogout={handleLogout} theme={theme} toggleTheme={toggleTheme}>
                  <Wallet />
                </AppLayout>
              ) : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/withdraw" 
            element={
              user ? (
                <AppLayout user={user} handleLogout={handleLogout} theme={theme} toggleTheme={toggleTheme}>
                  <Withdraw refreshUser={refreshUser} />
                </AppLayout>
              ) : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/referrals" 
            element={
              user ? (
                <AppLayout user={user} handleLogout={handleLogout} theme={theme} toggleTheme={toggleTheme}>
                  <Referrals />
                </AppLayout>
              ) : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/leaderboard" 
            element={
              user ? (
                <AppLayout user={user} handleLogout={handleLogout} theme={theme} toggleTheme={toggleTheme}>
                  <Leaderboard user={user} />
                </AppLayout>
              ) : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/bonus" 
            element={
              user ? (
                <AppLayout user={user} handleLogout={handleLogout} theme={theme} toggleTheme={toggleTheme}>
                  <Bonus refreshUser={refreshUser} />
                </AppLayout>
              ) : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/notifications" 
            element={
              user ? (
                <AppLayout user={user} handleLogout={handleLogout} theme={theme} toggleTheme={toggleTheme}>
                  <Notifications />
                </AppLayout>
              ) : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/settings" 
            element={
              user ? (
                <AppLayout user={user} handleLogout={handleLogout} theme={theme} toggleTheme={toggleTheme}>
                  <Settings refreshUser={refreshUser} />
                </AppLayout>
              ) : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/help" 
            element={
              user ? (
                <AppLayout user={user} handleLogout={handleLogout} theme={theme} toggleTheme={toggleTheme}>
                  <HelpSupport />
                </AppLayout>
              ) : <Navigate to="/login" />
            } 
          />

          {/* Advertiser Shell Routes */}
          <Route 
            path="/advertiser/dashboard" 
            element={
              user && user.role === 'advertiser' ? (
                <AppLayout user={user} handleLogout={handleLogout} theme={theme} toggleTheme={toggleTheme}>
                  <AdvertiserDashboard user={user} refreshUser={refreshUser} />
                </AppLayout>
              ) : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/advertiser/create-campaign" 
            element={
              user && user.role === 'advertiser' ? (
                <AppLayout user={user} handleLogout={handleLogout} theme={theme} toggleTheme={toggleTheme}>
                  <CreateCampaign user={user} refreshUser={refreshUser} />
                </AppLayout>
              ) : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/advertiser/manage-campaigns" 
            element={
              user && user.role === 'advertiser' ? (
                <AppLayout user={user} handleLogout={handleLogout} theme={theme} toggleTheme={toggleTheme}>
                  <ManageCampaigns user={user} refreshUser={refreshUser} />
                </AppLayout>
              ) : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/advertiser/verify-submissions" 
            element={
              user && user.role === 'advertiser' ? (
                <AppLayout user={user} handleLogout={handleLogout} theme={theme} toggleTheme={toggleTheme}>
                  <VerifySubmissions user={user} refreshUser={refreshUser} />
                </AppLayout>
              ) : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/advertiser/fund-wallet" 
            element={
              user && user.role === 'advertiser' ? (
                <AppLayout user={user} handleLogout={handleLogout} theme={theme} toggleTheme={toggleTheme}>
                  <FundWallet user={user} refreshUser={refreshUser} />
                </AppLayout>
              ) : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/admin" 
            element={
              user && user.role === 'admin' ? (
                <AppLayout user={user} handleLogout={handleLogout} theme={theme} toggleTheme={toggleTheme}>
                  <AdminPortal user={user} refreshUser={refreshUser} />
                </AppLayout>
              ) : <Navigate to="/" />
            } 
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <GlobalMascot user={user} />
      </Suspense>
    </Router>
  );
}

// Predefined random screen positions for the cute panda
const POSITIONS = [
  { name: 'bottom-right', style: { top: '80%', left: '85%' }, isLeft: false },
  { name: 'bottom-left', style: { top: '80%', left: '5%' }, isLeft: true },
  { name: 'top-right', style: { top: '12%', left: '85%' }, isLeft: false },
  { name: 'top-left', style: { top: '12%', left: '5%' }, isLeft: true },
  { name: 'mid-left', style: { top: '45%', left: '5%' }, isLeft: true },
  { name: 'mid-right', style: { top: '45%', left: '85%' }, isLeft: false }
];

// Global Mascot Component
const GlobalMascot = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [speechText, setSpeechText] = useState("");
  const [bubbleAnim, setBubbleAnim] = useState(false);
  const [mascotClass, setMascotClass] = useState("");
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const [currentPos, setCurrentPos] = useState(POSITIONS[0]);

  // Panda expressions, 3D cursor tilt, and Drag states
  const [emotion, setEmotion] = useState('normal'); // normal, happy, warning, thinking
  const [tiltStyle, setTiltStyle] = useState({});
  const [dragStyle, setDragStyle] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const bubbleTimeoutRef = useRef(null);
  const mascotTimeoutRef = useRef(null);
  const emotionTimeoutRef = useRef(null);
  const scrollTicking = useRef(false);
  const speechTextRef = useRef("");
  const dragStart = useRef({ x: 0, y: 0 });
  const elementStart = useRef({ x: 0, y: 0 });

  // Clear dismissed flag on load to restore the mascot!
  useEffect(() => {
    localStorage.removeItem("canyuwork_mascot_dismissed");
  }, []);

  // Keep speechTextRef updated to avoid stale values in useCallback
  useEffect(() => {
    speechTextRef.current = speechText;
  }, [speechText]);

  // Clean up all timers on unmount
  useEffect(() => {
    return () => {
      if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
      if (mascotTimeoutRef.current) clearTimeout(mascotTimeoutRef.current);
      if (emotionTimeoutRef.current) clearTimeout(emotionTimeoutRef.current);
    };
  }, []);

  // Global Emotion Receiver
  useEffect(() => {
    const handleSetEmotion = (e) => {
      const { newEmotion, duration } = e.detail;
      setEmotion(newEmotion);
      if (emotionTimeoutRef.current) clearTimeout(emotionTimeoutRef.current);
      if (newEmotion !== 'normal') {
        emotionTimeoutRef.current = setTimeout(() => {
          setEmotion('normal');
        }, duration || 5000);
      }
    };
    window.addEventListener('mascot-set-emotion', handleSetEmotion);
    return () => window.removeEventListener('mascot-set-emotion', handleSetEmotion);
  }, []);

  // Mouse tilt tracking
  useEffect(() => {
    if (isDragging || !visible) return;

    const handleMouseMove = (e) => {
      const mascotEl = document.querySelector('.mascot-tutor-container');
      if (!mascotEl) return;
      const rect = mascotEl.getBoundingClientRect();
      const mascotX = rect.left + rect.width / 2;
      const mascotY = rect.top + rect.height / 2;
      const dx = e.clientX - mascotX;
      const dy = e.clientY - mascotY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 350) {
        const rotateX = -dy / 15;
        const rotateY = dx / 15;
        setTiltStyle({
          transform: `perspective(600px) rotateX(${Math.max(-20, Math.min(20, rotateX))}deg) rotateY(${Math.max(-20, Math.min(20, rotateY))}deg)`
        });
      } else {
        setTiltStyle({});
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isDragging, visible]);

  // Periodic Random Position Movement
  useEffect(() => {
    if (!visible || isDragging) return;
    const interval = setInterval(() => {
      const otherPositions = POSITIONS.filter(p => p.name !== currentPos.name);
      const nextPos = otherPositions[Math.floor(Math.random() * otherPositions.length)];
      
      setMascotClass("mascot-walk");
      setCurrentPos(nextPos);
      setBubbleAnim(false);
      
      if (mascotTimeoutRef.current) clearTimeout(mascotTimeoutRef.current);
      mascotTimeoutRef.current = setTimeout(() => {
        setMascotClass("");
        setBubbleAnim(true);
      }, 1200);
    }, 20000);

    return () => clearInterval(interval);
  }, [visible, currentPos, isDragging]);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    if (e.target.closest('.mascot-close-btn')) return;
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    elementStart.current = { x: rect.left, y: rect.top };
    dragStart.current = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  };

  // Drag physics logic
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setDragStyle({
        position: 'fixed',
        left: `${elementStart.current.x + dx}px`,
        top: `${elementStart.current.y + dy}px`,
        bottom: 'auto',
        right: 'auto'
      });
    };

    const handleMouseUp = (e) => {
      setIsDragging(false);

      const x = elementStart.current.x + (e.clientX - dragStart.current.x);
      const y = elementStart.current.y + (e.clientY - dragStart.current.y);
      const containerWidth = 80;
      const containerHeight = 96;
      const vw = window.innerWidth || 1000;
      const vh = window.innerHeight || 800;

      const distLeft = x;
      const distRight = vw - (x + containerWidth);
      const distTop = y;
      const distBottom = vh - (y + containerHeight);

      const minDist = Math.min(distLeft, distRight, distTop, distBottom);
      let nextPos = currentPos;

      const pctY = Math.max(10, Math.min(85, (y / vh) * 100));
      const pctX = Math.max(5, Math.min(85, (x / vw) * 100));

      if (minDist === distLeft) {
        nextPos = { name: 'dragged-left', style: { left: '5%', top: `${pctY}%` }, isLeft: true };
      } else if (minDist === distRight) {
        nextPos = { name: 'dragged-right', style: { left: '85%', top: `${pctY}%` }, isLeft: false };
      } else if (minDist === distTop) {
        nextPos = { name: 'dragged-top', style: { top: '12%', left: `${pctX}%` }, isLeft: x < vw / 2 };
      } else {
        nextPos = { name: 'dragged-bottom', style: { top: '80%', left: `${pctX}%` }, isLeft: x < vw / 2 };
      }

      setCurrentPos(nextPos);
      setDragStyle(null);
      setMascotClass("mascot-jump");
      setTimeout(() => setMascotClass(""), 1600);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, currentPos]);

  // Advertiser Mascot Event Triggers
  useEffect(() => {
    const handleFundSuccess = (e) => {
      const { amount } = e.detail;
      setSpeechText(`💰 Ka-ching! ₦${Number(amount).toLocaleString()} added to your budget. Let's launch some campaigns!`);
      setBubbleAnim(false);
      if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
      bubbleTimeoutRef.current = setTimeout(() => setBubbleAnim(true), 50);

      setMascotClass("mascot-jump");
      setEmotion("happy");
      if (emotionTimeoutRef.current) clearTimeout(emotionTimeoutRef.current);
      emotionTimeoutRef.current = setTimeout(() => setEmotion("normal"), 5000);

      if (mascotTimeoutRef.current) clearTimeout(mascotTimeoutRef.current);
      mascotTimeoutRef.current = setTimeout(() => {
        setMascotClass("");
      }, 1600);
    };

    const handleCampaignLive = (e) => {
      const { title } = e.detail;
      setSpeechText(`🚀 Zoom! Your campaign "${title}" is live for earners to complete!`);
      setBubbleAnim(false);
      if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
      bubbleTimeoutRef.current = setTimeout(() => setBubbleAnim(true), 50);

      setMascotClass("mascot-walk");
      setEmotion("happy");
      if (emotionTimeoutRef.current) clearTimeout(emotionTimeoutRef.current);
      emotionTimeoutRef.current = setTimeout(() => setEmotion("normal"), 5000);

      if (mascotTimeoutRef.current) clearTimeout(mascotTimeoutRef.current);
      mascotTimeoutRef.current = setTimeout(() => {
        setMascotClass("");
      }, 1600);
    };

    window.addEventListener('mascot-fund-success', handleFundSuccess);
    window.addEventListener('mascot-campaign-live', handleCampaignLive);

    return () => {
      window.removeEventListener('mascot-fund-success', handleFundSuccess);
      window.removeEventListener('mascot-campaign-live', handleCampaignLive);
    };
  }, []);

  // Context-aware speech texts
  const getSpeechTextForRoute = (path, userProfile) => {
    const name = userProfile?.fullname ? userProfile.fullname.split(' ')[0] : 'Earner';
    switch (path) {
      case '/':
        return `👋 Hey! Join now and get a ₦200 instant sign-up bonus!`;
      case '/login':
        return `🔐 Welcome back! Enter your details to log into your dashboard.`;
      case '/register':
        return `🎁 Create your free account in 30 seconds and grab your ₦200 bonus!`;
      case '/dashboard':
        return `🚀 Hi ${name}! Check in today for +₦10. Complete microtasks below!`;
      case '/tasks':
        return `📋 Choose a microtask, follow instructions, and upload proof for review!`;
      case '/my-tasks':
        return `🏆 View your logbook. Complete your Super Reward Lucky Task for ₦5,000!`;
      case '/wallet':
        return `💳 Sync your bank account. Current conversion rate: ₦1,523 = $1.00 USD!`;
      case '/withdraw':
        return `💸 Choose Payoneer, Bank, or PayPal. Payouts are verified in 24 hours!`;
      case '/referrals':
        return `🤝 Invite friends! Get 10% commission on all their earnings forever!`;
      case '/leaderboard':
        return `🏆 Top earners get cash bonuses at the end of the month!`;
      case '/bonus':
        return `🔥 Keep your daily check-in streak alive to get high-paying tasks!`;
      case '/notifications':
        return `🔔 Check your reward notifications and customize your quiet hours.`;
      case '/settings':
        return `⚙️ Update your profile details and link your social handles.`;
      case '/advertiser/dashboard':
        return `💼 Welcome to your Advertiser Workspace! Here you can check your budget, active tasks, and pending verifications!`;
      case '/advertiser/create-campaign':
        return `➕ Create a task campaign! Select a platform, add rules, set a reward, and Canny will fly it to all earners!`;
      case '/advertiser/manage-campaigns':
        return `📁 Track your active campaigns. You can pause campaigns or check how many earners completed them.`;
      case '/advertiser/verify-submissions':
        return `🤝 Verify submissions! Review the proof submitted by earners and click 'Approve' to credit their wallets.`;
      case '/advertiser/fund-wallet':
        return `💳 Fund your campaign budget! You can mock-deposit Naira using Bank Transfer, Card, or Crypto.`;
      case '/admin':
        return `🛡️ System Admin Portal! Here you can check receipts, verify deposits, approve payouts, and override user or campaign settings.`;
      default:
        return `👋 Hello! Let's complete some microtasks and earn pocket money!`;
    }
  };

  useEffect(() => {
    const dismissed = localStorage.getItem("canyuwork_mascot_dismissed") === "true";
    if (dismissed) return;

    // Show mascot after 1 second initially
    const timer = setTimeout(() => {
      setVisible(true);
      setSpeechText(getSpeechTextForRoute(location.pathname, user));
      setBubbleAnim(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [location.pathname, user]);

  // Trigger wobbly climb animation on route change
  useEffect(() => {
    const dismissed = localStorage.getItem("canyuwork_mascot_dismissed") === "true";
    if (dismissed) {
      setVisible(false);
      return;
    }

    if (location.pathname !== currentPath) {
      setBubbleAnim(false);
      setMascotClass("mascot-climb-off");

      const timer1 = setTimeout(() => {
        setCurrentPath(location.pathname);
        setSpeechText(getSpeechTextForRoute(location.pathname, user));
        setMascotClass("mascot-climb-on");
        setBubbleAnim(true);
      }, 900); // matches climb-off duration

      const timer2 = setTimeout(() => {
        setMascotClass("");
      }, 2000); // clear class after on-animation completes

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      // If user profile updates (e.g. balance updates)
      setSpeechText(getSpeechTextForRoute(location.pathname, user));
    }
  }, [location.pathname, user, currentPath]);

  const handleScroll = useCallback(() => {
    if (location.pathname !== '/') return;
    if (!scrollTicking.current) {
      window.requestAnimationFrame(() => {
        const scrollPos = window.scrollY;
        let currentText = "👋 Hey! Join now and get a ₦200 instant sign-up bonus!";
        
        const featuresEl = document.getElementById('features');
        const howEl = document.getElementById('how-it-works');
        const safetyEl = document.querySelector('.safety-banner-section');
        const testimonialsEl = document.getElementById('testimonials');

        if (testimonialsEl && scrollPos >= testimonialsEl.offsetTop - 400) {
          currentText = "⭐️ Hear from our 12,000+ happy earners worldwide!";
        } else if (safetyEl && scrollPos >= safetyEl.offsetTop - 400) {
          currentText = "🛡️ Warning: No VPNs or proxy networks allowed, please!";
        } else if (howEl && scrollPos >= howEl.offsetTop - 400) {
          currentText = "🎯 Just register, follow task rules, upload proof, and get paid!";
        } else if (featuresEl && scrollPos >= featuresEl.offsetTop - 400) {
          currentText = "💡 Earn up to ₦10,000 with premium Lucky Tasks!";
        }

        if (speechTextRef.current !== currentText) {
          setBubbleAnim(false);
          setSpeechText(currentText);
          if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
          bubbleTimeoutRef.current = setTimeout(() => setBubbleAnim(true), 50);
        }
        scrollTicking.current = false;
      });
      scrollTicking.current = true;
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === '/') {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [location.pathname, handleScroll]);

  const handleMascotClick = () => {
    // Play jump bounce and make it happy (chews faster, blushes)
    setMascotClass("mascot-jump");
    setEmotion("happy");
    if (emotionTimeoutRef.current) clearTimeout(emotionTimeoutRef.current);
    emotionTimeoutRef.current = setTimeout(() => setEmotion("normal"), 4000);
    
    // Choose a random new position and walk waddle to it
    const otherPositions = POSITIONS.filter(p => p.name !== currentPos.name);
    const nextPos = otherPositions[Math.floor(Math.random() * otherPositions.length)];
    
    // Walk waddle state triggers after the initial jump (e.g. 500ms)
    setTimeout(() => {
      setMascotClass("mascot-walk");
      setCurrentPos(nextPos);
    }, 500);
    
    // Custom click responses based on page
    let clickText = "🚀 Let's earn! Tap a button to proceed.";
    if (location.pathname === '/') {
      clickText = "🚀 Let's earn! Tap 'Start Earning Now' to sign up and claim your ₦200 bonus!";
      const ctaBtn = document.querySelector('.hero-cta-buttons');
      if (ctaBtn) ctaBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (location.pathname === '/register') {
      clickText = "📝 Just fill out the fields and tap 'Sign Up' to get started!";
    } else if (location.pathname === '/login') {
      clickText = "🔑 Enter your email/username and password to access your earnings!";
    } else if (location.pathname === '/dashboard') {
      clickText = "🌟 Tap 'Check In' inside 'Bonus & Streaks' to get your free daily Naira!";
      navigate('/bonus');
    } else if (location.pathname === '/my-tasks') {
      clickText = "🎁 Tap 'Complete Campaign' on the Lucky Task banner to start your ₦5,000 survey!";
    }

    setSpeechText(clickText);
    setBubbleAnim(false);
    if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
    bubbleTimeoutRef.current = setTimeout(() => setBubbleAnim(true), 50);

    if (mascotTimeoutRef.current) clearTimeout(mascotTimeoutRef.current);
    mascotTimeoutRef.current = setTimeout(() => {
      setMascotClass("");
    }, 1800); // clear class after walk completes
  };

  const handleCloseMascot = (e) => {
    e.stopPropagation();
    setVisible(false);
    localStorage.setItem("canyuwork_mascot_dismissed", "true");
  };

  return (
    <div 
      className={`mascot-tutor-container ${visible ? 'visible' : ''} ${currentPos.isLeft ? 'pos-left' : ''} ${isDragging ? 'mascot-dragged' : ''}`}
      style={{
        ...(dragStyle || currentPos.style),
        ...tiltStyle,
        position: 'fixed',
        zIndex: 999,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onClick={handleMascotClick}
      onMouseDown={handleMouseDown}
    >
      <button 
        className="mascot-close-btn"
        onClick={handleCloseMascot}
        title="Hide guide mascot"
        aria-label="Close mascot guide"
      >
        &times;
      </button>

      <div className={`mascot-speech-bubble ${bubbleAnim ? 'pop' : ''}`}>
        {speechText}
      </div>
      
      <div className={`mascot-robot-wrapper ${mascotClass}`}>
        <div className="mascot-panda-3d" style={{ position: 'relative', width: '80px', height: '96px', transformStyle: 'preserve-3d' }}>
          {/* Layer 1: Back (Shadow, Ears) */}
          <svg viewBox="0 0 100 100" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transform: 'translateZ(0px)', pointerEvents: 'none' }} className="mascot-svg">
            <ellipse cx="50" cy="94" rx="20" ry="4" className="svg-shadow" />
            <circle cx="26" cy="22" r="10" fill="#2d3748" stroke="#1a202c" strokeWidth="1.5" className="panda-ear ear-left" />
            <circle cx="74" cy="22" r="10" fill="#2d3748" stroke="#1a202c" strokeWidth="1.5" className="panda-ear ear-right" />
          </svg>

          {/* Layer 2: Middle (Head Base, Body, Legs) */}
          <svg viewBox="0 0 100 100" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transform: 'translateZ(10px)', pointerEvents: 'none' }} className="mascot-svg">
            {/* Body */}
            <rect x="28" y="60" width="44" height="28" rx="14" fill="#2d3748" stroke="#1a202c" strokeWidth="1.5" className="panda-body" />
            <ellipse cx="50" cy="74" rx="14" ry="10" fill="#ffffff" className="panda-belly" />
            
            {/* Legs */}
            <ellipse cx="34" cy="86" rx="7" ry="5" fill="#1a202c" className="panda-leg leg-left" />
            <ellipse cx="66" cy="86" rx="7" ry="5" fill="#1a202c" className="panda-leg leg-right" />

            {/* Head Base */}
            <circle cx="50" cy="40" r="28" fill="#ffffff" stroke="#2c3e50" strokeWidth="1.5" className="panda-head" />
          </svg>

          {/* Layer 3: Front (Face Details, Arms, Chewing Bamboo) */}
          <svg viewBox="0 0 100 100" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transform: 'translateZ(20px)', pointerEvents: 'none' }} className="mascot-svg">
            {/* Eye Patches */}
            <ellipse cx="38" cy="38" rx="9" ry="7" transform="rotate(-15 38 38)" fill="#2d3748" className="panda-eye-patch patch-left" />
            <ellipse cx="62" cy="38" rx="9" ry="7" transform="rotate(15 62 38)" fill="#2d3748" className="panda-eye-patch patch-right" />

            {/* Face Eyes Details */}
            {emotion === 'happy' ? (
              <>
                <path d="M 34 39 Q 38 34 42 39" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 58 39 Q 62 34 66 39" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
              </>
            ) : emotion === 'warning' ? (
              <>
                <line x1="33" y1="38" x2="43" y2="38" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="57" y1="38" x2="67" y2="38" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
              </>
            ) : emotion === 'thinking' ? (
              <>
                <circle cx="39" cy="36" r="3" fill="#ffffff" />
                <circle cx="63" cy="36" r="3" fill="#ffffff" />
              </>
            ) : (
              <>
                <circle cx="38" cy="38" r="3.5" fill="#ffffff" className="panda-eye eye-left" />
                <circle cx="62" cy="38" r="3.5" fill="#ffffff" className="panda-eye eye-right" />
                <circle cx="39.5" cy="36.5" r="1.2" fill="#ffffff" />
                <circle cx="63.5" cy="36.5" r="1.2" fill="#ffffff" />
              </>
            )}

            {/* Nose */}
            <ellipse cx="50" cy="46" rx="3" ry="2" fill="#1a202c" />

            {/* Mouth */}
            {emotion === 'warning' ? (
              <circle cx="50" cy="52" r="3" fill="#2d3748" />
            ) : emotion === 'thinking' ? (
              <line x1="46" y1="51" x2="54" y2="51" stroke="#2d3748" strokeWidth="1.5" strokeLinecap="round" />
            ) : (
              <path d="M 46 51 Q 48 53 50 51 Q 52 53 54 51" fill="none" stroke="#2d3748" strokeWidth="1.5" strokeLinecap="round" />
            )}

            {/* Cheeks (Blush) */}
            <circle cx="28" cy="45" r="3.5" fill="#ff8a9a" opacity={emotion === 'happy' ? 0.85 : 0.3} className="panda-blush" />
            <circle cx="72" cy="45" r="3.5" fill="#ff8a9a" opacity={emotion === 'happy' ? 0.85 : 0.3} className="panda-blush" />

            {/* Left Arm holding bamboo */}
            <path d="M 28 66 Q 16 70 24 78" fill="none" stroke="#2d3748" strokeWidth="7" strokeLinecap="round" className="panda-arm arm-left" />

            {/* Right Arm near mouth */}
            <path d="M 72 66 Q 84 70 76 78" fill="none" stroke="#2d3748" strokeWidth="7" strokeLinecap="round" className="panda-arm arm-right" />

            {/* Bamboo branch - placed in front of left arm */}
            <g className="bamboo-group">
              <path d="M 18 84 L 46 52" fill="none" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" className="bamboo-stalk" />
              <line x1="25.5" y1="75.5" x2="28" y2="73" stroke="#059669" strokeWidth="1.5" />
              <line x1="32.5" y1="67.5" x2="35" y2="65" stroke="#059669" strokeWidth="1.5" />
              <path d="M 32 68 Q 28 60 20 64 Q 28 66 32 68 Z" fill="#10b981" />
              <path d="M 40 59 Q 44 51 36 49 Q 38 56 40 59 Z" fill="#10b981" />
            </g>

            {/* Chewing Leaf at mouth */}
            <path d="M 52 51 Q 57 47 62 50 Q 56 53 52 51 Z" fill="#10b981" className={`chewing-leaf ${emotion === 'happy' ? 'chew-fast' : ''}`} />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default App;
