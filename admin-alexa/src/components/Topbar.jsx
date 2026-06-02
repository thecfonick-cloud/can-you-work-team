import { useState, useEffect, useRef } from 'react';
import { Bell, Clock, Menu, Check, UserPlus, Megaphone, DollarSign, Activity } from 'lucide-react';
import { adminApi } from '../api';

const Topbar = ({ title, onToggleSidebar }) => {
  const [now, setNow] = useState(new Date());
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  const fetchNotifications = () => {
    const res = adminApi.getNotifications();
    if (res.success) {
      setNotifications(res.notifications);
      setUnreadCount(res.unreadCount);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Setup polling every 4 seconds
    const interval = setInterval(fetchNotifications, 4000);

    // Sync on tab focus or storage change
    const handleStorageChange = (e) => {
      if (e.key === 'cw_offline_notifications') {
        fetchNotifications();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Close dropdown on click outside
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleMarkRead = (e, notifId) => {
    e.stopPropagation();
    adminApi.markNotificationRead(notifId);
    fetchNotifications();
  };

  const handleClearAll = (e) => {
    e.stopPropagation();
    adminApi.clearNotifications();
    fetchNotifications();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'user_signup':
        return <UserPlus size={14} style={{ color: 'var(--color-success)' }} />;
      case 'campaign':
        return <Megaphone size={14} style={{ color: 'var(--accent-purple)' }} />;
      case 'deposit':
        return <DollarSign size={14} style={{ color: 'var(--color-warning)' }} />;
      case 'withdrawal':
        return <DollarSign size={14} style={{ color: 'var(--color-danger)' }} />;
      default:
        return <Activity size={14} style={{ color: 'var(--accent-cyan)' }} />;
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="mobile-toggle" onClick={onToggleSidebar} title="Open Menu">
          <Menu size={20} />
        </button>
        <h1 className="topbar-title">{title}</h1>
      </div>
      <div className="topbar-right">
        <div className="topbar-clock">
          <Clock size={14} />
          <span className="text-mono">{timeStr}</span>
          <span className="text-muted">{dateStr}</span>
        </div>
        
        <div className="topbar-notifications-wrapper" ref={dropdownRef}>
          <button className="topbar-icon-btn" onClick={() => setDropdownOpen(!dropdownOpen)} title="Notifications">
            <Bell size={18} />
            {unreadCount > 0 && <span className="notification-dot"></span>}
          </button>

          {dropdownOpen && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <h4>Notifications</h4>
                {notifications.length > 0 && (
                  <button className="clear-all-btn" onClick={handleClearAll}>Clear All</button>
                )}
              </div>
              <div className="notifications-list">
                {notifications.length === 0 ? (
                  <div className="notifications-empty">No notifications</div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className={`notification-item ${(!n.isRead && !n.read) ? 'unread' : ''}`}>
                      <div className="notification-item-icon">
                        {getNotificationIcon(n.type)}
                      </div>
                      <div className="notification-item-content">
                        <div className="notification-item-title">{n.title}</div>
                        <div className="notification-item-message">{n.message}</div>
                        <span className="notification-item-time text-mono">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {(!n.isRead && !n.read) && (
                        <button className="notification-item-action" title="Mark as read" onClick={(e) => handleMarkRead(e, n.id)}>
                          <Check size={12} />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="topbar-avatar">
          <span>A</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
