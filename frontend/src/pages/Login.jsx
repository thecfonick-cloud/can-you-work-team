import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { api } from '../api';

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email/username and password');
      return;
    }
    setError('');
    setLoading(true);

    // Save mock/real device fingerprint
    let fingerprint = localStorage.getItem('canyuwork_fingerprint');
    if (!fingerprint) {
      fingerprint = 'fp_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('canyuwork_fingerprint', fingerprint);
    }

    const res = await api.login(email, password);
    setLoading(false);

    if (res.success) {
      onLoginSuccess(res.user);
      navigate('/dashboard');
    } else {
      setError(res.message || 'Login failed');
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card-wrapper">
        <div className="auth-brand-logo" onClick={() => navigate('/')}>
          <div className="logo-icon">W</div>
          <span className="logo-text">CanYouWork</span>
        </div>

        <div className="auth-card">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Log in to access your microtask dashboard and continue earning.</p>
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
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'} <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-footer-link">
            Don't have an account? <Link to="/register">Sign up here</Link>
          </div>
        </div>

        <div className="auth-terms-bar">
          <div className="flex-center gap-1 text-muted text-xs">
            <ShieldCheck size={12} /> Secure login with device tracking & verification protection.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
