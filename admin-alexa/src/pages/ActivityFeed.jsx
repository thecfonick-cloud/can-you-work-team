import { useState, useEffect } from 'react';
import { Activity, Filter, RefreshCw, User, Megaphone, DollarSign, ClipboardCheck, UserPlus } from 'lucide-react';
import { adminApi } from '../api';

const typeIcons = { user_signup: UserPlus, campaign: Megaphone, submission: ClipboardCheck, deposit: DollarSign, withdrawal: DollarSign, balance: DollarSign, notification: Activity, user_action: User };
const typeColors = { user_signup: '#10b981', campaign: '#8b5cf6', submission: '#00d4ff', deposit: '#f59e0b', withdrawal: '#ef4444', balance: '#00d4ff', notification: '#8b5cf6', user_action: '#64748b' };

const ActivityFeed = () => {
  const [log, setLog] = useState([]);
  const [filter, setFilter] = useState('all');

  const refresh = () => {
    const res = adminApi.getActivityLog(filter !== 'all' ? { type: filter } : {});
    if (res.success) setLog(res.log);
  };

  useEffect(() => { refresh(); }, [filter]);

  const filters = ['all', 'user_signup', 'campaign', 'submission', 'deposit', 'withdrawal', 'balance'];

  return (
    <div className="animate-fade-in">
      <div className="card-header" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {filters.map(f => (
            <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(f)}>
              {f === 'all' ? 'All' : f.replace('_', ' ')}
            </button>
          ))}
        </div>
        <button className="btn btn-outline btn-sm" onClick={refresh}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="glass-card">
        <div className="activity-feed" style={{ maxHeight: 'calc(100vh - 250px)', overflowY: 'auto' }}>
          {log.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <Activity size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <p>No activity recorded yet.</p>
              <p style={{ fontSize: '0.85rem' }}>Actions from the main CanYouWork app will appear here in real-time.</p>
            </div>
          )}
          {log.map((item, i) => {
            const Icon = typeIcons[item.type] || Activity;
            const color = typeColors[item.type] || '#64748b';
            return (
              <div key={item.id || i} className="activity-item animate-slide-up" style={{ animationDelay: `${i * 0.03}s` }}>
                <div className="activity-dot pulse" style={{ backgroundColor: color }}></div>
                <div className="activity-content" style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon size={14} style={{ color }} />
                    <span className="activity-desc">{item.description}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                    <span className="activity-time text-mono">{new Date(item.timestamp).toLocaleString()}</span>
                    <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>{item.type}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;
