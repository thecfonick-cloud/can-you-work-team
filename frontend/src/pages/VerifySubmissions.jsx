import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, CheckCircle, XCircle, ArrowLeft, ExternalLink } from 'lucide-react';
import { api } from '../api';

const VerifySubmissions = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await api.getAdvertiserSubmissions();
      if (res.success) {
        setSubmissions(res.submissions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleVerify = async (subId, status) => {
    setActionLoading(subId);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await api.verifySubmission(subId, status);
      if (res.success) {
        setSuccessMsg(`Proof successfully ${status}!`);
        // Remove verified sub from list
        setSubmissions(prev => prev.filter(s => s._id !== subId));
      } else {
        setErrorMsg(res.message || 'Verification update failed');
      }
    } catch (err) {
      setErrorMsg('An error occurred during verification processing');
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="verify-submissions-container">
      <button 
        onClick={() => navigate('/advertiser/dashboard')} 
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', marginBottom: '1.5rem', fontWeight: 600 }}
      >
        <ArrowLeft size={16} /> Back to Workspace
      </button>

      <div className="card" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ marginBottom: '0.5rem', fontWeight: 800 }}>🤝 Verify User Proofs</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Review task screenshot submissions and approve rewards for correct claims.</p>

        {successMsg && (
          <div className="auth-alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <CheckCircle size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="auth-alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <XCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Loading pending proofs...
          </div>
        ) : submissions.filter(s => s.status === 'pending').length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
            <CheckSquare size={40} style={{ color: '#10b981', marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>All Caught Up!</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>
              No pending earner submissions are waiting for your approval. Excellent job!
            </p>
          </div>
        ) : (
          <div className="table-responsive" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Earner Account</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Campaign Task</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Fulfillment Proof</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Reward</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Verify Proof</th>
                </tr>
              </thead>
              <tbody>
                {submissions.filter(s => s.status === 'pending').map((s) => (
                  <tr key={s._id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.95rem' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 'bold' }}>@{s.username}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Earner ID: {s.userId.substring(0, 10)}...</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 'bold' }}>{s.taskTitle}</div>
                      <span style={{
                        padding: '0.15rem 0.4rem',
                        borderRadius: '3px',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        background: 'var(--bg-app)',
                        color: 'var(--text-light)',
                        border: '1px solid var(--border-color)',
                        display: 'inline-block',
                        marginTop: '0.25rem'
                      }}>
                        {s.platform}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div>Username: <strong style={{ color: 'var(--primary)' }}>@{s.socialUsername}</strong></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <span style={{ fontSize: '14px' }}>📄</span>
                          <span>Proof Screenshot Uploaded</span>
                          <a href="#view" onClick={(e) => { e.preventDefault(); alert(`Task Guidelines:\n${s.taskTitle}\n\nSubmitted Proof username: @${s.socialUsername}\n(Simulation: Screen capture verified matching)`); }} style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', color: 'var(--primary)', fontWeight: 'bold' }}>
                            View <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontWeight: 800, color: 'var(--primary)' }}>+₦{s.reward}</span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ borderColor: '#ef4444', color: '#ef4444', background: 'rgba(239, 68, 68, 0.05)', padding: '0.4rem 0.8rem' }}
                          onClick={() => handleVerify(s._id, 'rejected')}
                          disabled={actionLoading === s._id}
                        >
                          Reject
                        </button>
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ background: '#10b981', color: '#ffffff', border: 'none', padding: '0.4rem 0.8rem' }}
                          onClick={() => handleVerify(s._id, 'approved')}
                          disabled={actionLoading === s._id}
                        >
                          {actionLoading === s._id ? 'Verifying...' : 'Approve'}
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
    </div>
  );
};

export default VerifySubmissions;
