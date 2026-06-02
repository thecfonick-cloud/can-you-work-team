import { useState, useEffect } from 'react';
import { Search, Shield, Ban, Trash2, Edit3, X, Check, Eye } from 'lucide-react';
import { adminApi } from '../api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [editBalanceId, setEditBalanceId] = useState(null);
  const [newBalance, setNewBalance] = useState('');
  const [msg, setMsg] = useState('');

  const refresh = () => {
    const res = adminApi.getAllUsers();
    if (res.success) setUsers(res.users);
  };

  useEffect(() => { refresh(); }, []);

  const filtered = users.filter(u => {
    const matchSearch = !search || u.fullname?.toLowerCase().includes(search.toLowerCase()) || u.username?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleSuspend = (userId, current) => {
    const res = current === 'suspended' ? adminApi.activateUser(userId) : adminApi.suspendUser(userId);
    if (res.success) { refresh(); setMsg(res.message); setTimeout(() => setMsg(''), 3000); }
  };

  const handleDelete = (userId) => {
    if (!confirm('Permanently delete this user and all their data?')) return;
    const res = adminApi.deleteUser(userId);
    if (res.success) { refresh(); setMsg('User deleted'); setTimeout(() => setMsg(''), 3000); }
  };

  const handleBalanceUpdate = (userId) => {
    const res = adminApi.updateUserBalance(userId, parseFloat(newBalance));
    if (res.success) { refresh(); setEditBalanceId(null); setNewBalance(''); setMsg('Balance updated'); setTimeout(() => setMsg(''), 3000); }
  };

  const viewDetail = (userId) => {
    const res = adminApi.getUserDetail(userId);
    if (res.success) setSelectedUser(res);
  };

  const roleBadge = (role) => {
    const cls = role === 'admin' ? 'badge-danger' : role === 'advertiser' ? 'badge-purple' : 'badge-info';
    return <span className={`badge ${cls}`}>{role}</span>;
  };

  return (
    <div className="animate-fade-in">
      {msg && <div className="alert alert-success">{msg}</div>}

      <div className="card-header" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['all', 'user', 'advertiser', 'admin'].map(r => (
            <button key={r} className={`btn btn-sm ${roleFilter === r ? 'btn-primary' : 'btn-outline'}`} onClick={() => setRoleFilter(r)}>
              {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}s
            </button>
          ))}
        </div>
        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input className="form-input" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="glass-card" style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Balance</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td>
                  <div><strong>{u.fullname}</strong></div>
                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>@{u.username} · {u.email}</div>
                </td>
                <td>{roleBadge(u.role)}</td>
                <td>
                  {editBalanceId === u.id ? (
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <input className="form-input" style={{ width: '100px', padding: '0.25rem 0.5rem' }} type="number" value={newBalance} onChange={e => setNewBalance(e.target.value)} />
                      <button className="btn btn-success btn-sm" onClick={() => handleBalanceUpdate(u.id)}><Check size={12} /></button>
                      <button className="btn btn-outline btn-sm" onClick={() => setEditBalanceId(null)}><X size={12} /></button>
                    </div>
                  ) : (
                    <span className="text-mono">₦{(u.wallet?.balance || 0).toLocaleString()}</span>
                  )}
                </td>
                <td>
                  <span className={`badge ${u.status === 'suspended' ? 'badge-danger' : 'badge-success'}`}>
                    {u.status || 'active'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button className="btn btn-outline btn-sm" title="View" onClick={() => viewDetail(u.id)}><Eye size={12} /></button>
                    <button className="btn btn-outline btn-sm" title="Edit Balance" onClick={() => { setEditBalanceId(u.id); setNewBalance(u.wallet?.balance || 0); }}><Edit3 size={12} /></button>
                    {u.role !== 'admin' && (
                      <>
                        <button className={`btn btn-sm ${u.status === 'suspended' ? 'btn-success' : 'btn-danger'}`} onClick={() => handleSuspend(u.id, u.status)}>
                          {u.status === 'suspended' ? <Shield size={12} /> : <Ban size={12} />}
                        </button>
                        <button className="btn btn-danger btn-sm" title="Delete" onClick={() => handleDelete(u.id)}><Trash2 size={12} /></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No users found</p>}
      </div>

      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedUser.user.fullname}</h3>
              <button className="btn btn-outline btn-sm" onClick={() => setSelectedUser(null)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                <div className="stat-card"><div className="stat-label">Balance</div><div className="stat-value text-mono">₦{(selectedUser.wallet?.availableBalance || 0).toLocaleString()}</div></div>
                <div className="stat-card"><div className="stat-label">Total Earned</div><div className="stat-value text-mono">₦{(selectedUser.wallet?.totalEarnings || 0).toLocaleString()}</div></div>
                <div className="stat-card"><div className="stat-label">Submissions</div><div className="stat-value">{selectedUser.submissions?.length || 0}</div></div>
                <div className="stat-card"><div className="stat-label">Referrals</div><div className="stat-value">{selectedUser.referrals?.length || 0}</div></div>
              </div>
              <h4 style={{ marginBottom: '0.5rem' }}>Recent Transactions</h4>
              {(selectedUser.transactions || []).slice(0, 5).map((tx, i) => (
                <div key={i} className="activity-item">
                  <span className="text-muted text-mono" style={{ fontSize: '0.8rem' }}>{new Date(tx.createdAt).toLocaleDateString()}</span>
                  <span style={{ flex: 1, marginLeft: '0.5rem' }}>{tx.description || tx.type}</span>
                  <span className="text-mono">₦{tx.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
