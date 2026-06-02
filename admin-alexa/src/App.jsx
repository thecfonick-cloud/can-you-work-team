import { useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ActivityFeed from './pages/ActivityFeed';
import UserManagement from './pages/UserManagement';
import CampaignCenter from './pages/CampaignCenter';
import FinancialControl from './pages/FinancialControl';
import SubmissionReview from './pages/SubmissionReview';

const pageTitles = {
  '/': 'System Dashboard',
  '/activity': 'Operations Center',
  '/users': 'User Command Center',
  '/campaigns': 'Campaign Control',
  '/finance': 'Financial Control',
  '/submissions': 'Submission Review',
};

function App() {
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('alexa_admin_session');
    return saved ? JSON.parse(saved) : null;
  });
  const location = useLocation();

  const handleLogin = (user) => {
    setAdmin(user);
    localStorage.setItem('alexa_admin_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    setAdmin(null);
    localStorage.removeItem('alexa_admin_session');
  };

  if (!admin) {
    return <Login onLoginSuccess={handleLogin} />;
  }

  const title = pageTitles[location.pathname] || 'Admin Alexa';

  return (
    <div className="app-container">
      <Sidebar onLogout={handleLogout} />
      <div className="main-content">
        <Topbar title={title} />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/activity" element={<ActivityFeed />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/campaigns" element={<CampaignCenter />} />
            <Route path="/finance" element={<FinancialControl />} />
            <Route path="/submissions" element={<SubmissionReview />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
