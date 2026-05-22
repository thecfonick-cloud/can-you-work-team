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

  const getSocialIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes('instagram') || t.includes('ig')) {
      return (
        <div className="task-social-icon instagram" style={{ background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285aeb 90%)', color: 'white' }}>
          IG
        </div>
      );
    } else if (t.includes('youtube') || t.includes('yt')) {
      return (
        <div className="task-social-icon youtube" style={{ background: '#ff0000', color: 'white' }}>
          YT
        </div>
      );
    } else if (t.includes('telegram') || t.includes('tg')) {
      return (
        <div className="task-social-icon telegram" style={{ background: '#0088cc', color: 'white' }}>
          TG
        </div>
      );
    } else if (t.includes('facebook') || t.includes('fb')) {
      return (
        <div className="task-social-icon facebook" style={{ background: '#1877f2', color: 'white' }}>
          FB
        </div>
      );
    } else if (t.includes('tiktok') || t.includes('tk')) {
      return (
        <div className="task-social-icon tiktok" style={{ background: '#000000', color: 'white' }}>
          TK
        </div>
      );
    } else {
      return (
        <div className="task-social-icon general" style={{ background: 'var(--primary)', color: 'white' }}>
          SV
        </div>
      );
    }
  };

  if (!data) {
    return <div className="loading-spinner-container">Loading Dashboard Overview...</div>;
  }

  const { overview, recentTasks, earningsOverviewGraph, bottomStats } = data;
  const walletBalanceUSD = (overview.walletBalance / EXCHANGE_RATE).toFixed(2);
  const earningsThisMonthUSD = (overview.earningsThisMonth / EXCHANGE_RATE).toFixed(2);
  const totalWithdrawnUSD = (bottomStats.totalWithdrawn / EXCHANGE_RATE).toFixed(2);

  // Generate SVG coordinate points from graph data
  const maxVal = 50000;
  const chartW = 500;
  const chartH = 150;
  const paddingX = 40;
  const paddingY = 20;

  const points = earningsOverviewGraph.map((g, idx) => {
    const x = paddingX + idx * ((chartW - paddingX * 2) / (earningsOverviewGraph.length - 1));
    const y = chartH - paddingY - (g.amount / maxVal) * (chartH - paddingY * 2);
    return { x, y, amount: g.amount, date: g.date };
  });

  const lineD = points.length > 0 
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

  const areaD = points.length > 0
    ? `${lineD} L ${points[points.length - 1].x} ${chartH - paddingY} L ${points[0].x} ${chartH - paddingY} Z`
    : '';

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

      {/* Top Performer Trophy Card */}
      <div className="card top-performer-card" style={{ 
        background: 'linear-gradient(135deg, #1e1b4b 0%, #311042 100%)', 
        color: 'white', 
        border: '1px solid #4c1d95',
        marginBottom: '2rem',
        padding: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div className="trophy-content" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: '1', minWidth: '280px' }}>
          <div className="trophy-badge" style={{ 
            display: 'inline-flex', 
            width: 'fit-content', 
            padding: '0.25rem 0.75rem', 
            backgroundColor: 'rgba(245, 158, 11, 0.15)', 
            color: '#f59e0b', 
            borderRadius: 'var(--radius-full)', 
            fontSize: '0.75rem', 
            fontWeight: '700' 
          }}>
            🏆 WEEKLY ACHIEVER CHALLENGE
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Congratulations, {overview.fullname}!</h2>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.4' }}>
            You completed 14 tasks yesterday and earned an extra streak bonus of ₦200. Check the Leaderboard to see your position!
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/leaderboard')} style={{ flexShrink: '0' }}>
          View Leaderboard
        </button>
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
        {/* Earnings Chart SVG */}
        <div className="card split-card graph-card">
          <div className="card-header-row">
            <h3>Earnings Trajectory</h3>
            <span className="chart-legend"><span className="legend-dot"></span> Cumulative earnings</span>
          </div>
          <div className="earnings-chart-mockup" style={{ padding: '1rem 0' }}>
            <svg viewBox={`0 0 ${chartW} ${chartH}`} width="100%" height="100%">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1={paddingX} y1={20} x2={chartW - paddingX} y2={20} stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
              <line x1={paddingX} y1={65} x2={chartW - paddingX} y2={65} stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
              <line x1={paddingX} y1={110} x2={chartW - paddingX} y2={110} stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
              <line x1={paddingX} y1={chartH - paddingY} x2={chartW - paddingX} y2={chartH - paddingY} stroke="rgba(255,255,255,0.1)" />

              {/* Shaded Area Under Line */}
              {areaD && <path d={areaD} fill="url(#chartGrad)" />}

              {/* Main Trend Line */}
              {lineD && <path d={lineD} fill="none" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}

              {/* Nodes & Tooltips */}
              {points.map((p, idx) => (
                <g key={idx} className="chart-node-group">
                  <circle cx={p.x} cy={p.y} r="5" fill="#7c3aed" stroke="#ffffff" strokeWidth="2" />
                  <text x={p.x} y={chartH - 2} textAnchor="middle" fontSize="10" fill="#94a3b8">
                    {p.date}
                  </text>
                  <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="10" fontWeight="700" fill="#7c3aed" opacity="0" className="chart-amount-tooltip">
                    ₦{p.amount.toLocaleString()}
                  </text>
                </g>
              ))}
            </svg>
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
                {getSocialIcon(t.title)}
                <div className="recent-task-title-info">
                  <h4>{t.title}</h4>
                  <p>{t.status === 'Completed' ? 'Approved' : 'Pending Review'}</p>
                </div>
                <div className="recent-task-reward-status">
                  <span className="reward-val">+₦{t.reward}</span>
                  <span className={`status-badge ${t.status === 'Completed' ? 'approved' : 'pending'}`}>
                    {t.status === 'Completed' ? 'Approved' : 'Pending'}
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
