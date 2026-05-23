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
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <SignUp onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/refund" element={<Refund />} />

          {/* Private Shell Routes */}
          <Route 
            path="/dashboard" 
            element={
              user ? (
                <AppLayout user={user} handleLogout={handleLogout} theme={theme} toggleTheme={toggleTheme}>
                  <Dashboard user={user} refreshUser={refreshUser} />
                </AppLayout>
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

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <GlobalMascot user={user} />
      </Suspense>
    </Router>
  );
}

// Global Mascot Component
const GlobalMascot = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [speechText, setSpeechText] = useState("");
  const [bubbleAnim, setBubbleAnim] = useState(false);
  const [mascotClass, setMascotClass] = useState("");
  const [currentPath, setCurrentPath] = useState(location.pathname);

  const bubbleTimeoutRef = useRef(null);
  const mascotTimeoutRef = useRef(null);
  const scrollTicking = useRef(false);
  const speechTextRef = useRef("");

  // Keep speechTextRef updated to avoid stale values in useCallback
  useEffect(() => {
    speechTextRef.current = speechText;
  }, [speechText]);

  // Clean up all timers on unmount
  useEffect(() => {
    return () => {
      if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
      if (mascotTimeoutRef.current) clearTimeout(mascotTimeoutRef.current);
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

  // Trigger flight animation on route change
  useEffect(() => {
    const dismissed = localStorage.getItem("canyuwork_mascot_dismissed") === "true";
    if (dismissed) {
      setVisible(false);
      return;
    }

    if (location.pathname !== currentPath) {
      setBubbleAnim(false);
      setMascotClass("mascot-fly-off");

      const timer1 = setTimeout(() => {
        setCurrentPath(location.pathname);
        setSpeechText(getSpeechTextForRoute(location.pathname, user));
        setMascotClass("mascot-fly-on");
        setBubbleAnim(true);
      }, 800); // matches fly-off duration

      const timer2 = setTimeout(() => {
        setMascotClass("");
      }, 1800); // clear class after on-animation completes

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
    // Play circle flight loop
    setMascotClass("mascot-fly-loop");
    
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
    }, 1600); // matches fly-loop duration
  };

  const handleCloseMascot = (e) => {
    e.stopPropagation();
    setVisible(false);
    localStorage.setItem("canyuwork_mascot_dismissed", "true");
  };

  return (
    <div 
      className={`mascot-tutor-container ${visible ? 'visible' : ''}`}
      onClick={handleMascotClick}
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
        <svg viewBox="0 0 100 120" width="80" height="96" className="mascot-svg">
          <ellipse cx="50" cy="112" rx="20" ry="4" className="svg-shadow" />
          <path d="M42 90 L50 108 L58 90 Z" className="svg-jet-flame" />
          <circle cx="50" cy="98" r="8" className="svg-jet-glow" />
          <rect x="18" y="55" width="8" height="24" rx="4" className="svg-arm arm-left" transform="rotate(-15 18 55)" />
          <rect x="74" y="55" width="8" height="24" rx="4" className="svg-arm arm-right" transform="rotate(15 82 55)" />
          <rect x="28" y="48" width="44" height="42" rx="12" className="svg-body-base" />
          <rect x="36" y="56" width="28" height="26" rx="6" className="svg-body-screen" />
          <rect x="42" y="66" width="16" height="6" rx="2" className="svg-screen-bar" />
          <rect x="44" y="38" width="12" height="12" rx="2" className="svg-neck" />
          <rect x="24" y="10" width="52" height="34" rx="16" className="svg-head-base" />
          <circle cx="24" cy="27" r="4" className="svg-ear" />
          <circle cx="76" cy="27" r="4" className="svg-ear" />
          <line x1="50" y1="10" x2="50" y2="4" strokeWidth="3" className="svg-antenna-stem" />
          <circle cx="50" cy="2" r="3" className="svg-antenna-tip" />
          <rect x="32" y="16" width="36" height="20" rx="8" className="svg-head-visor" />
          <circle cx="43" cy="26" r="3.5" className="svg-eye eye-left" />
          <circle cx="57" cy="26" r="3.5" className="svg-eye eye-right" />
          <circle cx="36" cy="30" r="2" className="svg-blush" />
          <circle cx="64" cy="30" r="2" className="svg-blush" />
        </svg>
      </div>
    </div>
  );
};

export default App;
