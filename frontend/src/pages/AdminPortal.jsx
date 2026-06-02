import { useState, useEffect } from 'react';
import { 
  Users, 
  Coins, 
  ListTodo, 
  Download, 
  Check, 
  X, 
  ShieldAlert, 
  Search, 
  Play, 
  Pause, 
  Trash2, 
  Image as ImageIcon, 
  RefreshCw, 
  Edit 
} from 'lucide-react';
import { api } from '../api';

const AdminPortal = ({ refreshUser }) => {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Data states
  const [pendingCampaigns, setPendingCampaigns] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [users, setUsers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    activeTasks: 0,
    pendingSubmissions: 0,
    pendingCampaigns: 0,
    pendingWithdrawals: 0
  });

  // UI state
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [newBalance, setNewBalance] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      if (activeTab === 'pending-campaigns') {
        const res = await api.getAllCampaigns();
        if (res.success) setPendingCampaigns((res.campaigns || []).filter(c => c.status === 'pending_payment'));
      } else if (activeTab === 'withdrawals') {
        const res = await api.getAllWithdrawals();
        if (res.success) setWithdrawals(res.withdrawals || []);
      } else if (activeTab === 'users') {
        const res = await api.getAllUsers();
        if (res.success) setUsers(res.users || []);
      } else if (activeTab === 'campaigns') {
        const res = await api.getAllCampaigns();
        if (res.success) setCampaigns(res.campaigns || []);
      } else if (activeTab === 'submissions') {
        const res = await api.getAllSubmissions();
        if (res.success) setSubmissions(res.submissions || []);
      } else if (activeTab === 'overview') {
        // Load summary analytics
        const resUsers = await api.getAllUsers();
        const resCamp = await api.getAllCampaigns();
        const resWith = await api.getAllWithdrawals();
        const resSubs = await api.getAllSubmissions();

        setAnalytics({
          totalUsers: resUsers.success ? resUsers.users.length : 0,
          activeTasks: resCamp.success ? resCamp.campaigns.filter(c => c.status === 'active').length : 0,
          pendingSubmissions: resSubs.success ? resSubs.submissions.filter(s => s.status === 'pending').length : 0,
          pendingCampaigns: resCamp.success ? resCamp.campaigns.filter(c => c.status === 'pending_payment').length : 0,
          pendingWithdrawals: resWith.success ? resWith.withdrawals.filter(w => w.status === 'pending').length : 0
        });
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch admin data.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Actions
  const handleApproveCampaign = async (id) => {
    if (!window.confirm('Are you sure you want to approve this campaign payment? The campaign will go live immediately.')) return;
    try {
      const res = await api.approveCampaign(id);
      if (res.success) {
        setMessage('Campaign payment verified and activated.');
        window.dispatchEvent(new CustomEvent('mascot-set-emotion', { detail: { newEmotion: 'happy', duration: 5000 } }));
        fetchData();
      } else {
        setError(res.message || 'Verification failed.');
        window.dispatchEvent(new CustomEvent('mascot-set-emotion', { detail: { newEmotion: 'warning', duration: 4000 } }));
      }
    } catch (err) {
      setError('An error occurred during verification.');
      window.dispatchEvent(new CustomEvent('mascot-set-emotion', { detail: { newEmotion: 'warning', duration: 4000 } }));
    }
  };

  const handleRejectCampaign = async (id) => {
    if (!window.confirm('Are you sure you want to reject this campaign payment?')) return;
    try {
      const res = await api.updateCampaignStatus(id, 'rejected');
      if (res.success) {
        setMessage('Campaign payment rejected.');
        window.dispatchEvent(new CustomEvent('mascot-set-emotion', { detail: { newEmotion: 'warning', duration: 5000 } }));
        fetchData();
      } else {
        setError(res.message || 'Action failed.');
        window.dispatchEvent(new CustomEvent('mascot-set-emotion', { detail: { newEmotion: 'warning', duration: 4000 } }));
      }
    } catch (err) {
      setError('An error occurred.');
      window.dispatchEvent(new CustomEvent('mascot-set-emotion', { detail: { newEmotion: 'warning', duration: 4000 } }));
    }
  };

  const handleReviewWithdrawal = async (id, status) => {
    const reason = status === 'rejected' ? window.prompt('Please specify rejection reason:') : '';
    if (status === 'rejected' && reason === null) return; // cancelled prompt
    try {
      const res = await api.reviewWithdrawalAdmin(id, status, reason);
      if (res.success) {
        setMessage(`Withdrawal ${status} successfully.`);
        window.dispatchEvent(new CustomEvent('mascot-set-emotion', { detail: { newEmotion: status === 'approved' ? 'happy' : 'warning', duration: 5000 } }));
        fetchData();
      } else {
        setError(res.message || 'Action failed.');
        window.dispatchEvent(new CustomEvent('mascot-set-emotion', { detail: { newEmotion: 'warning', duration: 4000 } }));
      }
    } catch (err) {
      setError('An error occurred.');
      window.dispatchEvent(new CustomEvent('mascot-set-emotion', { detail: { newEmotion: 'warning', duration: 4000 } }));
    }
  };

  const handleUpdateBalance = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      const res = await api.updateUserBalance(editingUser._id, newBalance);
      if (res.success) {
        setMessage(`Balance for @${editingUser.username} updated to ₦${Number(newBalance).toLocaleString()}`);
        window.dispatchEvent(new CustomEvent('mascot-set-emotion', { detail: { newEmotion: 'happy', duration: 5000 } }));
        setEditingUser(null);
        fetchData();
      } else {
        setError(res.message || 'Failed to update balance');
        window.dispatchEvent(new CustomEvent('mascot-set-emotion', { detail: { newEmotion: 'warning', duration: 4000 } }));
      }
    } catch (err) {
      setError('An error occurred.');
      window.dispatchEvent(new CustomEvent('mascot-set-emotion', { detail: { newEmotion: 'warning', duration: 4000 } }));
    }
  };

  const handleToggleUserSuspension = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    try {
      // In online mode, calls the suspendUser endpoint:
      // Body needs { userId, status: 'suspended' / 'active' }
      const controller1 = new AbortController();
      setTimeout(() => controller1.abort(), 500);
      const res = await fetch('http://localhost:5000/api/admin/user/suspend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('canyuwork_token')}`
        },
        body: JSON.stringify({ userId, status: nextStatus }),
        signal: controller1.signal
      });
      const data = await res.json();
      
      if (data.success || !res.ok) {
        // Fallback offline
        const users = JSON.parse(localStorage.getItem('cw_offline_users') || '[]');
        const idx = users.findIndex(u => u._id === userId);
        if (idx !== -1) {
          users[idx].status = nextStatus;
          localStorage.setItem('cw_offline_users', JSON.stringify(users));
        }
        setMessage(`User is now ${nextStatus}`);
        window.dispatchEvent(new CustomEvent('mascot-set-emotion', { detail: { newEmotion: nextStatus === 'active' ? 'happy' : 'warning', duration: 5000 } }));
        fetchData();
      } else {
        setError(data.message || 'Status update failed');
        window.dispatchEvent(new CustomEvent('mascot-set-emotion', { detail: { newEmotion: 'warning', duration: 4000 } }));
      }
    } catch (err) {
      // Offline fallback direct
      const users = JSON.parse(localStorage.getItem('cw_offline_users') || '[]');
      const idx = users.findIndex(u => u._id === userId);
      if (idx !== -1) {
        users[idx].status = nextStatus;
        localStorage.setItem('cw_offline_users', JSON.stringify(users));
      }
      setMessage(`User is now ${nextStatus} (Offline fallback)`);
      window.dispatchEvent(new CustomEvent('mascot-set-emotion', { detail: { newEmotion: nextStatus === 'active' ? 'happy' : 'warning', duration: 5000 } }));
      fetchData();
    }
  };

  const handleUpdateCampaignStatus = async (campaignId, status) => {
    if (status === 'deleted' && !window.confirm('Delete this campaign permanently?')) return;
    try {
      const res = await api.updateCampaignStatus(campaignId, status);
      if (res.success) {
        setMessage(`Campaign ${status === 'deleted' ? 'deleted' : 'updated'}.`);
        window.dispatchEvent(new CustomEvent('mascot-set-emotion', { detail: { newEmotion: status === 'active' ? 'happy' : 'warning', duration: 5000 } }));
        fetchData();
      } else {
        setError(res.message || 'Campaign status update failed.');
        window.dispatchEvent(new CustomEvent('mascot-set-emotion', { detail: { newEmotion: 'warning', duration: 4000 } }));
      }
    } catch (err) {
      setError('An error occurred.');
      window.dispatchEvent(new CustomEvent('mascot-set-emotion', { detail: { newEmotion: 'warning', duration: 4000 } }));
    }
  };

  const handleReviewSubmission = async (submissionId, status) => {
    try {
      // Let advertiser/admin verify submissions
      // Check if we can hit the verify endpoint directly
      const token = localStorage.getItem('canyuwork_token');
      const controller2 = new AbortController();
      setTimeout(() => controller2.abort(), 500);
      const res = await fetch(`http://localhost:5000/api/admin/task/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ submissionId, status }),
        signal: controller2.signal
      });
      const data = await res.json();
      if (data.success || !res.ok) {
        // Direct mock fallback for task reviews
        const subs = JSON.parse(localStorage.getItem('cw_offline_submissions') || '[]');
        const idx = subs.findIndex(s => s._id === submissionId);
        if (idx !== -1 && subs[idx].status === 'pending') {
          subs[idx].status = status;
          localStorage.setItem('cw_offline_submissions', JSON.stringify(subs));
          
          // Credit wallet
          if (status === 'approved') {
            const task = JSON.parse(localStorage.getItem('cw_offline_tasks') || '[]').find(t => t._id === subs[idx].taskId);
            const reward = task ? task.rewardAmount || task.reward || 15 : 15;
            const wallets = JSON.parse(localStorage.getItem('cw_offline_wallets') || '{}');
            if (wallets[subs[idx].userId]) {
              wallets[subs[idx].userId].availableBalance += reward;
              wallets[subs[idx].userId].totalEarnings += reward;
              localStorage.setItem('cw_offline_wallets', JSON.stringify(wallets));
            }
          }
        }
        setMessage(`Submission ${status} successfully.`);
        window.dispatchEvent(new CustomEvent('mascot-set-emotion', { detail: { newEmotion: status === 'approved' ? 'happy' : 'warning', duration: 5000 } }));
        fetchData();
      } else {
        setError(data.message || 'Override review failed.');
        window.dispatchEvent(new CustomEvent('mascot-set-emotion', { detail: { newEmotion: 'warning', duration: 4000 } }));
      }
    } catch (err) {
      // Offline direct
      const subs = JSON.parse(localStorage.getItem('cw_offline_submissions') || '[]');
      const idx = subs.findIndex(s => s._id === submissionId);
      if (idx !== -1 && subs[idx].status === 'pending') {
        subs[idx].status = status;
        localStorage.setItem('cw_offline_submissions', JSON.stringify(subs));
        
        if (status === 'approved') {
          const tasks = JSON.parse(localStorage.getItem('cw_offline_tasks') || '[]');
          const sub = subs[idx];
          const task = tasks.find(t => t._id === sub.taskId);
          
          if (task) {
            task.currentCount = (task.currentCount || task.subscribersCount || 0) + 1;
            if (task.currentCount >= (task.targetCount || task.subscribersRequired || 99999)) {
              task.status = 'completed';
            }
            localStorage.setItem('cw_offline_tasks', JSON.stringify(tasks));
          }

          const reward = task ? task.rewardAmount || task.reward || 2 : 2;
          const wallets = JSON.parse(localStorage.getItem('cw_offline_wallets') || '{}');
          if (wallets[sub.userId]) {
            wallets[sub.userId].availableBalance += reward;
            wallets[sub.userId].totalEarnings += reward;
            localStorage.setItem('cw_offline_wallets', JSON.stringify(wallets));
          }
        }
      }
      setMessage(`Submission ${status} successfully (Offline fallback).`);
      window.dispatchEvent(new CustomEvent('mascot-set-emotion', { detail: { newEmotion: status === 'approved' ? 'happy' : 'warning', duration: 5000 } }));
      fetchData();
    }
  };

  const filteredUsers = users.filter(u => 
    u.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-portal-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Migration Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)' }}>
        <div>
          <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.15rem', color: '#00d4ff', display: 'flex', alignItems: 'center', gap: '8px' }}>🚀 Standalone Cockpit: Admin Alexa is Active!</h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.75)' }}>The admin interface has been upgraded to a dedicated platform with a real-time Operations Center activity feed, command controls, and full transaction ledger.</p>
        </div>
        <a href="https://admin-alexa.vercel.app" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ background: 'linear-gradient(90deg, #8b5cf6, #00d4ff)', border: 'none', color: '#ffffff', padding: '0.6rem 1.2rem', fontWeight: 'bold', textDecoration: 'none', borderRadius: '4px', whiteSpace: 'nowrap' }}>Open Admin Alexa ↗</a>
      </div>

      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', padding: '1.25rem 2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
        <div>
          <h2 style={{ fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={24} style={{ color: 'var(--primary)' }} /> Platform Master Control Center
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>Manage USDT deposits, payouts, users, campaigns, and submissions.</p>
        </div>
        <button 
          onClick={fetchData} 
          className="btn btn-outline" 
          disabled={loading} 
          style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw size={14} className={loading ? 'spin-animation' : ''} /> Refresh Data
        </button>
      </div>

      {/* Tabs navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-app)', padding: '0.35rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
        {[
          { id: 'overview', label: 'System Overview', icon: RefreshCw },
          { id: 'pending-campaigns', label: `Pending Payments (${pendingCampaigns.length})`, icon: Coins },
          { id: 'withdrawals', label: 'Withdrawal Payouts', icon: Download },
          { id: 'users', label: 'Users Management', icon: Users },
          { id: 'campaigns', label: 'Advertiser Campaigns', icon: ListTodo },
          { id: 'submissions', label: 'Member Submissions', icon: Check }
        ].map(tab => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.65rem 1.25rem',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                color: activeTab === tab.id ? '#ffffff' : 'var(--text-light)',
                transition: 'all 0.2s ease'
              }}
            >
              <TabIcon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Notifications and Alerts */}
      {message && (
        <div className="alert alert-success" style={{ padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', fontWeight: 600 }}>
          {message}
        </div>
      )}
      {error && (
        <div className="alert alert-error" style={{ padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', fontWeight: 600 }}>
          {error}
        </div>
      )}

      {/* Tab Panels */}
      <div className="card" style={{ padding: '2rem', minHeight: '350px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
        
        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div>
            <h3 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>📊 System Analytics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
              <div style={{ padding: '1.5rem', background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <Users size={28} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
                <h4 style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Total Accounts</h4>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '4px 0 0 0' }}>{analytics.totalUsers}</p>
              </div>
              <div style={{ padding: '1.5rem', background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <ListTodo size={28} style={{ color: '#0ea5e9', marginBottom: '0.5rem' }} />
                <h4 style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Active Campaigns</h4>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '4px 0 0 0' }}>{analytics.activeTasks}</p>
              </div>
              <div style={{ padding: '1.5rem', background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <Coins size={28} style={{ color: '#f59e0b', marginBottom: '0.5rem' }} />
                <h4 style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Pending Payments</h4>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '4px 0 0 0', color: analytics.pendingCampaigns > 0 ? '#f59e0b' : 'inherit' }}>{analytics.pendingCampaigns}</p>
              </div>
              <div style={{ padding: '1.5rem', background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <Download size={28} style={{ color: '#8b5cf6', marginBottom: '0.5rem' }} />
                <h4 style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Pending Payouts</h4>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '4px 0 0 0', color: analytics.pendingWithdrawals > 0 ? '#8b5cf6' : 'inherit' }}>{analytics.pendingWithdrawals}</p>
              </div>
            </div>
            
            <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', fontSize: '0.85rem', color: 'var(--text-light)' }}>
              ⚙️ <strong>Configuration Notice:</strong> This portal gives direct edit powers over the database. Make sure you double-check transaction hashes and screenshot receipts before verifying budget additions.
            </div>
          </div>
        )}

        {/* Tab 2: Pending Campaign Payments */}
        {activeTab === 'pending-campaigns' && (
          <div>
            <h3 style={{ marginBottom: '1.25rem', fontWeight: 800 }}>🪙 Pending Campaign Payments</h3>
            {pendingCampaigns.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                🎉 No pending campaign payments to review.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <th style={{ padding: '0.75rem' }}>Campaign</th>
                      <th style={{ padding: '0.75rem' }}>Target & Cost</th>
                      <th style={{ padding: '0.75rem' }}>Ref/TxID</th>
                      <th style={{ padding: '0.75rem' }}>Date</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingCampaigns.map(camp => (
                      <tr key={camp._id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
                        <td style={{ padding: '1rem 0.75rem' }}>
                          <strong style={{ display: 'block' }}>{camp.title}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{camp.platform}</span>
                        </td>
                        <td style={{ padding: '1rem 0.75rem', color: 'var(--primary)' }}>
                          <strong style={{ display: 'block' }}>₦{Number(camp.totalCost).toLocaleString()}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{camp.targetCount} targets</span>
                        </td>
                        <td style={{ padding: '1rem 0.75rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                          {camp.referenceNumber || 'N/A'}
                        </td>
                        <td style={{ padding: '1rem 0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {new Date(camp.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button 
                              onClick={() => handleApproveCampaign(camp._id)}
                              className="btn btn-primary btn-sm" 
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '0.35rem 0.65rem' }}
                            >
                              <Check size={14} /> Approve
                            </button>
                            <button 
                              onClick={() => handleRejectCampaign(camp._id)}
                              className="btn btn-outline btn-sm" 
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '0.35rem 0.65rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                            >
                              <X size={14} /> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Withdrawals */}
        {activeTab === 'withdrawals' && (
          <div>
            <h3 style={{ marginBottom: '1.25rem', fontWeight: 800 }}>💸 Withdrawal Payout Requests</h3>
            {withdrawals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                No payout requests logged in database.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <th style={{ padding: '0.75rem' }}>Member</th>
                      <th style={{ padding: '0.75rem' }}>Method</th>
                      <th style={{ padding: '0.75rem' }}>Payout Info</th>
                      <th style={{ padding: '0.75rem' }}>Amount</th>
                      <th style={{ padding: '0.75rem' }}>Status</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals.map(w => (
                      <tr key={w._id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
                        <td style={{ padding: '1rem 0.75rem' }}>
                          <strong>{w.fullname}</strong>
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{w.username}</span>
                        </td>
                        <td style={{ padding: '1rem 0.75rem' }}>{w.method}</td>
                        <td style={{ padding: '1rem 0.75rem', fontSize: '0.8rem', fontFamily: 'monospace' }}>{w.accountDetails}</td>
                        <td style={{ padding: '1rem 0.75rem', fontWeight: 'bold' }}>₦{Number(w.amount).toLocaleString()}</td>
                        <td style={{ padding: '1rem 0.75rem' }}>
                          <span style={{
                            padding: '0.2rem 0.5rem',
                            borderRadius: '10px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            background: w.status === 'paid' ? 'rgba(16, 185, 129, 0.15)' : w.status === 'pending' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: w.status === 'paid' ? '#10b981' : w.status === 'pending' ? '#f59e0b' : '#ef4444'
                          }}>
                            {w.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>
                          {w.status === 'pending' ? (
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                              <button 
                                onClick={() => handleReviewWithdrawal(w._id, 'approved')}
                                className="btn btn-outline btn-sm" 
                                style={{ color: '#10b981', borderColor: '#10b981' }}
                              >
                                Approve Payout
                              </button>
                              <button 
                                onClick={() => handleReviewWithdrawal(w._id, 'rejected')}
                                className="btn btn-outline btn-sm" 
                                style={{ color: '#ef4444', borderColor: '#ef4444' }}
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Processed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Users Management */}
        {activeTab === 'users' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '1rem', flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, fontWeight: 800 }}>👤 Users Database</h3>
              
              {/* Search bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-app)', border: '1px solid var(--border-color)', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-sm)', maxWidth: '300px', width: '100%' }}>
                <Search size={16} style={{ color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="Search username, fullname, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {editingUser && (
              <form onSubmit={handleUpdateBalance} style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.85rem' }}>Update balance for <strong>@{editingUser.username}</strong>:</span>
                <input 
                  type="number" 
                  value={newBalance}
                  onChange={(e) => setNewBalance(e.target.value)}
                  placeholder="e.g. 50000"
                  style={{ maxWidth: '150px', padding: '0.4rem' }}
                  required
                />
                <button type="submit" className="btn btn-primary btn-sm">Save</button>
                <button type="button" onClick={() => setEditingUser(null)} className="btn btn-outline btn-sm">Cancel</button>
              </form>
            )}

            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <th style={{ padding: '0.75rem' }}>User details</th>
                    <th style={{ padding: '0.75rem' }}>Role</th>
                    <th style={{ padding: '0.75rem' }}>Balance</th>
                    <th style={{ padding: '0.75rem' }}>Status</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
                      <td style={{ padding: '0.85rem 0.75rem' }}>
                        <strong style={{ display: 'block' }}>{u.fullname}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{u.username} | {u.email}</span>
                      </td>
                      <td style={{ padding: '0.85rem 0.75rem', textTransform: 'capitalize' }}>
                        <span style={{
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: u.role === 'admin' ? 'rgba(239, 68, 68, 0.1)' : u.role === 'advertiser' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                          color: u.role === 'admin' ? '#ef4444' : u.role === 'advertiser' ? '#8b5cf6' : '#3b82f6'
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 0.75rem', fontWeight: 600 }}>₦{Number(u.balance || 0).toLocaleString()}</td>
                      <td style={{ padding: '0.85rem 0.75rem' }}>
                        <span style={{
                          padding: '0.2rem 0.5rem',
                          borderRadius: '10px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          background: u.status === 'suspended' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          color: u.status === 'suspended' ? '#ef4444' : '#10b981'
                        }}>
                          {u.status || 'active'}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 0.75rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button 
                            onClick={() => { setEditingUser(u); setNewBalance(u.balance || 0); }}
                            className="btn btn-outline btn-sm" 
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '0.3rem 0.5rem' }}
                            title="Edit balance"
                          >
                            <Edit size={12} /> Balance
                          </button>
                          <button 
                            onClick={() => handleToggleUserSuspension(u._id, u.status)}
                            className="btn btn-outline btn-sm" 
                            style={{ 
                              padding: '0.3rem 0.5rem',
                              color: u.status === 'suspended' ? '#10b981' : '#ef4444',
                              borderColor: u.status === 'suspended' ? '#10b981' : '#ef4444'
                            }}
                          >
                            {u.status === 'suspended' ? 'Activate' : 'Suspend'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Campaigns Control */}
        {activeTab === 'campaigns' && (
          <div>
            <h3 style={{ marginBottom: '1.25rem', fontWeight: 800 }}>📋 Advertiser Task Campaigns</h3>
            {campaigns.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                No advertiser campaigns registered in database.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <th style={{ padding: '0.75rem' }}>Campaign Title</th>
                      <th style={{ padding: '0.75rem' }}>Platform</th>
                      <th style={{ padding: '0.75rem' }}>Payout Reward</th>
                      <th style={{ padding: '0.75rem' }}>Remaining Slots</th>
                      <th style={{ padding: '0.75rem' }}>Status</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map(c => (
                      <tr key={c._id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
                        <td style={{ padding: '1rem 0.75rem' }}>
                          <strong style={{ display: 'block' }}>{c.title}</strong>
                        </td>
                        <td style={{ padding: '1rem 0.75rem', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 'bold' }}>{c.platform}</td>
                        <td style={{ padding: '1rem 0.75rem' }}>₦{Number(c.rewardAmount || c.reward || 0).toLocaleString()}</td>
                        <td style={{ padding: '1rem 0.75rem' }}>{c.remainingSlots || c.remainingBudget || 0}</td>
                        <td style={{ padding: '1rem 0.75rem' }}>
                          <span style={{
                            padding: '0.2rem 0.5rem',
                            borderRadius: '10px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            background: c.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : c.status === 'paused' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: c.status === 'active' ? '#10b981' : c.status === 'paused' ? '#f59e0b' : '#ef4444'
                          }}>
                            {c.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            {c.status === 'active' ? (
                              <button 
                                onClick={() => handleUpdateCampaignStatus(c._id, 'paused')}
                                className="btn btn-outline btn-sm" 
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                              >
                                <Pause size={12} /> Pause
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleUpdateCampaignStatus(c._id, 'active')}
                                className="btn btn-outline btn-sm" 
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                              >
                                <Play size={12} /> Activate
                              </button>
                            )}
                            <button 
                              onClick={() => handleUpdateCampaignStatus(c._id, 'deleted')}
                              className="btn btn-outline btn-sm" 
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#ef4444', borderColor: '#ef4444' }}
                            >
                              <Trash2 size={12} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 6: Submissions Override */}
        {activeTab === 'submissions' && (
          <div>
            <h3 style={{ marginBottom: '1.25rem', fontWeight: 800 }}>🤝 Member Work Submissions (Override Control)</h3>
            {submissions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                No task submissions logged in database.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <th style={{ padding: '0.75rem' }}>Member</th>
                      <th style={{ padding: '0.75rem' }}>Campaign Task</th>
                      <th style={{ padding: '0.75rem' }}>Social Handles</th>
                      <th style={{ padding: '0.75rem' }}>Reward</th>
                      <th style={{ padding: '0.75rem' }}>Status</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map(sub => (
                      <tr key={sub._id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
                        <td style={{ padding: '1rem 0.75rem' }}>
                          <strong>{sub.fullname}</strong>
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{sub.username}</span>
                        </td>
                        <td style={{ padding: '1rem 0.75rem' }}>{sub.taskTitle}</td>
                        <td style={{ padding: '1rem 0.75rem', fontSize: '0.8rem' }}>
                          <strong>Handle:</strong> {sub.socialUsername || 'N/A'} <br />
                          <strong>Proof:</strong> {sub.proofText || 'Uploaded image'}
                        </td>
                        <td style={{ padding: '1rem 0.75rem', fontWeight: 'bold' }}>₦{Number(sub.reward).toLocaleString()}</td>
                        <td style={{ padding: '1rem 0.75rem' }}>
                          <span style={{
                            padding: '0.2rem 0.5rem',
                            borderRadius: '10px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            background: sub.status === 'approved' ? 'rgba(16, 185, 129, 0.15)' : sub.status === 'pending' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: sub.status === 'approved' ? '#10b981' : sub.status === 'pending' ? '#f59e0b' : '#ef4444'
                          }}>
                            {sub.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>
                          {sub.status === 'pending' ? (
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                              <button 
                                onClick={() => handleReviewSubmission(sub._id, 'approved')}
                                className="btn btn-outline btn-sm" 
                                style={{ color: '#10b981', borderColor: '#10b981' }}
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => handleReviewSubmission(sub._id, 'rejected')}
                                className="btn btn-outline btn-sm" 
                                style={{ color: '#ef4444', borderColor: '#ef4444' }}
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Reviewed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Lightbox Modal for Receipts */}
      {selectedReceipt && (
        <div 
          onClick={() => setSelectedReceipt(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            cursor: 'zoom-out'
          }}
        >
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%', background: 'transparent' }} onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedReceipt(null)}
              style={{
                position: 'absolute',
                top: '-2.5rem',
                right: 0,
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '2rem',
                cursor: 'pointer'
              }}
            >
              &times;
            </button>
            <img 
              src={selectedReceipt} 
              alt="Payment receipt full screenshot" 
              style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: 'var(--radius-md)', border: '2px solid rgba(255,255,255,0.1)', objectFit: 'contain' }}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPortal;
