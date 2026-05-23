import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, CheckCircle2, AlertCircle, ArrowLeft, ShieldAlert } from 'lucide-react';
import { api } from '../api';

const ManageCampaigns = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await api.getAdvertiserCampaigns();
      if (res.success) {
        setCampaigns(res.campaigns || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return (
    <div className="campaigns-list-container">
      <button 
        onClick={() => navigate('/advertiser/dashboard')} 
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', marginBottom: '1.5rem', fontWeight: 600 }}
      >
        <ArrowLeft size={16} /> Back to Workspace
      </button>

      <div className="card" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontWeight: 800 }}>📁 My Launched Campaigns</h2>
            <p style={{ color: 'var(--text-muted)' }}>Monitor and track task fulfillment metrics for your microtasks.</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/advertiser/create-campaign')}>
            + New Campaign
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Loading campaigns...
          </div>
        ) : campaigns.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
            <Layers size={40} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>No active campaigns found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
              Create your first social media microtask campaign and get thousands of organic follows and likes in minutes!
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/advertiser/create-campaign')}>
              Launch First Campaign
            </button>
          </div>
        ) : (
          <div className="table-responsive" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '0.75rem', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Campaign Detail</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Platform</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Fulfillment</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Cost Details</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => {
                  const percent = c.totalBudget > 0 ? Math.min(100, Math.floor(((c.totalBudget - c.remainingBudget) / c.totalBudget) * 100)) : 0;
                  return (
                    <tr key={c._id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.95rem' }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 'bold' }}>{c.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {c.guidelines}
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          background: c.platform === 'Instagram' ? 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' : c.platform === 'YouTube' ? '#ff0000' : 'var(--primary)',
                          color: '#ffffff'
                        }}>
                          {c.platform}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                          <span>{c.subscribersCount} / {c.subscribersRequired} completions</span>
                          <span>{percent}%</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: 'var(--bg-app)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${percent}%`, height: '100%', background: 'var(--primary)', borderRadius: '3px' }}></div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div><strong>₦{c.reward}</strong> / task</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Budget: ₦{c.totalBudget.toLocaleString()}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          padding: '0.25rem 0.5rem',
                          borderRadius: 'var(--radius-full)',
                          background: c.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                          color: c.status === 'active' ? '#10b981' : '#64748b'
                        }}>
                          {c.status === 'active' ? 'Active' : 'Completed'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <button 
                          className="btn btn-outline btn-sm"
                          onClick={() => navigate('/advertiser/verify-submissions')}
                        >
                          Check Proofs
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCampaigns;
