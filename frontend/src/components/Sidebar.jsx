import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  ListTodo,
  Wallet as WalletIcon,
  Download,
  Users,
  Trophy,
  Gift,
  Bell,
  Settings as SettingsIcon,
  HelpCircle,
  LogOut,
  ShieldCheck,
  Globe,
  X
} from 'lucide-react';

const Sidebar = ({ user, handleLogout, isOpen, setIsOpen }) => {
  const earnerItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'My Tasks', path: '/my-tasks', icon: ListTodo },
    { name: 'Wallet', path: '/wallet', icon: WalletIcon },
    { name: 'Withdraw', path: '/withdraw', icon: Download },
    { name: 'Referrals', path: '/referrals', icon: Users },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Bonus & Streaks', path: '/bonus', icon: Gift },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
    { name: 'Help & Support', path: '/help', icon: HelpCircle }
  ];

  const advertiserItems = [
    { name: 'Dashboard', path: '/advertiser/dashboard', icon: LayoutDashboard },
    { name: 'Create Campaign', path: '/advertiser/create-campaign', icon: Gift },
    { name: 'My Campaigns', path: '/advertiser/manage-campaigns', icon: ListTodo },
    { name: 'Verify Proofs', path: '/advertiser/verify-submissions', icon: ShieldCheck },
    { name: 'Fund Wallet', path: '/advertiser/fund-wallet', icon: WalletIcon },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
    { name: 'Help & Support', path: '/help', icon: HelpCircle }
  ];

  let sections;
  if (user?.role === 'admin') {
    sections = [
      {
        title: 'System Admin',
        items: [
          { name: 'Admin Portal', path: '/admin', icon: ShieldCheck }
        ]
      },
      {
        title: 'Advertiser Features',
        items: advertiserItems.filter(item => !['Notifications', 'Settings', 'Help & Support'].includes(item.name))
      },
      {
        title: 'Earner Features',
        items: earnerItems.filter(item => !['Notifications', 'Settings', 'Help & Support'].includes(item.name))
      },
      {
        title: 'General',
        items: [
          { name: 'Notifications', path: '/notifications', icon: Bell },
          { name: 'Settings', path: '/settings', icon: SettingsIcon },
          { name: 'Help & Support', path: '/help', icon: HelpCircle }
        ]
      }
    ];
  } else if (user?.role === 'advertiser') {
    sections = [
      {
        title: '',
        items: advertiserItems
      }
    ];
  } else {
    sections = [
      {
        title: '',
        items: earnerItems
      }
    ];
  }

  return (
    <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">W</div>
          <span className="logo-text">CanYouWork</span>
        </div>
        <button className="sidebar-close-btn" onClick={() => setIsOpen(false)} title="Close Menu">
          <X size={20} />
        </button>
      </div>

      {user && (
        <div className="sidebar-profile-card">
          <div className="profile-card-avatar">
            {user.fullname ? user.fullname.charAt(0) : 'U'}
          </div>
          <div className="profile-card-info">
            <h4 className="profile-card-name">
              {user.fullname} 
              {user.isVerified && <ShieldCheck className="verified-badge" size={14} />}
            </h4>
            <p className="profile-card-username">@{user.username}</p>
          </div>
          <div className="profile-card-stats">
            <div className="sidebar-stat-item">
              <span className="sidebar-stat-label">{user?.role === 'advertiser' ? 'Ad Budget' : 'Wallet'}</span>
              <span className="sidebar-stat-val">₦{(user?.balance || 0).toLocaleString()}</span>
            </div>
            <div className="sidebar-stat-divider"></div>
            <div className="sidebar-stat-item">
              <span className="sidebar-stat-label">Country</span>
              <span className="sidebar-stat-val flex-center gap-1">
                <Globe size={11} /> {user.country || 'NG'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Logout button moved to the top */}
      <div className="sidebar-top-action" style={{ padding: '0 20px', marginBottom: '15px' }}>
        <button 
          className="sidebar-logout-btn" 
          onClick={() => { setIsOpen(false); handleLogout(); }}
          style={{ width: '100%', justifyContent: 'center', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>

      <nav className="sidebar-nav">
        {sections.map((section, sIdx) => (
          <div key={section.title || sIdx} className="sidebar-section">
            {user?.role === 'admin' && section.title && (
              <h5 className="sidebar-section-title">{section.title}</h5>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `sidebar-nav-link ${isActive ? 'active' : ''}`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <Icon size={18} className="nav-icon" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

    </aside>
  );
};

export default Sidebar;
