import React, { useState, useEffect } from 'react';
import { Gift, Calendar, CheckCircle2, Trophy, Clock, Sparkles } from 'lucide-react';
import { api } from '../api';

const Bonus = ({ refreshUser }) => {
  const [data, setData] = useState(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchBonusData();
  }, []);

  const fetchBonusData = async () => {
    const res = await api.getBonuses();
    if (res.success) {
      setData(res);
    }
  };

  const handleCheckIn = async () => {
    setCheckingIn(true);
    setMsg('');
    const res = await api.checkIn();
    setCheckingIn(false);
    if (res.success) {
      setMsg(`Checked in! You received ₦${res.rewardAmount || 10} daily bonus!`);
      fetchBonusData();
      if (refreshUser) refreshUser();
      setTimeout(() => setMsg(''), 5000);
    } else {
      setMsg(res.message || 'Check-in failed');
    }
  };

  if (!data) {
    return <div className="loading-spinner-container">Loading Rewards & Bonuses...</div>;
  }

  const { streak, summary, bonuses } = data;

  return (
    <div className="bonus-page-view-container">
      {/* Overview summaries */}
      <div className="bonus-summary-grid">
        <div className="card summary-widget flex-row">
          <div className="icon-wrapper bg-primary">
            <Gift size={22} />
          </div>
          <div className="widget-details">
            <span className="label">Total Bonus Earned</span>
            <h3>₦{summary.totalBonusEarned.toLocaleString()}</h3>
          </div>
        </div>

        <div className="card summary-widget flex-row">
          <div className="icon-wrapper bg-warning">
            <Clock size={22} />
          </div>
          <div className="widget-details">
            <span className="label">Pending Rewards</span>
            <h3>₦{summary.pendingBonuses.toLocaleString()}</h3>
          </div>
        </div>

        <div className="card summary-widget flex-row">
          <div className="icon-wrapper bg-success">
            <CheckCircle2 size={22} />
          </div>
          <div className="widget-details">
            <span className="label">Available to Withdraw</span>
            <h3>₦{summary.availableToWithdraw.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Streak calendar card */}
      <div className="streak-calendar-card card">
        <div className="streak-card-header">
          <div>
            <h3>Daily Attendance Streak</h3>
            <p>Claim your consecutive check-in bonuses every 24 hours to build multipliers.</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={handleCheckIn}
            disabled={checkingIn || streak.checkedInToday}
          >
            {streak.checkedInToday ? 'Already Claimed Today' : 'Claim Daily ₦10'}
          </button>
        </div>

        {msg && (
          <div className="attendance-alert-info">
            <Sparkles size={16} />
            <span>{msg}</span>
          </div>
        )}

        <div className="days-row-grid">
          {streak.streakList.map((day, idx) => (
            <div 
              key={idx} 
              className={`streak-day-block ${day.checked ? 'completed' : ''}`}
            >
              <span className="day-name">{day.day}</span>
              <div className="day-circle">
                {day.checked ? <CheckCircle2 size={16} /> : '+₦10'}
              </div>
            </div>
          ))}
        </div>

        <div className="streak-multiplier-footer">
          <span className="days-badge">Current streak: {streak.streakCount} days</span>
          <p className="hint-text">Maintain a 7-day streak to unlock a bonus reward chest containing up to ₦1,000!</p>
        </div>
      </div>

      {/* Active Challenges grid */}
      <div className="challenges-list-section">
        <h3>Active System Challenges</h3>
        <div className="challenges-grid-layout">
          {bonuses.map((b) => {
            const progressPct = Math.min((b.progress / b.target) * 100, 100);
            return (
              <div key={b.id} className="challenge-item-card card">
                <div className="card-header-row">
                  <span className="challenge-type-badge">{b.type}</span>
                  <span className="challenge-reward-badge">+₦{b.reward}</span>
                </div>

                <h4 className="challenge-title">{b.title}</h4>
                <p className="challenge-desc">{b.description}</p>

                {b.timeLeft && (
                  <div className="time-remaining-label">
                    <Clock size={12} />
                    <span>Time left: {b.timeLeft}</span>
                  </div>
                )}

                <div className="challenge-progress-bar-wrapper">
                  <div className="progress-fill" style={{ width: `${progressPct}%` }}></div>
                  <div className="progress-labels-row">
                    <span>{b.progress} / {b.target}</span>
                    <span>{progressPct.toFixed(0)}%</span>
                  </div>
                </div>

                <div className="challenge-footer-action">
                  <button 
                    className={`btn btn-sm w-full ${b.status === 'Completed' ? 'btn-outline' : 'btn-primary'}`}
                    disabled={b.status === 'Completed' || b.progress < b.target}
                  >
                    {b.status === 'Completed' ? 'Claimed' : b.progress >= b.target ? 'Claim Reward' : 'In Progress'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Bonus;
