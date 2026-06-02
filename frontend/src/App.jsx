import { useState, useEffect, Suspense, lazy, useCallback, useRef } from 'react';
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

  useEffect(() => {
    fetchUnreadCount();
  }, [location]);

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

  const checkAuth = async () => {
    try {
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
    } catch (err) {
      console.error("Auth check failed:", err);
      localStorage.removeItem('canyuwork_token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    // Set theme attribute on html node
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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
              user && (user.role === 'advertiser' || user.role === 'admin') ? (
                <AppLayout user={user} handleLogout={handleLogout} theme={theme} toggleTheme={toggleTheme}>
                  <AdvertiserDashboard user={user} refreshUser={refreshUser} />
                </AppLayout>
              ) : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/advertiser/create-campaign" 
            element={
              user && (user.role === 'advertiser' || user.role === 'admin') ? (
                <AppLayout user={user} handleLogout={handleLogout} theme={theme} toggleTheme={toggleTheme}>
                  <CreateCampaign user={user} refreshUser={refreshUser} />
                </AppLayout>
              ) : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/advertiser/manage-campaigns" 
            element={
              user && (user.role === 'advertiser' || user.role === 'admin') ? (
                <AppLayout user={user} handleLogout={handleLogout} theme={theme} toggleTheme={toggleTheme}>
                  <ManageCampaigns user={user} refreshUser={refreshUser} />
                </AppLayout>
              ) : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/advertiser/verify-submissions" 
            element={
              user && (user.role === 'advertiser' || user.role === 'admin') ? (
                <AppLayout user={user} handleLogout={handleLogout} theme={theme} toggleTheme={toggleTheme}>
                  <VerifySubmissions user={user} refreshUser={refreshUser} />
                </AppLayout>
              ) : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/advertiser/fund-wallet" 
            element={
              user && (user.role === 'advertiser' || user.role === 'admin') ? (
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

// Global Mascot Component
const GlobalMascot = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(() => localStorage.getItem("canyuwork_mascot_dismissed") !== "true");
  const [speechText, setSpeechText] = useState("");
  const [bubbleAnim, setBubbleAnim] = useState(false);
  const [mascotClass, setMascotClass] = useState("");
  const [currentPath, setCurrentPath] = useState(location.pathname);

  // Panda expressions, 3D cursor tilt, and Leaf particle system
  const [emotion, setEmotion] = useState('normal'); // normal, happy, warning, thinking
  const [tiltStyle, setTiltStyle] = useState({});
  const [leafParticles, setLeafParticles] = useState([]);

  const bubbleTimeoutRef = useRef(null);
  const mascotTimeoutRef = useRef(null);
  const emotionTimeoutRef = useRef(null);
  const scrollTicking = useRef(false);
  const speechTextRef = useRef("");

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

  // Auto-hide speech bubble after 10 seconds (5 seconds on mobile)
  useEffect(() => {
    if (bubbleAnim) {
      if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
      const isMobile = window.innerWidth <= 576;
      bubbleTimeoutRef.current = setTimeout(() => {
        setBubbleAnim(false);
      }, isMobile ? 5000 : 10000);
    }
    return () => {
      if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
    };
  }, [bubbleAnim, speechText]);

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
    if (!visible) return;

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
  }, [visible]);

  // Leaf Particles chewing physics generator
  useEffect(() => {
    if (emotion !== 'happy') return;
    
    const interval = setInterval(() => {
      const newParticles = Array.from({ length: 2 }).map(() => ({
        id: Math.random().toString(),
        left: 45 + Math.random() * 10,
        top: 48 + Math.random() * 6,
        angle: Math.random() * 360,
        speedX: (Math.random() - 0.5) * 2,
        speedY: 1.5 + Math.random() * 2,
        opacity: 1
      }));
      setLeafParticles(prev => [...prev, ...newParticles].slice(-25));
    }, 250);

    return () => clearInterval(interval);
  }, [emotion]);

  useEffect(() => {
    if (leafParticles.length === 0) return;

    let frameId;
    const updateParticles = () => {
      setLeafParticles(prev => 
        prev
          .map(p => ({
            ...p,
            left: p.left + p.speedX * 0.15,
            top: p.top + p.speedY * 0.35,
            opacity: p.opacity - 0.025,
            angle: p.angle + 3
          }))
          .filter(p => p.opacity > 0)
      );
      frameId = requestAnimationFrame(updateParticles);
    };

    frameId = requestAnimationFrame(updateParticles);
    return () => cancelAnimationFrame(frameId);
  }, [leafParticles.length]);

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

      setMascotClass("mascot-jump");
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

  // Trigger wobbly bounce animation on route change (locks in place)
  useEffect(() => {
    const dismissed = localStorage.getItem("canyuwork_mascot_dismissed") === "true";
    if (dismissed) {
      if (visible) setVisible(false);
      return;
    }

    if (location.pathname !== currentPath) {
      setBubbleAnim(false);
      setCurrentPath(location.pathname);
      setSpeechText(getSpeechTextForRoute(location.pathname, user));
      setMascotClass("mascot-jump");

      const timer1 = setTimeout(() => {
        setBubbleAnim(true);
      }, 300);

      const timer2 = setTimeout(() => {
        setMascotClass("");
      }, 1600);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
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
    // Play jump bounce and make it happy (chews faster, blushes, leaf crumbs fall)
    setMascotClass("mascot-jump");
    setEmotion("happy");
    if (emotionTimeoutRef.current) clearTimeout(emotionTimeoutRef.current);
    emotionTimeoutRef.current = setTimeout(() => setEmotion("normal"), 5000);
    
    // Custom click responses based on page (locked in corner, no movement)
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
    }, 1600); // clear jump class after completion
  };

  const handleCloseMascot = (e) => {
    e.stopPropagation();
    setVisible(false);
    localStorage.setItem("canyuwork_mascot_dismissed", "true");
  };

  return (
    <div 
      className={`mascot-tutor-container ${visible ? 'visible' : ''}`}
      style={{
        bottom: '2rem',
        right: '2rem',
        ...tiltStyle,
        position: 'fixed',
        zIndex: 999,
        cursor: 'pointer'
      }}
      onClick={handleMascotClick}
      onMouseEnter={() => setBubbleAnim(true)}
    >
      <button 
        className="mascot-close-btn"
        onClick={handleCloseMascot}
        title="Hide guide mascot"
        aria-label="Close mascot guide"
      >
        &times;
      </button>

      <div 
        className={`mascot-speech-bubble ${bubbleAnim ? 'pop' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          setBubbleAnim(false);
        }}
      >
        {speechText}
      </div>
      
      <div className={`mascot-robot-wrapper ${mascotClass}`}>
        <div className="mascot-panda-3d" style={{ position: 'relative', width: '80px', height: '96px', transformStyle: 'preserve-3d' }}>
          
          {/* Leaf particles overlay rendering */}
          {leafParticles.map(p => (
            <svg
              key={p.id}
              viewBox="0 0 10 10"
              style={{
                position: 'absolute',
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: '6px',
                height: '8px',
                transform: `rotate(${p.angle}deg)`,
                opacity: p.opacity,
                pointerEvents: 'none',
                zIndex: 1000
              }}
            >
              <path d="M 5 0 C 8 2, 8 7, 5 10 C 2 7, 2 2, 5 0" fill="url(#panda-leaf)" />
            </svg>
          ))}

          {/* Layer 1: Back (Shadow, Ears, Gradients Definitions) */}
          <svg viewBox="0 0 100 100" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transform: 'translateZ(0px)', pointerEvents: 'none' }} className="mascot-svg">
            <defs>
              <radialGradient id="panda-white" cx="40%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="55%" stopColor="#f8fafc" />
                <stop offset="85%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </radialGradient>
              <radialGradient id="panda-black" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#5b687a" />
                <stop offset="20%" stopColor="#3d4957" />
                <stop offset="70%" stopColor="#1e2530" />
                <stop offset="100%" stopColor="#0a0f18" />
              </radialGradient>
              <linearGradient id="panda-bamboo" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6ee7b7" />
                <stop offset="40%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
              <radialGradient id="panda-leaf" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#a7f3d0" />
                <stop offset="100%" stopColor="#059669" />
              </radialGradient>
            </defs>

            <ellipse cx="50" cy="94" rx="20" ry="4" className="svg-shadow" />
            <circle cx="26" cy="22" r="10" fill="url(#panda-black)" stroke="#0a0f18" strokeWidth="1.5" className="panda-ear ear-left" />
            <circle cx="74" cy="22" r="10" fill="url(#panda-black)" stroke="#0a0f18" strokeWidth="1.5" className="panda-ear ear-right" />
          </svg>

          {/* Layer 2: Middle (Head Base, Body, Legs) */}
          <svg viewBox="0 0 100 100" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transform: 'translateZ(10px)', pointerEvents: 'none' }} className="mascot-svg">
            {/* Body */}
            <rect x="28" y="60" width="44" height="28" rx="14" fill="url(#panda-black)" stroke="#0a0f18" strokeWidth="1.5" className="panda-body" />
            <ellipse cx="50" cy="74" rx="14" ry="10" fill="url(#panda-white)" className="panda-belly" />
            
            {/* Legs */}
            <ellipse cx="34" cy="86" rx="7" ry="5" fill="url(#panda-black)" className="panda-leg leg-left" />
            <ellipse cx="66" cy="86" rx="7" ry="5" fill="url(#panda-black)" className="panda-leg leg-right" />

            {/* Head Base */}
            <circle cx="50" cy="40" r="28" fill="url(#panda-white)" stroke="#cbd5e1" strokeWidth="1.5" className="panda-head" />
          </svg>

          {/* Layer 3: Front (Face Details, Arms, Chewing Bamboo) */}
          <svg viewBox="0 0 100 100" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transform: 'translateZ(20px)', pointerEvents: 'none' }} className="mascot-svg">
            {/* Eye Patches */}
            <ellipse cx="38" cy="38" rx="9" ry="7" transform="rotate(-15 38 38)" fill="url(#panda-black)" className="panda-eye-patch patch-left" />
            <ellipse cx="62" cy="38" rx="9" ry="7" transform="rotate(15 62 38)" fill="url(#panda-black)" className="panda-eye-patch patch-right" />

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
            <ellipse cx="50" cy="46" rx="3" ry="2" fill="url(#panda-black)" />

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
            <path d="M 28 66 Q 16 70 24 78" fill="none" stroke="url(#panda-black)" strokeWidth="7" strokeLinecap="round" className="panda-arm arm-left" />

            {/* Right Arm near mouth */}
            <path d="M 72 66 Q 84 70 76 78" fill="none" stroke="url(#panda-black)" strokeWidth="7" strokeLinecap="round" className="panda-arm arm-right" />

            {/* Bamboo branch - placed in front of left arm */}
            <g className="bamboo-group">
              <path d="M 18 84 L 46 52" fill="none" stroke="url(#panda-bamboo)" strokeWidth="3.5" strokeLinecap="round" className="bamboo-stalk" />
              <line x1="25.5" y1="75.5" x2="28" y2="73" stroke="#059669" strokeWidth="1.5" />
              <line x1="32.5" y1="67.5" x2="35" y2="65" stroke="#059669" strokeWidth="1.5" />
              <path d="M 32 68 Q 28 60 20 64 Q 28 66 32 68 Z" fill="url(#panda-bamboo)" />
              <path d="M 40 59 Q 44 51 36 49 Q 38 56 40 59 Z" fill="url(#panda-bamboo)" />
            </g>

            {/* Chewing Leaf at mouth */}
            <path d="M 52 51 Q 57 47 62 50 Q 56 53 52 51 Z" fill="url(#panda-leaf)" className={`chewing-leaf ${emotion === 'happy' ? 'chew-fast' : ''}`} />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default App;
