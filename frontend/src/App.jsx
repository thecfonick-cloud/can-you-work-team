import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
    const res = await api.getNotifications();
    if (res.success) {
      setUnreadNotifications(res.unreadCount || 0);
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
                  <MyTasks />
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
                  <Leaderboard />
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
      </Suspense>
    </Router>
  );
}

export default App;
