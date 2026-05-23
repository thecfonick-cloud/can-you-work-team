import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, HelpCircle, XCircle, Sparkles, Trophy, Gift, Calendar } from 'lucide-react';
import { api } from '../api';

const MyTasks = ({ refreshUser }) => {
  const [groupedTasks, setGroupedTasks] = useState(null);
  const [luckyTasks, setLuckyTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [timeLeft, setTimeLeft] = useState('4h 32m remaining');
  const [streakData, setStreakData] = useState(null);

  // Survey Modal States
  const [showSurvey, setShowSurvey] = useState(false);
  const [surveyStep, setSurveyStep] = useState(1);
  const [surveyAnswers, setSurveyAnswers] = useState({ q1: '', q2: '', q3: '' });
  const [surveySubmitting, setSurveySubmitting] = useState(false);
  const [surveySuccess, setSurveySuccess] = useState(false);

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
                  <button 
                    className="btn btn-primary lucky-start-btn"
                    onClick={() => {
                      setSurveyStep(1);
                      setSurveyAnswers({ q1: '', q2: '', q3: '' });
                      setSurveySuccess(false);
                      setShowSurvey(true);
                    }}
                  >
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

      {/* Opinion Survey Modal Overlay */}
      {showSurvey && (
        <div className="survey-modal-overlay">
          <div className="survey-modal-card card">
            <button className="survey-modal-close" onClick={() => setShowSurvey(false)}>&times;</button>
            
            {!surveySuccess ? (
              <>
                <div className="survey-header">
                  <div className="survey-icon-glow">
                    <Trophy size={24} className="icon-gold" />
                  </div>
                  <h3>Premium Opinion Survey</h3>
                  <p className="survey-subtitle">Step {surveyStep} of 3</p>
                  
                  <div className="survey-progress-bar-bg">
                    <div className="survey-progress-bar-fill" style={{ width: `${(surveyStep / 3) * 100}%` }}></div>
                  </div>
                </div>

                <div className="survey-body">
                  {surveyStep === 1 && (
                    <div className="survey-question-step">
                      <h4>1. What is your main goal on CanYouWork?</h4>
                      <div className="survey-options-grid">
                        {[
                          "Earn extra pocket money",
                          "Find full-time online micro-jobs",
                          "Discover new platforms & websites",
                          "Learn digital marketing skills"
                        ].map((option) => (
                          <button
                            key={option}
                            className={`survey-option-btn ${surveyAnswers.q1 === option ? 'selected' : ''}`}
                            onClick={() => setSurveyAnswers(prev => ({ ...prev, q1: option }))}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {surveyStep === 2 && (
                    <div className="survey-question-step">
                      <h4>2. How often do you complete online microtasks?</h4>
                      <div className="survey-options-grid">
                        {[
                          "Daily, several times a day",
                          "A few times a week",
                          "Rarely, once or twice a month",
                          "Just getting started today"
                        ].map((option) => (
                          <button
                            key={option}
                            className={`survey-option-btn ${surveyAnswers.q2 === option ? 'selected' : ''}`}
                            onClick={() => setSurveyAnswers(prev => ({ ...prev, q2: option }))}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {surveyStep === 3 && (
                    <div className="survey-question-step">
                      <h4>3. Which platform's tasks do you prefer most?</h4>
                      <div className="survey-options-grid">
                        {[
                          "Instagram / TikTok social tasks",
                          "YouTube watch & subscribe tasks",
                          "Premium feedback & survey tasks",
                          "Telegram channel joins"
                        ].map((option) => (
                          <button
                            key={option}
                            className={`survey-option-btn ${surveyAnswers.q3 === option ? 'selected' : ''}`}
                            onClick={() => setSurveyAnswers(prev => ({ ...prev, q3: option }))}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="survey-footer">
                  {surveyStep > 1 && (
                    <button 
                      className="btn btn-outline" 
                      onClick={() => setSurveyStep(prev => prev - 1)}
                      disabled={surveySubmitting}
                    >
                      Back
                    </button>
                  )}
                  
                  {surveyStep < 3 ? (
                    <button
                      className="btn btn-primary"
                      disabled={
                        (surveyStep === 1 && !surveyAnswers.q1) ||
                        (surveyStep === 2 && !surveyAnswers.q2)
                      }
                      onClick={() => setSurveyStep(prev => prev + 1)}
                      style={{ marginLeft: 'auto' }}
                    >
                      Next Step
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary btn-submit-survey"
                      disabled={!surveyAnswers.q3 || surveySubmitting}
                      onClick={async () => {
                        setSurveySubmitting(true);
                        try {
                          const res = await api.completeLuckyTask(luckyTasks[0]._id);
                          if (res.success) {
                            setSurveySuccess(true);
                            if (refreshUser) await refreshUser();
                            await fetchLuckyTasks();
                            await fetchMyTasks();
                          } else {
                            alert(res.message || 'Failed to complete survey');
                          }
                        } catch (err) {
                          console.error(err);
                          alert('Error submitting survey');
                        } finally {
                          setSurveySubmitting(false);
                        }
                      }}
                      style={{ marginLeft: 'auto' }}
                    >
                      {surveySubmitting ? 'Submitting...' : 'Submit Survey'}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="survey-success-container">
                <div className="success-icon-badge">
                  <Sparkles size={36} className="icon-success" />
                </div>
                <h3>Campaign Completed!</h3>
                <p>Your premium opinion survey feedback was recorded successfully.</p>
                
                <div className="reward-alert-box">
                  <span className="reward-label">Reward Sent to Wallet</span>
                  <span className="reward-val">+₦5,000.00</span>
                </div>

                <button 
                  className="btn btn-primary close-success-btn" 
                  onClick={() => setShowSurvey(false)}
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTasks;
