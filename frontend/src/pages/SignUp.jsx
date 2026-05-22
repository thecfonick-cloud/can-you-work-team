import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { User, Mail, Lock, Phone, Globe, Gift, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
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
  const [referredBy, setReferredBy] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Extract referral code from URL search param if present (e.g. ?ref=JohnG)
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
      <div className="auth-card-wrapper signup-wrapper">
        <div className="auth-brand-logo" onClick={() => navigate('/')}>
          <div className="logo-icon">W</div>
          <span className="logo-text">CanYouWork</span>
        </div>

        <div className="auth-card">
          <div className="auth-header">
            <h2>Create Earning Account</h2>
            <p>Start earning ₦200 instant profile bonus. Complete social & survey tasks.</p>
          </div>

          {error && (
            <div className="auth-alert alert-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="fullname">Full Name</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
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
                  <User size={18} className="input-icon" />
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
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  placeholder="e.g. john@example.com"
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
                  <Globe size={18} className="input-icon" />
                  <select
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    disabled={loading}
                  >
                    {countriesList.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.flag} {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <div className="input-with-icon">
                  <Phone size={18} className="input-icon" />
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
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  id="password"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="referredBy">Referral Code (Optional)</label>
              <div className="input-with-icon">
                <Gift size={18} className="input-icon" />
                <input
                  type="text"
                  id="referredBy"
                  placeholder="Enter referral code"
                  value={referredBy}
                  onChange={(e) => setReferredBy(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up & Get ₦200'} <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-footer-link">
            Already have an account? <Link to="/login">Login here</Link>
          </div>
        </div>

        <div className="auth-terms-bar">
          <div className="flex-center gap-1 text-muted text-xs">
            <ShieldCheck size={12} /> By signing up, you agree to comply with our zero-fraud device policy.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
