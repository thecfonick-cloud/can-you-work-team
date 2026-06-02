import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Pause, Play, Trash2, RefreshCw } from 'lucide-react';
import { adminApi } from '../api';

const CampaignCenter = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filter, setFilter] = useState('all');
  const [msg, setMsg] = useState('');

  const refresh = () => {
    const res = adminApi.getAllCampaigns();
    if (res.success) setCampaigns(res.campaigns);
  };

  useEffect(() => { refresh(); }, []);

  const filtered = campaigns.filter(c => filter === 'all' || c.status === filter);

  const action = (fn, ...args) => {
    const res = fn(...args);
    if (res.success) { refresh(); setMsg(res.message || 'Done'); setTimeout(() => setMsg(''), 3000); }
  };

  const statusBadge = (s) => {
    const map = { active: 'badge-success', pending_payment: 'badge-warning', paused: 'badge-info', rejected: 'badge-danger', completed: 'badge-purple', deleted: 'badge-danger' };
    return <span className={`badge ${map[s] || 'badge-info'}`}>{s?.replace('_', ' ')}</span>;
  };

  const filters = ['all', 'active', 'pending_payment', 'paused', 'completed', 'rejected'];

  return (
    <div className="animate-fade-in">
      {msg && <div className="alert alert-success">{msg}</div>}

      <div className="card-header" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {filters.map(f => (
            <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(f)}>
              {f === 'all' ? `All (${campaigns.length})` : `${f.replace('_', ' ')} (${campaigns.filter(c => c.status === f).length})`}
            </button>
          ))}
        </div>
        <button className="btn btn-outline btn-sm" onClick={refresh}><RefreshCw size={14} /> Refresh</button>
      </div>

      <div className="glass-card" style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Advertiser</th>
              <th>Platform</th>
              <th>Target</th>
              <th>Progress</th>
              <th>Cost</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td data-label="Campaign"><strong>{c.title}</strong></td>
                <td data-label="Advertiser" className="text-muted">{c.advertiser?.name || 'Unknown'}</td>
                <td data-label="Platform"><span className="badge badge-info">{c.platform}</span></td>
                <td data-label="Target" className="text-mono">{c.targetCount}</td>
                <td data-label="Progress">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'flex-end' }}>
                    <div style={{ flex: 1, maxWidth: '100px', height: '6px', background: 'var(--bg-deepest)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(100, ((c.currentCount || 0) / c.targetCount) * 100)}%`, height: '100%', background: 'var(--accent-cyan)', borderRadius: '3px', transition: 'width 0.5s ease' }}></div>
                    </div>
                    <span className="text-mono" style={{ fontSize: '0.8rem' }}>{c.currentCount || 0}/{c.targetCount}</span>
                  </div>
                </td>
                <td data-label="Cost" className="text-mono">₦{(c.totalCost || 0).toLocaleString()}</td>
                <td data-label="Status">{statusBadge(c.status)}</td>
                <td data-label="Actions">
                  <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end' }}>
                    {c.status === 'pending_payment' && (
                      <>
                        <button className="btn btn-success btn-sm" onClick={() => action(adminApi.approveCampaign, c.id)}><CheckCircle size={12} /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => action(adminApi.rejectCampaign, c.id)}><XCircle size={12} /></button>
                      </>
                    )}
                    {c.status === 'active' && <button className="btn btn-outline btn-sm" onClick={() => action(adminApi.pauseCampaign, c.id)}><Pause size={12} /></button>}
                    {c.status === 'paused' && <button className="btn btn-success btn-sm" onClick={() => action(adminApi.resumeCampaign, c.id)}><Play size={12} /></button>}
                    {c.status !== 'deleted' && <button className="btn btn-danger btn-sm" onClick={() => { if (confirm('Delete this campaign?')) action(adminApi.deleteCampaign, c.id); }}><Trash2 size={12} /></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No campaigns found</p>}
      </div>
    </div>
  );
};

export default CampaignCenter;
