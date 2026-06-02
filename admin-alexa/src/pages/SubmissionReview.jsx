import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RefreshCw, Eye } from 'lucide-react';
import { adminApi } from '../api';

const SubmissionReview = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [msg, setMsg] = useState('');

  const refresh = () => {
    const res = adminApi.getAllSubmissions();
    if (res.success) setSubmissions(res.submissions);
  };

  useEffect(() => { refresh(); }, []);

  const filtered = submissions.filter(s => filter === 'all' || s.status === filter);

  const act = (fn, ...args) => {
    const res = fn(...args);
    if (res.success) { refresh(); setMsg(res.message || 'Done'); setTimeout(() => setMsg(''), 3000); }
  };

  const statusBadge = (s) => {
    const map = { approved: 'badge-success', pending: 'badge-warning', rejected: 'badge-danger' };
    return <span className={`badge ${map[s] || 'badge-info'}`}>{s}</span>;
  };

  const filters = ['all', 'pending', 'approved', 'rejected'];

  return (
    <div className="animate-fade-in">
      {msg && <div className="alert alert-success">{msg}</div>}

      <div className="card-header" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {filters.map(f => (
            <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(f)}>
              {f === 'all' ? `All (${submissions.length})` : `${f} (${submissions.filter(s => s.status === f).length})`}
            </button>
          ))}
        </div>
        <button className="btn btn-outline btn-sm" onClick={refresh}><RefreshCw size={14} /> Refresh</button>
      </div>

      <div className="glass-card" style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Campaign</th>
              <th>Proof</th>
              <th>Social Handle</th>
              <th>Reward</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <td data-label="User">
                  <div><strong>{s.user?.name || 'Unknown'}</strong></div>
                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>{s.user?.email || '—'}</div>
                </td>
                <td data-label="Campaign">
                  <div>{s.task?.title || 'Task'}</div>
                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>{s.platform || ''}</div>
                </td>
                <td data-label="Proof" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {s.proofText || '—'}
                </td>
                <td data-label="Social Handle" className="text-mono" style={{ fontSize: '0.85rem' }}>{s.socialUsername || '—'}</td>
                <td data-label="Reward" className="text-mono text-success">₦{s.reward || 2}</td>
                <td data-label="Status">{statusBadge(s.status)}</td>
                <td data-label="Date" className="text-muted" style={{ fontSize: '0.8rem' }}>{new Date(s.createdAt).toLocaleDateString()}</td>
                <td data-label="Actions">
                  {s.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button className="btn btn-success btn-sm" onClick={() => act(adminApi.approveSubmission, s.id)}><CheckCircle size={12} /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => act(adminApi.rejectSubmission, s.id)}><XCircle size={12} /></button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No submissions found</p>}
      </div>
    </div>
  );
};

export default SubmissionReview;
