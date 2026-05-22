import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { User, Mail, Lock, Phone, Globe, Gift, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { api } from '../api';

const SignUp = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [referredBy, setReferredBy] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setReferredBy(refCode);
    }
  }, [searchParams]);

  const countriesList = [
    { name: 'Nigeria', flag: '🇳🇬', code: '+234' },
    { name: 'South Africa', flag: '🇿🇦', code: '+27' },
    { name: 'Kenya', flag: '🇰🇪', code: '+254' },
    { name: 'Ghana', flag: '🇬🇭', code: '+233' },
    { name: 'Egypt', flag: '🇪🇬', code: '+20' },
    { name: 'United States', flag: '🇺🇸', code: '+1' },
    { name: 'United Kingdom', flag: '🇬🇧', code: '+44' }
  ];

  const selectedCountryObj = countriesList.find(c => c.name === country) || countriesList[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullname || !username || !email || !phone || !password) {
      setError('Please fill all required fields');
      return;
    }
    setError('');
    setLoading(true);

    const res = await api.register(
      fullname, 
      username, 
      email, 
      phone, 
      country, 
      password, 
      referredBy
    );
    setLoading(false);

    if (res.success) {
      onLoginSuccess(res.user);
      navigate('/dashboard');
    } else {
      setError(res.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-split-wrapper" style={{ maxWidth: '1100px' }}>
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
        </div>

        {/* Right Panel */}
        <div className="auth-right-panel" style={{ padding: '2.5rem' }}>
          <div className="auth-header" style={{ marginBottom: '1.5rem' }}>
            <h2>Create Earning Account</h2>
            <p>Start earning ₦200 instant profile bonus. Complete social & survey tasks.</p>
          </div>

          {error && (
            <div className="auth-alert alert-error" style={{ marginBottom: '1rem' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} style={{ gap: '0.85rem' }}>
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label htmlFor="fullname">Full Name</label>
                <div className="input-with-icon">
                  <User size={16} className="input-icon" />
                  <input
                    type="text"
                    id="fullname"
                    placeholder="John Goodluck"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="username">Username</label>
                <div className="input-with-icon">
                  <User size={16} className="input-icon" />
                  <input
                    type="text"
                    id="username"
                    placeholder="johng"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <div className="input-with-icon">
                  <span className="country-flag-icon">{selectedCountryObj.flag}</span>
                  <select
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    disabled={loading}
                    style={{ paddingLeft: '2.25rem' }}
                  >
                    {countriesList.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <div className="input-with-icon">
                  <Phone size={16} className="input-icon" />
                  <input
                    type="tel"
                    id="phone"
                    placeholder="8012345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="eye-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="referredBy">Referral Code (Optional)</label>
              <div className="input-with-icon">
                <Gift size={16} className="input-icon" />
                <input
                  type="text"
                  id="referredBy"
                  placeholder="e.g. admin"
                  value={referredBy}
                  onChange={(e) => setReferredBy(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary auth-submit-btn" style={{ padding: '0.8rem', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up & Get ₦200'} <ArrowRight size={18} style={{ marginLeft: '6px' }} />
            </button>
          </form>

          <div className="auth-footer-link" style={{ marginTop: '1.25rem', textAlign: 'center' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700' }}>Login here</Link>
          </div>

          <div className="auth-terms-bar" style={{ marginTop: '1.5rem' }}>
            <div className="flex-center gap-1 text-muted text-xs" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '0.75rem', color: '#64748b' }}>
              <ShieldCheck size={14} /> By signing up, you agree to comply with our zero-fraud device policy.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
