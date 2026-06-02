import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coins, Layers, CheckSquare, Plus, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import { api } from '../api';

const AdvertiserDashboard = ({ user, refreshUser }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    balance: 0,
    activeCampaigns: 0,
    totalSpent: 0,
    pendingSubmissions: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      await refreshUser();
      
      const campaignsRes = await api.getAdvertiserCampaigns();
      const subsRes = await api.getAdvertiserSubmissions();
      
      // Calculate spent from transactions
      const localToken = localStorage.getItem('canyuwork_token');
      const allTxs = JSON.parse(localStorage.getItem('cw_offline_transactions') || '[]');
      const advertiserTxs = allTxs.filter(t => t.userId === localToken);
      
      const spent = advertiserTxs
        .filter(t => t.type === 'withdrawal' && t.description.startsWith('Campaign'))
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const activeCount = campaignsRes.campaigns?.filter(c => c.status === 'active').length || 0;
      const pendingCount = subsRes.submissions?.filter(s => s.status === 'pending').length || 0;

      setStats({
        balance: user.balance || 0,
        activeCampaigns: activeCount,
        totalSpent: spent,
        pendingSubmissions: pendingCount
      });
      setTransactions(advertiserTxs.slice(-5).reverse());
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchDashboardData();
    }, 0);
  }, [user.balance]);

  return (
    <div className="dashboard-container">
      {/* Welcome Banner */}
      <div className="dashboard-welcome-banner">
        <div className="welcome-banner-content">
          <h1>Welcome, Campaign Manager!</h1>
          <p>Launch social media microtasks and collect high-quality proofs from real users instantly.</p>
        </div>
        <div className="welcome-banner-actions">
          <button className="btn btn-primary" onClick={() => navigate('/advertiser/create-campaign')}>
            <Plus size={18} /> New Campaign
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="metric-card" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <div className="metric-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-light)', marginBottom: '0.75rem' }}>
            <span>Campaign Budget</span>
            <Coins size={20} style={{ color: 'var(--primary)' }} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>₦{stats.balance.toLocaleString()}</h2>
          <button 
            onClick={() => navigate('/advertiser/fund-wallet')} 
            style={{ marginTop: '0.5rem', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 0, fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            Fund Wallet →
          </button>
        </div>

        <div className="metric-card" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <div className="metric-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-light)', marginBottom: '0.75rem' }}>
            <span>Active Campaigns</span>
            <Layers size={20} style={{ color: '#10b981' }} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.activeCampaigns}</h2>
          <button 
            onClick={() => navigate('/advertiser/manage-campaigns')} 
            style={{ marginTop: '0.5rem', background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', padding: 0, fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            Manage Active →
          </button>
        </div>

        <div className="metric-card" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <div className="metric-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-light)', marginBottom: '0.75rem' }}>
            <span>Pending Verifications</span>
            <CheckSquare size={20} style={{ color: '#eab308' }} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.pendingSubmissions}</h2>
          <button 
            onClick={() => navigate('/advertiser/verify-submissions')} 
            style={{ marginTop: '0.5rem', background: 'none', border: 'none', color: '#eab308', cursor: 'pointer', padding: 0, fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            Verify Proofs →
          </button>
        </div>

        <div className="metric-card" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <div className="metric-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-light)', marginBottom: '0.75rem' }}>
            <span>Total Spent</span>
            <Coins size={20} style={{ color: '#ec4899' }} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>₦{stats.totalSpent.toLocaleString()}</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>In-flight allocation</span>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="dashboard-grid">
        {/* Left Side: Campaign shortcuts */}
        <div className="dashboard-main-panel">
          <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Quick Launch Campaign</h3>
          </div>
          
          <div className="quick-launch-grid">
            <div 
              className="quick-launch-box" 
              onClick={() => navigate('/advertiser/create-campaign?platform=Instagram')}
              style={{ cursor: 'pointer', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-app)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s ease' }}
            >
              <span style={{ fontSize: '24px' }}>📸</span>
              <span style={{ fontWeight: 'bold' }}>Instagram Campaign</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Followers, Likes & Comments</span>
            </div>
            
            <div 
              className="quick-launch-box" 
              onClick={() => navigate('/advertiser/create-campaign?platform=YouTube')}
              style={{ cursor: 'pointer', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-app)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s ease' }}
            >
              <span style={{ fontSize: '24px' }}>🎥</span>
              <span style={{ fontWeight: 'bold' }}>YouTube Campaign</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Views, Subscribes & Likes</span>
            </div>
          </div>
        </div>

        {/* Right Side: Recent activity logs */}
        <div className="dashboard-side-panel">
          <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Recent Wallet Activity</h3>
            <button className="refresh-btn" onClick={fetchDashboardData} title="Refresh Logs" style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }}>
              <RefreshCw size={16} />
            </button>
          </div>

          <div className="activity-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {transactions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No wallet transactions recorded.
              </div>
            ) : (
              transactions.map((tx) => (
                <div key={tx._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      padding: '0.5rem', 
                      borderRadius: '50%', 
                      background: tx.amount < 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      color: tx.amount < 0 ? '#ef4444' : '#10b981',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      {tx.amount < 0 ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{tx.description}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <span style={{ fontWeight: 800, color: tx.amount < 0 ? '#ef4444' : '#10b981' }}>
                    {tx.amount < 0 ? '-' : '+'}₦{Math.abs(tx.amount).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvertiserDashboard;
