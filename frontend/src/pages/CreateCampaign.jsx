import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Coins, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import { api } from '../api';

const CreateCampaign = ({ user, refreshUser }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState(searchParams.get('platform') || 'Instagram');
  const [guidelines, setGuidelines] = useState('');
  const [rewardPerTask, setRewardPerTask] = useState(15);
  const [totalBudget, setTotalBudget] = useState(1500);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Automatically calculate target completions count
  const completionsTarget = rewardPerTask > 0 ? Math.floor(totalBudget / rewardPerTask) : 0;

  useEffect(() => {
    const plat = searchParams.get('platform');
    if (plat) {
      setPlatform(plat);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !guidelines) {
      setError('Please enter campaign title and guidelines');
      return;
    }
    if (rewardPerTask <= 0 || totalBudget <= 0) {
      setError('Reward per task and total budget must be greater than zero');
      return;
    }
    if (totalBudget < 1000) {
      setError('Minimum campaign budget is ₦1,000');
      return;
    }
    if (rewardPerTask < 10) {
      setError('Minimum task reward is ₦10 per completion');
      return;
    }
    if (user.balance < totalBudget) {
      setError('Insufficient budget balance. Please fund your wallet.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.createCampaign(title, platform, guidelines, rewardPerTask, totalBudget);
      setLoading(false);
      
      if (res.success) {
        setSuccess(true);
        refreshUser();
        setTimeout(() => {
          navigate('/advertiser/manage-campaigns');
        }, 1500);
      } else {
        setError(res.message || 'Failed to launch campaign');
      }
    } catch (err) {
      setLoading(false);
      setError('An error occurred during campaign creation');
      console.error(err);
    }
  };

  return (
    <div className="campaign-form-container" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate('/advertiser/dashboard')} 
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', marginBottom: '1.5rem', fontWeight: 600 }}
      >
        <ArrowLeft size={16} /> Back to Workspace
      </button>

      <div className="card" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ marginBottom: '1rem', fontWeight: 800 }}>➕ Launch Microtask Campaign</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Funded from your available budget: <strong style={{ color: 'var(--text-main)' }}>₦{(user.balance || 0).toLocaleString()}</strong></p>

        {success && (
          <div className="auth-alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
            <CheckCircle size={18} />
            <span>Campaign created successfully! Canny is uploading it...</span>
          </div>
        )}

        {error && (
          <div className="auth-alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label htmlFor="platform">Social Platform Channel</label>
            <select 
              id="platform" 
              value={platform} 
              onChange={(e) => setPlatform(e.target.value)}
              disabled={loading || success}
            >
              <option value="Instagram">Instagram (Follow, Likes, Comments)</option>
              <option value="YouTube">YouTube (Subscribes, Likes, Watch Time)</option>
              <option value="Facebook">Facebook (Page Likes, Shares)</option>
              <option value="Twitter">X / Twitter (Retweets, Follows)</option>
              <option value="Telegram">Telegram (Channel Join, Invites)</option>
              <option value="TikTok">TikTok (Follows, Video Likes)</option>
              <option value="Surveys">Opinion Surveys (Forms, Polls)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="title">Campaign Action Title</label>
            <input 
              type="text" 
              id="title" 
              placeholder="e.g. Follow @canyuwork on Instagram" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading || success}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="guidelines">Step-by-step Earners Instructions</label>
            <textarea 
              id="guidelines" 
              rows={4}
              placeholder="Provide exact guidelines, e.g.:&#10;1. Open Instagram and search for @canyuwork.&#10;2. Click follow.&#10;3. Submit a screenshot showing you have followed."
              value={guidelines}
              onChange={(e) => setGuidelines(e.target.value)}
              disabled={loading || success}
              required
              style={{ width: '100%', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-main)', fontSize: '0.95rem', outline: 'none' }}
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="reward">Task Reward (₦ per completion)</label>
              <input 
                type="number" 
                id="reward" 
                value={rewardPerTask}
                onChange={(e) => setRewardPerTask(Math.max(1, Number(e.target.value)))}
                disabled={loading || success}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="budget">Total Campaign Budget (₦)</label>
              <input 
                type="number" 
                id="budget" 
                value={totalBudget}
                onChange={(e) => setTotalBudget(Math.max(1, Number(e.target.value)))}
                disabled={loading || success}
                required
              />
            </div>
          </div>

          {/* Calculator Card */}
          <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target Completions</span>
              <h4 style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text-main)' }}>{completionsTarget.toLocaleString()} users</h4>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Required Balance</span>
              <h4 style={{ fontWeight: 'bold', fontSize: '1.2rem', color: user.balance >= totalBudget ? '#10b981' : '#ef4444' }}>₦{totalBudget.toLocaleString()}</h4>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ padding: '0.9rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            disabled={loading || success}
          >
            {loading ? 'Launching...' : 'Deploy Task Campaign'} <Coins size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;
