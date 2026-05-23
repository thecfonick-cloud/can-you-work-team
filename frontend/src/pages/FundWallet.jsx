import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coins, CheckCircle, ArrowLeft, CreditCard, Building, ShieldCheck } from 'lucide-react';
import { api } from '../api';

const FundWallet = ({ user, refreshUser }) => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(10000);
  const [method, setMethod] = useState('bank');
  
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (amount < 1000) {
      setError('Minimum deposit is ₦1,000');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await api.depositFunds(amount);
      setLoading(false);
      if (res.success) {
        setSuccess(true);
        refreshUser();
        setTimeout(() => {
          navigate('/advertiser/dashboard');
        }, 1500);
      } else {
        setError(res.message || 'Deposit failed');
      }
    } catch (err) {
      setLoading(false);
      setError('An error occurred during payment processing');
      console.error(err);
    }
  };

  return (
    <div className="fund-wallet-container" style={{ maxWidth: '650px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate('/advertiser/dashboard')} 
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', marginBottom: '1.5rem', fontWeight: 600 }}
      >
        <ArrowLeft size={16} /> Back to Workspace
      </button>

      <div className="card" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ marginBottom: '0.5rem', fontWeight: 800 }}>💳 Fund Campaign Budget</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Current Budget Balance: <strong style={{ color: 'var(--text-main)' }}>₦{(user.balance || 0).toLocaleString()}</strong></p>

        {success && (
          <div className="auth-alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <CheckCircle size={18} />
            <span>₦{amount.toLocaleString()} deposited successfully! Canny is updating your budget...</span>
          </div>
        )}

        {error && (
          <div className="auth-alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleDeposit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Amount Inputs */}
          <div className="form-group">
            <label htmlFor="amount">Funding Amount (₦)</label>
            <input 
              type="number" 
              id="amount" 
              value={amount}
              onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
              disabled={loading || success}
              required
              style={{ fontSize: '1.25rem', fontWeight: 'bold' }}
            />
            {/* Quick selectors */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              {[5000, 10000, 20000, 50000].map(val => (
                <button
                  type="button"
                  key={val}
                  className="btn btn-outline btn-sm"
                  onClick={() => setAmount(val)}
                  style={{ flex: 1, padding: '0.35rem' }}
                >
                  ₦{val.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method Switcher */}
          <div className="form-group">
            <label>Select Deposit Method</label>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <div 
                onClick={() => setMethod('bank')}
                style={{
                  flex: 1,
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${method === 'bank' ? 'var(--primary)' : 'var(--border-color)'}`,
                  background: method === 'bank' ? 'var(--primary-light)' : 'var(--bg-app)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <Building size={20} style={{ color: method === 'bank' ? 'var(--primary)' : 'var(--text-light)' }} />
                <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Bank Transfer</span>
              </div>

              <div 
                onClick={() => setMethod('card')}
                style={{
                  flex: 1,
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${method === 'card' ? 'var(--primary)' : 'var(--border-color)'}`,
                  background: method === 'card' ? 'var(--primary-light)' : 'var(--bg-app)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <CreditCard size={20} style={{ color: method === 'card' ? 'var(--primary)' : 'var(--text-light)' }} />
                <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Debit Card</span>
              </div>
            </div>
          </div>

          {/* Dynamic Payment Form Panels */}
          {method === 'bank' ? (
            <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h4 style={{ fontWeight: 'bold', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>🏦 Mock Account Details</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Bank Name</span>
                <strong>Wema Bank PLC</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Account Number</span>
                <strong>0123456789</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Account Name</span>
                <strong>CanYouWork Social Ads</strong>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', display: 'flex', gap: '4px', alignItems: 'center' }}>
                ℹ️ Transfer the exact amount above to this mock account. Clicking confirm will credit your budget.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontWeight: 'bold', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>💳 Mock Card Checkout</h4>
              
              <div className="form-group">
                <label>Card Number</label>
                <input 
                  type="text" 
                  placeholder="5399 2300 4567 8901" 
                  value={cardNumber} 
                  onChange={(e) => setCardNumber(e.target.value)}
                  disabled={loading || success}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input 
                    type="text" 
                    placeholder="12/28" 
                    value={cardExpiry} 
                    onChange={(e) => setCardExpiry(e.target.value)}
                    disabled={loading || success}
                  />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input 
                    type="password" 
                    placeholder="***" 
                    value={cardCvv} 
                    onChange={(e) => setCardCvv(e.target.value)}
                    disabled={loading || success}
                  />
                </div>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ padding: '0.9rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            disabled={loading || success}
          >
            {loading ? 'Processing...' : method === 'bank' ? 'Confirm Transfer Payment' : `Pay ₦${amount.toLocaleString()}`} <Coins size={18} />
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.75rem', color: '#64748b', marginTop: '1.5rem' }}>
          <ShieldCheck size={14} style={{ color: '#10b981' }} />
          <span>Secured sandbox deposit terminal (No real funds required).</span>
        </div>
      </div>
    </div>
  );
};

export default FundWallet;
