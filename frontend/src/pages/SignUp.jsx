import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { User, Mail, Lock, Phone, Globe, Gift, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { api } from '../api';

const SignUp = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialRole = searchParams.get('role') === 'advertiser' ? 'advertiser' : 'user';

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
  const [role, setRole] = useState(initialRole);

  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setReferredBy(refCode);
    }
    const r = searchParams.get('role');
    if (r === 'advertiser' || r === 'user') {
      setRole(r);
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
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await api.register(
        fullname, 
        username, 
        email, 
        phone, 
        country, 
        password, 
        referredBy,
        role
      );
      setLoading(false);

      if (res.success) {
        onLoginSuccess(res.user);
        if (res.user.role === 'advertiser') {
          navigate('/advertiser/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (err) {
      setLoading(false);
      setError('An unexpected error occurred. Please try again.');
      console.error("Registration error:", err);
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
        <div className="auth-right-panel" style={{ padding: '2.5rem' }}>
          <div className="auth-header" style={{ marginBottom: '1.25rem' }}>
            <h2>Create Account</h2>
            <p>Select your workspace type and input details to get started.</p>
          </div>

          {/* Role Switcher Tab Switch */}
          <div className="role-switcher-container" style={{ marginBottom: '1.25rem' }}>
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
            <div className="auth-alert alert-error" style={{ marginBottom: '1rem' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} style={{ gap: '0.85rem' }}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="fullname">Full Name</label>
                <div className="input-with-icon">
                  <User size={16} className="input-icon" />
                  <input
                    type="text"
                    id="fullname"
                    placeholder="e.g. John Goodluck"
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
                    placeholder="e.g. johng"
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
                  placeholder="johng@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <div className="input-with-icon">
                  <Globe size={16} className="input-icon" />
                  <span style={{ position: 'absolute', left: '10px', fontSize: '14px', zIndex: 2, pointerEvents: 'none' }}>
                    {selectedCountryObj?.flag}
                  </span>
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
              {loading ? 'Creating Account...' : role === 'user' ? 'Sign Up & Get ₦200' : 'Register Campaign Account'} <ArrowRight size={18} style={{ marginLeft: '6px' }} />
            </button>
          </form>

          <div className="auth-footer-link" style={{ marginTop: '1.25rem', textAlign: 'center' }}>
            Already have an account? <Link to={`/login?role=${role}`} style={{ color: 'var(--primary)', fontWeight: '700' }}>Login here</Link>
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
