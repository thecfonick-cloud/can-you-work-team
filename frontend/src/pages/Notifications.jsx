import React, { useState, useEffect } from 'react';
import { Bell, Mail, ToggleLeft, ToggleRight, Clock, ShieldCheck, AlertCircle, CheckCircle } from 'lucide-react';
import { api } from '../api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filterType, setFilterType] = useState('All');
  const [prefs, setPrefs] = useState(null);
  const [dndEnabled, setDndEnabled] = useState(false);
  const [dndStart, setDndStart] = useState('22:00');
  const [dndEnd, setDndEnd] = useState('07:00');
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [savingPrefs, setSavingPrefs] = useState(false);

  const filterTabs = ['All', 'Task', 'Bonus', 'Referral', 'Withdrawal', 'System'];

  useEffect(() => {
    fetchNotifications();
    fetchPreferences();
  }, [filterType]);

  const fetchNotifications = async () => {
    const res = await api.getNotifications(filterType);
    if (res.success) {
      setNotifications(res.notifications);
    }
  };

  const fetchPreferences = async () => {
    const res = await api.getPreferences();
    if (res.success) {
      setPrefs(res.notificationPreferences);
      setDndEnabled(res.doNotDisturb.enabled);
      setDndStart(res.doNotDisturb.quietHoursStart);
      setDndEnd(res.doNotDisturb.quietHoursEnd);
    }
  };

  const handleMarkAsRead = async (id) => {
    const res = await api.markNotificationsRead(id);
    if (res.success) {
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    }
  };

  const handlePreferenceToggle = (key) => {
    setPrefs(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setSavingPrefs(true);
    setMsg({ type: '', text: '' });
    
    const dndConfig = {
      enabled: dndEnabled,
      quietHoursStart: dndStart,
      quietHoursEnd: dndEnd
    };

    const res = await api.updatePreferences(prefs, dndConfig);
    setSavingPrefs(false);
    if (res.success) {
      setMsg({ type: 'success', text: 'Alert preferences saved successfully!' });
      setTimeout(() => setMsg({ type: '', text: '' }), 4000);
    } else {
      setMsg({ type: 'error', text: res.message || 'Error saving settings.' });
    }
  };

  return (
    <div className="notifications-view-layout">
      {/* Left List section */}
      <div className="notifications-list-section card">
        <div className="notifications-header-row">
          <h3>Alert Center</h3>
          <div className="list-filters-row">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                className={`filter-badge-btn ${filterType === tab ? 'active' : ''}`}
                onClick={() => setFilterType(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="notifications-logs-grid">
          {notifications.length === 0 ? (
            <div className="empty-logs-placeholder">
              <Bell size={40} className="text-muted" />
              <h4>No notifications found</h4>
              <p>You have no recent messages matching this alert category.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div 
                key={n._id} 
                className={`notification-log-row ${n.isRead ? 'read' : 'unread'}`}
                onClick={() => !n.isRead && handleMarkAsRead(n._id)}
              >
                <div className="log-icon-circle">
                  <Bell size={16} />
                </div>
                <div className="log-text-content">
                  <h4>{n.title}</h4>
                  <p>{n.message}</p>
                  <span className="log-timestamp">
                    {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {!n.isRead && <span className="unread-dot-badge"></span>}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Preference Settings section */}
      <div className="notifications-settings-section">
        <div className="card settings-preferences-card">
          <h3>Alert Preferences</h3>
          <p className="subtitle-text">Configure what actions trigger direct mobile or email alerts.</p>

          {msg.text && (
            <div className={`auth-alert alert-${msg.type}`}>
              {msg.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
              <span>{msg.text}</span>
            </div>
          )}

          {prefs && (
            <form className="preferences-form" onSubmit={handleSavePreferences}>
              <div className="toggle-inputs-list">
                <div className="preference-toggle-item" onClick={() => handlePreferenceToggle('taskAlerts')}>
                  <div className="item-label">
                    <h4>New Microtask Alerts</h4>
                    <p>Alert when premium or high-slots tasks launch.</p>
                  </div>
                  {prefs.taskAlerts ? <ToggleRight className="text-indigo" size={32} /> : <ToggleLeft className="text-muted" size={32} />}
                </div>

                <div className="preference-toggle-item" onClick={() => handlePreferenceToggle('bonusRewards')}>
                  <div className="item-label">
                    <h4>Challenge & Streak Updates</h4>
                    <p>Reminders to claim daily check-in streaks.</p>
                  </div>
                  {prefs.bonusRewards ? <ToggleRight className="text-indigo" size={32} /> : <ToggleLeft className="text-muted" size={32} />}
                </div>

                <div className="preference-toggle-item" onClick={() => handlePreferenceToggle('withdrawalAlerts')}>
                  <div className="item-label">
                    <h4>Payout Transfer Confirmations</h4>
                    <p>Notifications when admin processes your withdrawals.</p>
                  </div>
                  {prefs.withdrawalAlerts ? <ToggleRight className="text-indigo" size={32} /> : <ToggleLeft className="text-muted" size={32} />}
                </div>

                <div className="preference-toggle-item" onClick={() => handlePreferenceToggle('referrals')}>
                  <div className="item-label">
                    <h4>Referred Friends Sign-ups</h4>
                    <p>Alerts when friends join or milestones are completed.</p>
                  </div>
                  {prefs.referrals ? <ToggleRight className="text-indigo" size={32} /> : <ToggleLeft className="text-muted" size={32} />}
                </div>
              </div>

              <div className="divider-line"></div>

              {/* DND Hours settings */}
              <div className="dnd-scheduler-section">
                <div className="dnd-header-toggle" onClick={() => setDndEnabled(!dndEnabled)}>
                  <div className="item-label">
                    <h4>Do Not Disturb (DND)</h4>
                    <p>Mute all alerts during scheduled hours.</p>
                  </div>
                  {dndEnabled ? <ToggleRight className="text-indigo" size={32} /> : <ToggleLeft className="text-muted" size={32} />}
                </div>

                {dndEnabled && (
                  <div className="dnd-time-range-inputs">
                    <div className="form-group flex-col">
                      <label htmlFor="dnd-start"><Clock size={12} className="inline-icon" /> Quiet Hours Start</label>
                      <input
                        type="time"
                        id="dnd-start"
                        value={dndStart}
                        onChange={(e) => setDndStart(e.target.value)}
                        disabled={savingPrefs}
                      />
                    </div>
                    <div className="form-group flex-col">
                      <label htmlFor="dnd-end"><Clock size={12} className="inline-icon" /> Quiet Hours End</label>
                      <input
                        type="time"
                        id="dnd-end"
                        value={dndEnd}
                        onChange={(e) => setDndEnd(e.target.value)}
                        disabled={savingPrefs}
                      />
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn-primary w-full save-prefs-btn" disabled={savingPrefs}>
                {savingPrefs ? 'Saving Settings...' : 'Save Preferences'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
