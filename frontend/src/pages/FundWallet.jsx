import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coins, CheckCircle, ArrowLeft, QrCode, Copy, Check, ShieldCheck, Upload, Image as ImageIcon } from 'lucide-react';
import { api } from '../api';

const FundWallet = ({ user, refreshUser }) => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(10000);
  const [txHash, setTxHash] = useState('');
  const [receipt, setReceipt] = useState('');
  const [receiptPreview, setReceiptPreview] = useState('');
  const [copied, setCopied] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setError('Image file is too large. Please upload a receipt under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceipt(reader.result);
        setReceiptPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (amount < 1000) {
      setError('Minimum deposit is ₦1,000');
      window.dispatchEvent(new CustomEvent('mascot-set-emotion', { detail: { newEmotion: 'warning', duration: 4000 } }));
      return;
    }
    if (!txHash) {
      setError('Please provide the USDT ERC20 transaction hash or Reference ID.');
      window.dispatchEvent(new CustomEvent('mascot-set-emotion', { detail: { newEmotion: 'warning', duration: 4000 } }));
      return;
    }
    if (!receipt) {
      setError('Please upload your transaction screenshot or payment receipt.');
      window.dispatchEvent(new CustomEvent('mascot-set-emotion', { detail: { newEmotion: 'warning', duration: 4000 } }));
      return;
    }
    setError('');
    setLoading(true);
    window.dispatchEvent(new CustomEvent('mascot-set-emotion', { detail: { newEmotion: 'thinking', duration: 15000 } }));

    try {
      const res = await api.depositFunds(amount, txHash, receipt);
      setLoading(false);
      if (res.success) {
        setSuccess(true);
        refreshUser();
        setTimeout(() => {
          navigate('/advertiser/dashboard');
        }, 2000);
      } else {
        setError(res.message || 'Deposit failed');
        window.dispatchEvent(new CustomEvent('mascot-set-emotion', { detail: { newEmotion: 'warning', duration: 5000 } }));
      }
    } catch (err) {
      setLoading(false);
      setError('An error occurred during payment processing');
      window.dispatchEvent(new CustomEvent('mascot-set-emotion', { detail: { newEmotion: 'warning', duration: 5000 } }));
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
        <h2 style={{ marginBottom: '0.5rem', fontWeight: 800 }}>💳 Fund Campaign Budget via USDT</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Current Budget Balance: <strong style={{ color: 'var(--text-main)' }}>₦{(user.balance || 0).toLocaleString()}</strong></p>

        {success && (
          <div className="auth-alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <CheckCircle size={18} />
            <span>Deposit submitted! Please wait for admin approval to fund ₦{amount.toLocaleString()}.</span>
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

          {/* Crypto USDT ERC20 Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontWeight: 'bold', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>🪙 USDT (ERC20) Wallet</h4>

            <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', color: '#b45309', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: 600 }}>
              ⚠️ Only send Tether USD (USDT-ERC20) assets. Other networks/assets will result in permanent loss.
            </div>

            {/* Clean Cropped QR Code */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '0.25rem 0' }}>
              <div style={{ padding: '0.5rem', background: '#ffffff', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                <img 
                  src="/crypto_qr.jpg" 
                  alt="USDT ERC20 Deposit QR" 
                  style={{ width: '160px', height: '160px', objectFit: 'contain', display: 'block' }}
                />
              </div>
            </div>

            {/* Deposit Address */}
            <div className="form-group">
              <label>USDT ERC20 Deposit Address</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                <input 
                  type="text" 
                  readOnly
                  value="0xD5a1a4981cE444C4b0969A966088d7179A12C78D"
                  style={{ flexGrow: 1, fontFamily: 'monospace', fontSize: '0.8rem', padding: '0.65rem 0.85rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}
                />
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ padding: '0 0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={() => {
                    navigator.clipboard.writeText("0xD5a1a4981cE444C4b0969A966088d7179A12C78D");
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                >
                  {copied ? <Check size={16} style={{ color: '#10b981' }} /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            {/* Transaction Hash */}
            <div className="form-group">
              <label htmlFor="txHash">Transaction Hash (TxID / Reference ID)</label>
              <input 
                type="text" 
                id="txHash"
                placeholder="e.g. 0x8a92f7...3bcf1e or Reference ID" 
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                disabled={loading || success}
                required
              />
            </div>

            {/* Screenshot/Receipt Uploader */}
            <div className="form-group">
              <label>Upload Payment Receipt / Screenshot</label>
              <div style={{
                marginTop: '0.25rem',
                border: '2px dashed var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                textAlign: 'center',
                background: 'var(--bg-card)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'border-color 0.2s ease'
              }}>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                  disabled={loading || success}
                />
                
                {receiptPreview ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <img 
                      src={receiptPreview} 
                      alt="Uploaded receipt preview" 
                      style={{ maxHeight: '150px', maxWidth: '100%', borderRadius: 'var(--radius-sm)', objectFit: 'contain' }}
                    />
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold' }}>Change Image</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                    <Upload size={24} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Click to upload screenshot</span>
                    <span style={{ fontSize: '0.7rem' }}>Supports PNG, JPG, JPEG (Max 2MB)</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ padding: '0.9rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            disabled={loading || success}
          >
            {loading ? 'Submitting...' : 'Confirm Crypto Deposit'} <Coins size={18} />
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.75rem', color: '#64748b', marginTop: '1.5rem' }}>
          <ShieldCheck size={14} style={{ color: '#10b981' }} />
          <span>Secured deposit sandbox. Verified transactions will fund your wallet instantly.</span>
        </div>
      </div>
    </div>
  );
};

export default FundWallet;
