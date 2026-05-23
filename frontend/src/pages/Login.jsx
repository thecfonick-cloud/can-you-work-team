import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff, BarChart3, Target, CheckSquare, Coins } from 'lucide-react';
import { api } from '../api';

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialRole = queryParams.get('role') === 'advertiser' ? 'advertiser' : 'user';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(initialRole);

  useEffect(() => {
    const r = queryParams.get('role');
    if (r === 'advertiser' || r === 'user') {
      setRole(r);
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email/username and password');
      return;
    }
    setError('');
    setLoading(true);

    let fingerprint = localStorage.getItem('canyuwork_fingerprint');
    if (!fingerprint) {
      fingerprint = 'fp_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('canyuwork_fingerprint', fingerprint);
    }

    try {
      const res = await api.login(email, password, role);
      setLoading(false);

      if (res.success) {
        if (role === 'advertiser' && res.user.role !== 'advertiser') {
          setError('This account is registered as an Earner. Please switch to the Earn Cash tab or register a new Advertiser account.');
          setLoading(false);
          return;
        }
        if (role === 'user' && res.user.role !== 'user') {
          setError('This account is registered as an Advertiser. Please switch to the Run Ads tab.');
          setLoading(false);
          return;
        }

        onLoginSuccess(res.user);
        if (res.user.role === 'advertiser') {
          navigate('/advertiser/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err) {
      setLoading(false);
      setError('An unexpected error occurred. Please try again.');
      console.error("Login error:", err);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-split-wrapper">
        {/* Left Panel */}
        <div className="auth-left-panel">
          <div className="auth-brand-logo" onClick={() => navigate('/')}>
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </div>
            <span className="logo-text">
              CanYou<span style={{ color: '#8b5cf6' }}>Work</span>
            </span>
          </div>

          {role === 'user' ? (
            <div className="auth-left-content">
              <h2>Start Your Earning Journey Today</h2>
              <p className="auth-left-desc">Join our network of micro-earners and complete simple tasks to earn daily pocket money.</p>
              
              <div className="auth-mockup-graphic">
                <div className="graphic-circle outer"></div>
                <div className="graphic-circle inner"></div>
                <div className="graphic-floating-card one">
                  <span>🎉 +₦200 Signup Bonus</span>
                </div>
                <div className="graphic-floating-card two">
                  <span>🔥 5 Day Check-in Streak</span>
                </div>
                <div className="graphic-floating-card three">
                  <span>💰 Balance: ₦2,450.00</span>
                </div>
              </div>

              <ul className="auth-feature-list">
                <li>
                  <span className="check-icon">✓</span>
                  <span>Earn ₦200 instant registration bonus</span>
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  <span>Over 100+ new microtasks daily</span>
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  <span>Instant payouts directly to your local bank</span>
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  <span>10% referral commission for life</span>
                </li>
              </ul>
            </div>
          ) : (
            <div className="auth-left-content">
              <h2>Deploy Campaigns & Grow Your Brand</h2>
              <p className="auth-left-desc">Reach thousands of active, real-human social earners. Run high-converting social follows, likes, and survey microtasks.</p>
              
              <div className="auth-mockup-graphic advertiser-graphic">
                <div className="graphic-circle outer" style={{ borderColor: 'rgba(139, 92, 246, 0.2)' }}></div>
                <div className="graphic-circle inner" style={{ borderColor: 'rgba(139, 92, 246, 0.4)' }}></div>
                <div className="graphic-floating-card one" style={{ background: 'rgba(15, 23, 42, 0.8)' }}>
                  <span>📊 98.4% Task Approve Rate</span>
                </div>
                <div className="graphic-floating-card two" style={{ background: 'rgba(15, 23, 42, 0.8)' }}>
                  <span>🚀 100% Genuine User Traffic</span>
                </div>
                <div className="graphic-floating-card three" style={{ background: 'rgba(15, 23, 42, 0.8)' }}>
                  <span>💳 Funding: ₦50,000.00</span>
                </div>
              </div>

              <ul className="auth-feature-list">
                <li>
                  <span className="check-icon">✓</span>
                  <span>Verify proofs offline before approving rewards</span>
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  <span>Zero bots or VPN/proxy traffic (real IP checking)</span>
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  <span>Flexible rewards per task setting</span>
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  <span>Mock-fund campaigns in Naira instantly</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="auth-right-panel">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Log in to access your microtask workspace and manage your tasks.</p>
          </div>

          {/* Role Switcher Tab Switch */}
          <div className="role-switcher-container">
            <button
              type="button"
              className={`role-tab ${role === 'user' ? 'active' : ''}`}
              onClick={() => setRole('user')}
            >
              Earn Cash (Earner)
            </button>
            <button
              type="button"
              className={`role-tab ${role === 'advertiser' ? 'active' : ''}`}
              onClick={() => setRole('advertiser')}
            >
              Run Ads (Advertiser)
            </button>
          </div>

          {error && (
            <div className="auth-alert alert-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email or Username</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="text"
                  id="email"
                  placeholder="e.g. johng@example.com or johng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <div className="label-row">
                <label htmlFor="password">Password</label>
                <a href="#forgot" className="forgot-password-link">Forgot password?</a>
              </div>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="eye-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary auth-submit-btn" style={{ padding: '0.85rem' }} disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'} <ArrowRight size={18} style={{ marginLeft: '6px' }} />
            </button>
          </form>

          <div className="auth-footer-link" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            Don't have an account? <Link to={`/register?role=${role}`} style={{ color: 'var(--primary)', fontWeight: '700' }}>Sign up here</Link>
          </div>

          <div className="auth-terms-bar" style={{ marginTop: '2rem' }}>
            <div className="flex-center gap-1 text-muted text-xs" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '0.75rem', color: '#64748b' }}>
              <ShieldCheck size={14} /> Secure login with device tracking & verification protection.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
