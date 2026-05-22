import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  CheckSquare, 
  Calendar, 
  TrendingUp, 
  ArrowUpRight, 
  Gift, 
  Zap,
  Sparkles,
  Info,
  ChevronRight
} from 'lucide-react';
import { api } from '../api';

const Dashboard = ({ user, refreshUser }) => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [streakData, setStreakData] = useState(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkInMsg, setCheckInMsg] = useState('');

  const EXCHANGE_RATE = 1523.0;

  useEffect(() => {
    fetchDashboardData();
    fetchStreakData();
  }, []);

  const fetchDashboardData = async () => {
    const res = await api.getDashboard();
    if (res.success) {
      setData(res);
    }
  };

  const fetchStreakData = async () => {
    const res = await api.getBonuses();
    if (res.success) {
      setStreakData(res.streak);
    }
  };

  const handleCheckIn = async () => {
    setCheckingIn(true);
    setCheckInMsg('');
    const res = await api.checkIn();
    setCheckingIn(false);
    if (res.success) {
      setCheckInMsg(`Success! You earned ₦${res.rewardAmount || 10} and updated your daily streak.`);
      fetchStreakData();
      if (refreshUser) refreshUser();
      setTimeout(() => setCheckInMsg(''), 5000);
    } else {
      setCheckInMsg(res.message || 'Check-in failed');
    }
  };

  if (!data) {
    return <div className="loading-spinner-container">Loading Dashboard Overview...</div>;
  }

  const { overview, recentTasks, earningsOverviewGraph, bottomStats } = data;
  const walletBalanceUSD = (overview.walletBalance / EXCHANGE_RATE).toFixed(2);
  const earningsThisMonthUSD = (overview.earningsThisMonth / EXCHANGE_RATE).toFixed(2);
  const totalWithdrawnUSD = (bottomStats.totalWithdrawn / EXCHANGE_RATE).toFixed(2);

  return (
    <div className="dashboard-view-container">
      {/* Welcome Banner */}
      <div className="dashboard-welcome-banner">
        <div className="banner-left">
          <span className="banner-pill"><Sparkles size={14} /> VIP Account Earner</span>
          <h1>Welcome back, {overview.fullname}!</h1>
          <p>You have pending reviews for 3 tasks. Keep going to unlock the weekend bonus!</p>
        </div>
        <div className="banner-right">
          <button className="btn btn-primary" onClick={() => navigate('/tasks')}>
            Start Earning <Zap size={16} />
          </button>
        </div>
      </div>

      {/* Main Grid Metrics */}
      <div className="dashboard-metrics-grid">
        <div className="card metric-card balance-card">
          <div className="metric-icon-wrapper">
            <DollarSign size={22} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Wallet Balance</span>
            <h3>₦{overview.walletBalance.toLocaleString()}</h3>
            <span className="metric-sub">${walletBalanceUSD} USD</span>
          </div>
          <button className="metric-action-btn" onClick={() => navigate('/wallet')}>
            View Details <ChevronRight size={16} />
          </button>
        </div>

        <div className="card metric-card earnings-card">
          <div className="metric-icon-wrapper">
            <TrendingUp size={22} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Earnings This Month</span>
            <h3>₦{overview.earningsThisMonth.toLocaleString()}</h3>
            <span className="metric-sub">${earningsThisMonthUSD} USD</span>
          </div>
          <button className="metric-action-btn" onClick={() => navigate('/wallet')}>
            Ledger <ChevronRight size={16} />
          </button>
        </div>

        <div className="card metric-card tasks-card">
          <div className="metric-icon-wrapper">
            <CheckSquare size={22} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Tasks Completed</span>
            <h3>{overview.tasksCompleted}</h3>
            <span className="metric-sub">In progress: {bottomStats.tasksInProgress}</span>
          </div>
          <button className="metric-action-btn" onClick={() => navigate('/my-tasks')}>
            My Tasks <ChevronRight size={16} />
          </button>
        </div>

        <div className="card metric-card withdrawals-card">
          <div className="metric-icon-wrapper">
            <Gift size={22} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Total Referrals</span>
            <h3>{bottomStats.totalReferrals}</h3>
            <span className="metric-sub">Earned: ₦{bottomStats.referralEarnings.toLocaleString()}</span>
          </div>
          <button className="metric-action-btn" onClick={() => navigate('/referrals')}>
            Invites <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Daily Streak & Calendar */}
      <div className="dashboard-streak-calendar card">
        <div className="streak-header">
          <div>
            <h3>Daily Streak Calendar</h3>
            <p>Check in daily to earn ₦10 rewards and build your milestone multiplier.</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={handleCheckIn}
            disabled={checkingIn || (streakData && streakData.checkedInToday)}
          >
            {streakData && streakData.checkedInToday ? 'Checked In Today' : 'Check In Now'}
          </button>
        </div>

        {checkInMsg && (
          <div className="streak-alert">
            <Info size={16} />
            <span>{checkInMsg}</span>
          </div>
        )}

        <div className="calendar-streak-row">
          {streakData && streakData.streakList.map((day, idx) => (
            <div 
              key={idx} 
              className={`calendar-day-box ${day.checked ? 'active' : ''}`}
            >
              <div className="day-name">{day.day}</div>
              <div className="day-check">
                {day.checked ? '✓' : '+₦10'}
              </div>
            </div>
          ))}
        </div>

        {streakData && (
          <div className="streak-status-footer">
            <p>Current Consecutive Days: <strong>{streakData.streakCount} days</strong></p>
          </div>
        )}
      </div>

      {/* Split section: Graph & Recent Tasks */}
      <div className="dashboard-split-row">
        {/* Earnings Chart mockup */}
        <div className="card split-card graph-card">
          <div className="card-header-row">
            <h3>Earnings Trajectory</h3>
            <span className="chart-legend"><span className="legend-dot"></span> Cumulative earnings</span>
          </div>
          <div className="earnings-chart-mockup">
            <div className="chart-bar-container">
              {earningsOverviewGraph.map((g, idx) => (
                <div key={idx} className="chart-column">
                  <div className="chart-bar-fill" style={{ height: `${(g.amount / 50000) * 100}%` }}>
                    <span className="bar-tooltip">₦{g.amount}</span>
                  </div>
                  <span className="chart-label">{g.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Tasks Completed list */}
        <div className="card split-card tasks-list-card">
          <div className="card-header-row">
            <h3>Recent Active Microtasks</h3>
            <button className="view-all-link-btn" onClick={() => navigate('/tasks')}>
              See all
            </button>
          </div>
          <div className="recent-tasks-list">
            {recentTasks.map((t) => (
              <div className="recent-task-row" key={t._id}>
                <div className="recent-task-title-info">
                  <h4>{t.title}</h4>
                  <p>{t.status === 'Completed' ? 'Approved' : 'Pending Review'}</p>
                </div>
                <div className="recent-task-reward-status">
                  <span className="reward-val">+₦{t.reward}</span>
                  <span className={`status-badge ${t.status === 'Completed' ? 'approved' : 'pending'}`}>
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
