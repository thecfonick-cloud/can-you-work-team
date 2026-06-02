import { useState, useEffect } from 'react';
import { Users, Megaphone, DollarSign, ClipboardCheck, TrendingUp, AlertTriangle, ArrowUpRight, Activity } from 'lucide-react';
import { adminApi } from '../api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const s = adminApi.getStats();
    if (s.success) setStats(s);
    const log = adminApi.getActivityLog({});
    if (log.success) setRecentActivity(log.log.slice(0, 8));
  }, []);

  if (!stats) return <div className="loading-spinner"></div>;

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'cyan', sub: `${stats.totalEarners} earners · ${stats.totalAdvertisers} advertisers` },
    { label: 'Active Campaigns', value: stats.activeCampaigns, icon: Megaphone, color: 'purple', sub: `${stats.completedCampaigns} completed` },
    { label: 'Pending Submissions', value: stats.pendingSubmissions, icon: ClipboardCheck, color: 'warning', sub: 'Awaiting review', action: () => navigate('/submissions') },
    { label: 'Pending Withdrawals', value: stats.pendingWithdrawals, icon: DollarSign, color: 'danger', sub: 'Needs payout', action: () => navigate('/finance') },
    { label: 'Total Revenue', value: `₦${(stats.totalRevenue || 0).toLocaleString()}`, icon: TrendingUp, color: 'success', sub: 'Platform total' },
    { label: 'Pending Deposits', value: stats.pendingDeposits, icon: AlertTriangle, color: 'warning', sub: 'Awaiting approval', action: () => navigate('/finance') },
  ];

  const getActivityIcon = (type) => {
    const colors = { user_signup: '#10b981', campaign: '#8b5cf6', submission: '#00d4ff', deposit: '#f59e0b', withdrawal: '#ef4444', balance: '#00d4ff' };
    return colors[type] || '#64748b';
  };

  return (
    <div className="animate-fade-in">
      <div className="stats-grid">
        {cards.map((card, i) => (
          <div key={i} className={`stat-card stat-card-${card.color}`} onClick={card.action} style={card.action ? {cursor:'pointer'} : {}}>
            <div className="stat-card-header">
              <span className="stat-label">{card.label}</span>
              <div className={`stat-icon stat-icon-${card.color}`}>
                <card.icon size={20} />
              </div>
            </div>
            <div className="stat-value">{card.value}</div>
            <div className="stat-sub">
              {card.action && <ArrowUpRight size={12} />}
              {card.sub}
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="glass-card">
          <div className="card-header">
            <h3><Activity size={18} className="text-cyan" /> Recent Operations</h3>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/activity')}>View All</button>
          </div>
          <div className="activity-feed">
            {recentActivity.length === 0 && <p className="text-muted" style={{padding:'1rem'}}>No activity recorded yet. Actions from the main app will appear here.</p>}
            {recentActivity.map((item, i) => (
              <div key={i} className="activity-item animate-slide-up" style={{animationDelay: `${i * 0.05}s`}}>
                <div className="activity-dot pulse" style={{backgroundColor: getActivityIcon(item.type)}}></div>
                <div className="activity-content">
                  <span className="activity-desc">{item.description}</span>
                  <span className="activity-time text-mono">{new Date(item.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <div className="card-header">
            <h3><AlertTriangle size={18} className="text-warning" /> Quick Actions</h3>
          </div>
          <div className="quick-actions">
            <button className="btn btn-primary" onClick={() => navigate('/users')}>
              <Users size={16} /> Manage Users
            </button>
            <button className="btn btn-purple" onClick={() => navigate('/campaigns')}>
              <Megaphone size={16} /> Campaigns
            </button>
            <button className="btn btn-success" onClick={() => navigate('/finance')}>
              <DollarSign size={16} /> Finances
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/submissions')}>
              <ClipboardCheck size={16} /> Submissions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
