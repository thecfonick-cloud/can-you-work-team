import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, HelpCircle, XCircle, Sparkles } from 'lucide-react';
import { api } from '../api';

const MyTasks = () => {
  const [groupedTasks, setGroupedTasks] = useState(null);
  const [luckyTasks, setLuckyTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [timeLeft, setTimeLeft] = useState('6d 23h 45m');

  useEffect(() => {
    fetchMyTasks();
    fetchLuckyTasks();
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
    <div className="my-tasks-view-container">
      {/* Premium Lucky Tasks Banner */}
      {luckyTasks.length > 0 && (
        <div className="lucky-task-banner-card">
          <div className="banner-glow-effect"></div>
          <div className="banner-content-wrapper">
            <div className="lucky-header-left">
              <span className="lucky-badge">
                <Sparkles size={14} /> Lucky Task Assigned
              </span>
              <h2>{luckyTasks[0].title}</h2>
              <p>{luckyTasks[0].description}</p>
            </div>
            
            <div className="lucky-details-right">
              <div className="lucky-reward-amount-box">
                <span className="reward-label">Reward</span>
                <span className="reward-val">₦{(luckyTasks[0].rewardAmount || 5000).toLocaleString()}</span>
              </div>
              <div className="lucky-timer-countdown-box">
                <Clock size={16} />
                <span>Expires in: <strong>{timeLeft}</strong></span>
              </div>
              <button className="btn btn-primary lucky-claim-btn">
                Complete Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs list */}
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

      {/* Logs Table */}
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
  );
};

export default MyTasks;
