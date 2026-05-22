import React, { useState, useEffect } from 'react';
import { Copy, Check, Users, Sparkles, TrendingUp, HelpCircle, Gift } from 'lucide-react';
import { api } from '../api';

const Referrals = () => {
  const [data, setData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchReferralsData();
  }, []);

  const fetchReferralsData = async () => {
    const res = await api.getReferrals();
    if (res.success) {
      setData(res);
    }
  };

  const handleCopyLink = () => {
    if (data && data.referralLink) {
      navigator.clipboard.writeText(data.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!data) {
    return <div className="loading-spinner-container">Loading Referrals Hub...</div>;
  }

  const { referralCode, referralLink, stats, earningsBreakdown, referralHistory } = data;

  return (
    <div className="referrals-view-container">
      {/* Invite Code card */}
      <div className="referrals-invite-card card">
        <div className="invite-glow"></div>
        <div className="invite-content">
          <div className="invite-left">
            <span className="invite-badge">
              <Gift size={14} /> Referral Rewards program
            </span>
            <h2>Invite Friends & Earn Passive Income</h2>
            <p>
              Get <strong>10% lifetime commission</strong> on all microtask rewards completed by your referrals. Plus, earn milestone bonuses: <strong>₦200</strong> on their first completed task, and <strong>₦300</strong> on their fifth completed task. That's up to <strong>₦500</strong> bonus per friend!
            </p>
            <div className="referral-link-copy-box">
              <input type="text" value={referralLink} readOnly />
              <button className="copy-btn" onClick={handleCopyLink}>
                {copied ? <Check size={18} /> : <Copy size={18} />}
                <span>{copied ? 'Copied' : 'Copy link'}</span>
              </button>
            </div>
          </div>
          <div className="invite-right flex-center">
            <div className="referral-code-badge">
              <span className="code-label">Your Referral Code</span>
              <span className="code-value">{referralCode}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Stats row */}
      <div className="referrals-stats-grid">
        <div className="card stat-widget flex-row">
          <div className="widget-icon-bg primary">
            <Users size={20} />
          </div>
          <div className="widget-info">
            <span className="widget-label">Total Referrals Joined</span>
            <h3>{stats.totalReferrals}</h3>
            <span className="widget-sub">Active: {stats.activeReferrals} accounts</span>
          </div>
        </div>

        <div className="card stat-widget flex-row">
          <div className="widget-icon-bg success">
            <TrendingUp size={20} />
          </div>
          <div className="widget-info">
            <span className="widget-label">Referral Earnings Paid</span>
            <h3>₦{earningsBreakdown.totalEarnings.toLocaleString()}</h3>
            <span className="widget-sub">Added to balance</span>
          </div>
        </div>

        <div className="card stat-widget flex-row">
          <div className="widget-icon-bg warning">
            <Sparkles size={20} />
          </div>
          <div className="widget-info">
            <span className="widget-label">Pending Earnings</span>
            <h3>₦{earningsBreakdown.pending.toLocaleString()}</h3>
            <span className="widget-sub">Awaiting friend task reviews</span>
          </div>
        </div>
      </div>

      {/* Friends logs list */}
      <div className="referrals-history-card card">
        <div className="card-header-row">
          <h3>Your Replaced Referrals ({referralHistory.length})</h3>
        </div>

        {referralHistory.length === 0 ? (
          <div className="empty-history-placeholder">
            <HelpCircle size={40} className="text-muted" />
            <h4>No friends invited yet</h4>
            <p>Your referral link is waiting. Share it on Telegram or X to start earning!</p>
          </div>
        ) : (
          <div className="history-table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Friend Name</th>
                  <th>Email</th>
                  <th>Join Date</th>
                  <th>Earned from Friend</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {referralHistory.map((ref, index) => (
                  <tr key={index}>
                    <td>
                      <strong>{ref.fullname}</strong>
                    </td>
                    <td>{ref.email}</td>
                    <td>{new Date(ref.joinedOn).toLocaleDateString()}</td>
                    <td>₦{ref.totalEarned.toLocaleString()}</td>
                    <td>
                      <span className={`status-pill ${ref.status.toLowerCase()}`}>
                        {ref.status.toUpperCase()}
                      </span>
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

export default Referrals;
