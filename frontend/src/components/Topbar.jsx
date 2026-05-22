import React from 'react';
import { Sun, Moon, Bell, User, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Topbar = ({ pageTitle, user, theme, toggleTheme, unreadNotificationsCount }) => {
  const navigate = useNavigate();
  const EXCHANGE_RATE = 1523.0; // naira to 1 USD
  const balanceUSD = user ? (user.balance / EXCHANGE_RATE).toFixed(2) : '0.00';

  return (
    <header className="app-topbar">
      <div className="topbar-left">
        <h2 className="topbar-title">{pageTitle}</h2>
      </div>

      <div className="topbar-right">
        {user && (
          <div className="topbar-balance-card">
            <Wallet className="balance-icon" size={16} />
            <div className="balance-values">
              <span className="balance-naira">₦{(user.balance || 0).toLocaleString()}</span>
              <span className="balance-usd">${balanceUSD} USD</span>
            </div>
          </div>
        )}

        <div className="topbar-actions">
          <button 
            className="topbar-action-btn theme-toggle" 
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button 
            className="topbar-action-btn notifications-btn" 
            onClick={() => navigate('/notifications')}
            title="Notifications"
          >
            <Bell size={20} />
            {unreadNotificationsCount > 0 && (
              <span className="notification-badge">{unreadNotificationsCount}</span>
            )}
          </button>

          <div className="topbar-divider"></div>

          <div className="topbar-user-profile" onClick={() => navigate('/settings')}>
            <div className="topbar-avatar">
              {user && user.fullname ? user.fullname.charAt(0) : <User size={16} />}
            </div>
            {user && (
              <div className="topbar-user-details">
                <span className="topbar-username">{user.fullname}</span>
                <span className="topbar-user-role">{user.role === 'admin' ? 'Admin' : 'Member'}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
