import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, HelpCircle, XCircle, Sparkles, Trophy, Gift, Calendar } from 'lucide-react';
import { api } from '../api';

const MyTasks = () => {
  const [groupedTasks, setGroupedTasks] = useState(null);
  const [luckyTasks, setLuckyTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [timeLeft, setTimeLeft] = useState('4h 32m remaining');
  const [streakData, setStreakData] = useState(null);

  useEffect(() => {
    fetchMyTasks();
    fetchLuckyTasks();
    fetchStreakData();
  }, []);

  const fetchMyTasks = async () => {
    const res = await api.getMyTasks();
    if (res.success) {
      setGroupedTasks(res.grouped);
    }
  };

  const fetchLuckyTasks = async () => {
    const res = await api.getLuckyTasks();
    if (res.success) {
      setLuckyTasks(res.luckyTasks);
    }
  };

  const fetchStreakData = async () => {
    const res = await api.getBonuses();
    if (res.success) {
      setStreakData(res.streak);
    }
  };

  if (!groupedTasks) {
    return <div className="loading-spinner-container">Loading Task Logs...</div>;
  }

  const getActiveList = () => {
    switch (activeTab) {
      case 'approved':
        return groupedTasks.approved || [];
      case 'rejected':
        return groupedTasks.rejected || [];
      case 'pending':
      default:
        return groupedTasks.pending || [];
    }
  };

  const currentList = getActiveList();

  return (
    <div className="my-tasks-split-layout">
      {/* Left panel: Lucky Task and logs list */}
      <div className="my-tasks-left-panel">
        
        {/* Super Reward Lucky Task Banner */}
        {luckyTasks.length > 0 && (
          <div className="lucky-task-banner-card card">
            <div className="banner-glow-effect"></div>
            <div className="lucky-content-grid">
              <div className="lucky-badge-row">
                <span className="lucky-tag-badge">
                  <Trophy size={14} style={{ color: '#fbbf24', marginRight: '4px' }} />
                  SUPER REWARD LUCKY TASK
                </span>
                <span className="lucky-countdown">
                  <Clock size={12} style={{ marginRight: '4px' }} />
                  {timeLeft}
                </span>
              </div>
              
              <div className="lucky-body-row">
                <div className="lucky-title-block">
                  <h2>{luckyTasks[0].title}</h2>
                  <p>{luckyTasks[0].description}</p>
                </div>
                
                <div className="lucky-actions-block">
                  <div className="lucky-payout-box">
                    <span className="payout-label">Guaranteed Reward</span>
                    <span className="payout-value">₦{(luckyTasks[0].rewardAmount || 5000).toLocaleString()}</span>
                  </div>
                  <button className="btn btn-primary lucky-start-btn">
                    Complete Campaign <Sparkles size={14} style={{ marginLeft: '4px' }} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Log Tabs */}
        <div className="my-tasks-tabs-navigation">
          <button
            className={`tab-nav-btn ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            In Progress ({groupedTasks.pending?.length || 0})
          </button>
          <button
            className={`tab-nav-btn ${activeTab === 'approved' ? 'active' : ''}`}
            onClick={() => setActiveTab('approved')}
          >
            Approved ({groupedTasks.approved?.length || 0})
          </button>
          <button
            className={`tab-nav-btn ${activeTab === 'rejected' ? 'active' : ''}`}
            onClick={() => setActiveTab('rejected')}
          >
            Rejected ({groupedTasks.rejected?.length || 0})
          </button>
        </div>

        {/* Logs Table Card */}
        <div className="my-tasks-table-card card">
          {currentList.length === 0 ? (
            <div className="empty-logs-placeholder">
              <HelpCircle size={40} className="text-muted" />
              <h4>No tasks found in this category</h4>
              <p>You haven't submitted any tasks matching this status.</p>
            </div>
          ) : (
            <div className="tasks-logs-table-wrapper">
              <table className="tasks-logs-table">
                <thead>
                  <tr>
                    <th>Task Title</th>
                    <th>Submitted Date</th>
                    <th>Task Reward</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentList.map((log) => (
                    <tr key={log._id}>
                      <td className="log-title-cell">
                        <strong>{log.taskId?.title || 'Unknown Task'}</strong>
                      </td>
                      <td className="log-date-cell">
                        {new Date(log.createdAt).toLocaleDateString()}
                      </td>
                      <td className="log-reward-cell">
                        ₦{log.taskId?.rewardAmount || 0}
                      </td>
                      <td className="log-status-cell">
                        <span className={`status-pill ${log.status}`}>
                          {log.status === 'pending' && <Clock size={12} />}
                          {log.status === 'approved' && <CheckCircle2 size={12} />}
                          {log.status === 'rejected' && <XCircle size={12} />}
                          {log.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Right panel: Calendar streak checklist calendar side-panel */}
      <div className="my-tasks-right-panel">
        <div className="card streak-checklist-side-card">
          <div className="streak-card-header">
            <div className="streak-header-icon">
              <Calendar size={22} style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <h4>Earning Calendar Streaks</h4>
              <p>Build consecutive check-in days to get high-payout microtasks.</p>
            </div>
          </div>

          <div className="streak-checklist-items">
            {streakData && streakData.streakList.map((day, idx) => (
              <div 
                key={idx} 
                className={`streak-checklist-item ${day.checked ? 'completed' : ''}`}
              >
                <div className="checklist-circle-check">
                  {day.checked ? '✓' : idx + 1}
                </div>
                <div className="checklist-day-info">
                  <span className="checklist-day-name">{day.day}</span>
                  <span className="checklist-day-desc">
                    {day.checked ? 'Completed (₦10 Reward Credited)' : 'Locked (+₦10 Reward available)'}
                  </span>
                </div>
                {day.checked && (
                  <span className="checklist-bonus-pill">Active</span>
                )}
              </div>
            ))}
          </div>

          {streakData && (
            <div className="streak-side-footer-summary">
              <div className="streak-flame-meter">
                <span className="flame-emoji">🔥</span>
                <div>
                  <span className="flame-bold-count">{streakData.streakCount} Day Streak</span>
                  <span className="flame-sub">Keep checked in to maximize bonuses</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTasks;
