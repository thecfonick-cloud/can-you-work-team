import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Coins, CheckCircle, AlertTriangle, ArrowLeft, ArrowRight, QrCode, Copy } from 'lucide-react';
import { api } from '../api';

const CreateCampaign = ({ user, refreshUser }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState(searchParams.get('platform') || 'Instagram');
  const [socialLink, setSocialLink] = useState('');
  const [guidelines, setGuidelines] = useState('');
  const [targetQuantity, setTargetQuantity] = useState(10);
  const [referenceNumber, setReferenceNumber] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const totalCost = targetQuantity * 8;
  const cryptoAddress = "0x089Bd2586F2148D5cC2DADf26c80a3B017aB6E24";

  useEffect(() => {
    const plat = searchParams.get('platform');
    if (plat) {
      setTimeout(() => setPlatform(plat), 0);
    }
  }, [searchParams]);

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!title || !guidelines || !socialLink) {
      setError('Please fill in all campaign details.');
      return;
    }
    if (targetQuantity < 10 || targetQuantity > 999) {
      setError('Target quantity must be between 10 and 999.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!referenceNumber) {
      setError('Please provide the transaction reference number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.createCampaign(title, platform, socialLink, guidelines, targetQuantity, referenceNumber, totalCost);
      setLoading(false);
      
      if (res.success) {
        setSuccess(true);
        refreshUser();
        setTimeout(() => {
          navigate('/advertiser/manage-campaigns');
        }, 1500);
      } else {
        setError(res.message || 'Failed to submit campaign');
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
        onClick={() => step === 2 ? setStep(1) : navigate('/advertiser/dashboard')} 
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', marginBottom: '1.5rem', fontWeight: 600 }}
      >
        <ArrowLeft size={16} /> {step === 2 ? 'Back to Details' : 'Back to Workspace'}
      </button>

      <div className="card" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ marginBottom: '1rem', fontWeight: 800 }}>➕ Launch Microtask Campaign</h2>
        
        {success && (
          <div className="auth-alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
            <CheckCircle size={18} />
            <span>Campaign created and pending admin verification!</span>
          </div>
        )}

        {error && (
          <div className="auth-alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleNextStep} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label htmlFor="platform">Social Platform Channel</label>
              <select 
                id="platform" 
                value={platform} 
                onChange={(e) => setPlatform(e.target.value)}
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
              <label htmlFor="socialLink">Social Media Link / URL</label>
              <input 
                type="url" 
                id="socialLink" 
                placeholder="https://instagram.com/canyuwork" 
                value={socialLink}
                onChange={(e) => setSocialLink(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="title">Campaign Action Title</label>
              <input 
                type="text" 
                id="title" 
                placeholder="e.g. Follow @canyuwork on Instagram" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="guidelines">Step-by-step Earners Instructions</label>
              <textarea 
                id="guidelines" 
                rows={4}
                placeholder="Provide exact guidelines..."
                value={guidelines}
                onChange={(e) => setGuidelines(e.target.value)}
                required
                style={{ width: '100%', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-main)', fontSize: '0.95rem', outline: 'none' }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Target Quantity (10 - 999)</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input 
                  type="range" 
                  min="10" 
                  max="999" 
                  value={targetQuantity}
                  onChange={(e) => setTargetQuantity(Number(e.target.value))}
                  style={{ flex: 1 }}
                />
                <input 
                  type="number" 
                  id="quantity" 
                  min="10" 
                  max="999"
                  value={targetQuantity}
                  onChange={(e) => setTargetQuantity(Math.max(10, Math.min(999, Number(e.target.value))))}
                  required
                  style={{ width: '100px' }}
                />
              </div>
              <small style={{ color: 'var(--text-muted)' }}>Each action costs exactly ₦8.</small>
            </div>

            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target Completions</span>
                <h4 style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text-main)' }}>{targetQuantity} users</h4>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Cost</span>
                <h4 style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#10b981' }}>₦{totalCost.toLocaleString()}</h4>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '0.9rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              Proceed to Payment <ArrowRight size={18} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ textAlign: 'center', background: 'var(--bg-app)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <img 
                src="/qr.png" 
                alt="USDT (ERC20) QR Code" 
                style={{ margin: '0 auto 1rem', display: 'block', borderRadius: 'var(--radius-sm)', maxWidth: '150px' }} 
              />
              <h3 style={{ marginBottom: '0.5rem' }}>Payment Required: ₦{totalCost.toLocaleString()}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Please send exactly <strong>₦{totalCost.toLocaleString()}</strong> equivalent in USDT (ERC20) to the address below.
              </p>
              
              <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px dashed var(--border-color)' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', wordBreak: 'break-all', textAlign: 'left', flex: 1, marginRight: '1rem' }}>
                  {cryptoAddress}
                </span>
                <button type="button" onClick={() => navigator.clipboard.writeText(cryptoAddress)} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Copy size={14} /> Copy
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="refNum">Transaction Reference Number / TXID</label>
              <input 
                type="text" 
                id="refNum" 
                placeholder="Enter your transaction hash or reference" 
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                disabled={loading || success}
                required
              />
              <small style={{ color: 'var(--text-muted)' }}>Admin will verify this payment before activating your campaign.</small>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ padding: '0.9rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              disabled={loading || success}
            >
              {loading ? 'Submitting...' : 'Confirm Payment & Submit Campaign'} <CheckCircle size={18} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateCampaign;
