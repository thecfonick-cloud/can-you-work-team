import { useState } from 'react';
import { Shield, Lock, AlertCircle } from 'lucide-react';
import { adminApi } from '../api';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const res = adminApi.login(email, password);
    setLoading(false);
    
    if (res.success) {
      onLoginSuccess(res.user);
    } else {
      setError(res.message || 'Access denied');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card animate-fade-in">
        <div className="auth-logo">
          <Shield size={48} className="text-cyan" />
          <h1>Admin Alexa</h1>
          <p className="text-muted">Control Cockpit Access</p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Admin Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="admin@canyuwork.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            <Lock size={16} />
            {loading ? 'Authenticating...' : 'Access Control Center'}
          </button>
        </form>

        <p className="auth-hint text-muted">
          Default: admin@canyuwork.com / admin123
        </p>
      </div>
    </div>
  );
};

export default Login;
