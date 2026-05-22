import React, { useState, useEffect } from 'react';
import { Download, CreditCard, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Info, ShieldCheck } from 'lucide-react';
import { api } from '../api';

const Withdraw = ({ refreshUser }) => {
  const [wallet, setWallet] = useState(null);
  const [method, setMethod] = useState('PayPal');
  const [accountDetails, setAccountDetails] = useState('');
  const [amount, setAmount] = useState('');
  const [fee, setFee] = useState(0);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepChecked, setStepChecked] = useState(false);

  const EXCHANGE_RATE = 1523.0;

  const paymentMethods = [
    { name: 'PayPal', minVal: 1500, minUSD: 1.0, desc: 'Instant transfer to your PayPal email address. (₦1,500 Min)' },
    { name: 'Bank Transfer', minVal: 7500, minUSD: 5.0, desc: 'Direct deposit into Nigerian or international bank accounts. (₦7,500 Min)' },
    { name: 'USDT (TRC20)', minVal: 7500, minUSD: 5.0, desc: 'TRON network address. High speed transfer. (₦7,500 Min)' },
    { name: 'BTC (Bitcoin)', minVal: 7500, minUSD: 5.0, desc: 'Bitcoin wallet address payout. (₦7,500 Min)' },
    { name: 'Payoneer', minVal: 7500, minUSD: 5.0, desc: 'Receive payout directly into your Payoneer email balance. (₦7,500 Min)' }
  ];

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    const res = await api.getWallet();
    if (res.success) {
      setWallet(res.balances);
    }
  };

  const getActiveMethod = () => {
    return paymentMethods.find(p => p.name === method);
  };

  const activeMethod = getActiveMethod();

  const handleNextStep1 = () => {
    setMsg({ type: '', text: '' });
    setCurrentStep(2);
  };

  const handleNextStep2 = () => {
    setMsg({ type: '', text: '' });
    
    if (!accountDetails) {
      setMsg({ type: 'error', text: 'Please enter your payment recipient details.' });
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setMsg({ type: 'error', text: 'Please enter a valid payout amount.' });
      return;
    }

    const withdrawAmount = Number(amount);

    if (withdrawAmount > wallet.availableBalance) {
      setMsg({ type: 'error', text: `Insufficient balance. Available is ₦${wallet.availableBalance.toLocaleString()}` });
      return;
    }

    if (withdrawAmount < activeMethod.minVal) {
      setMsg({ type: 'error', text: `Minimum withdrawal for ${activeMethod.name} is ₦${activeMethod.minVal.toLocaleString()} ($${activeMethod.minUSD.toFixed(2)} USD)` });
      return;
    }

    setCurrentStep(3);
  };

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    setSuccess(false);

    if (!stepChecked) {
      setMsg({ type: 'error', text: 'Please check the verification checkbox to proceed.' });
      return;
    }

    const withdrawAmount = Number(amount);

    setSubmitting(true);
    const res = await api.requestWithdrawal(method, accountDetails, withdrawAmount);
    setSubmitting(false);

    if (res.success) {
      setSuccess(true);
      setMsg({ type: 'success', text: `Withdrawal request of ₦${withdrawAmount.toLocaleString()} submitted successfully.` });
      setAmount('');
      setAccountDetails('');
      setStepChecked(false);
      setCurrentStep(1);
      fetchWallet();
      if (refreshUser) refreshUser();
    } else {
      setMsg({ type: 'error', text: res.message || 'Error processing withdrawal.' });
    }
  };

  if (!wallet) {
    return <div className="loading-spinner-container">Loading Payout Gateway...</div>;
  }

  return (
    <div className="withdraw-page-view">
      
      {/* 3-Step Wizard Indicator Header */}
      <div className="withdraw-steps-indicator-card card">
        <div className="withdraw-steps-header">
          <div className={`step-node ${currentStep >= 1 ? 'active' : ''} ${currentStep === 1 ? 'current' : ''}`}>
            <span className="step-num">{currentStep > 1 ? '✓' : '1'}</span>
            <span className="step-label">Select Method</span>
          </div>
          <div className={`step-connector ${currentStep >= 2 ? 'active' : ''}`}></div>
          <div className={`step-node ${currentStep >= 2 ? 'active' : ''} ${currentStep === 2 ? 'current' : ''}`}>
            <span className="step-num">{currentStep > 2 ? '✓' : '2'}</span>
            <span className="step-label">Enter Details</span>
          </div>
          <div className={`step-connector ${currentStep >= 3 ? 'active' : ''}`}></div>
          <div className={`step-node ${currentStep >= 3 ? 'active' : ''} ${currentStep === 3 ? 'current' : ''}`}>
            <span className="step-num">3</span>
            <span className="step-label">Confirm Payout</span>
          </div>
        </div>
      </div>

      <div className="withdraw-grid-row">
        {/* Left Form Panel */}
        <div className="withdraw-form-card card">
          
          {msg.text && (
            <div className={`auth-alert alert-${msg.type}`} style={{ marginBottom: '1.5rem' }}>
              {msg.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
              <span>{msg.text}</span>
            </div>
          )}

          {currentStep === 1 && (
            <div className="step-view-content">
              <h3>Select Payout Method</h3>
              <p className="subtitle-text">Choose your preferred withdrawal processor. Minimum thresholds vary by method.</p>
              
              <div className="payout-methods-select-grid" style={{ marginTop: '1.5rem' }}>
                {paymentMethods.map((p) => (
                  <div 
                    key={p.name}
                    className={`payout-method-option ${method === p.name ? 'active' : ''}`}
                    onClick={() => setMethod(p.name)}
                  >
                    <div className="option-radio-badge">
                      {method === p.name && <div className="checked-circle-dot"></div>}
                    </div>
                    <div className="option-info">
                      <h4>{p.name}</h4>
                      <p>Min: ₦{p.minVal.toLocaleString()} (${p.minUSD.toFixed(2)} USD)</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="step-action-row" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-primary" onClick={handleNextStep1}>
                  Continue to Details <ArrowRight size={16} style={{ marginLeft: '6px' }} />
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="step-view-content">
              <h3>Enter Account & Amount</h3>
              <p className="subtitle-text">Provide recipient details and specify the withdrawal amount in Naira (₦).</p>
              
              <div className="withdraw-inputs-container" style={{ marginTop: '1.5rem' }}>
                <div className="form-group">
                  <label htmlFor="account-details">
                    {method === 'PayPal' || method === 'Payoneer' ? 'Your Registered Email Address' : 'Your Wallet Address / Bank Details'}
                  </label>
                  <input
                    type="text"
                    id="account-details"
                    placeholder={method === 'PayPal' || method === 'Payoneer' ? 'email@example.com' : 'Enter wallet/bank account info'}
                    value={accountDetails}
                    onChange={(e) => setAccountDetails(e.target.value)}
                  />
                  <span className="input-hint">{activeMethod.desc}</span>
                </div>

                <div className="form-group" style={{ marginTop: '1.25rem' }}>
                  <label htmlFor="withdraw-amount">Amount to Withdraw (₦)</label>
                  <div className="amount-input-wrapper">
                    <span className="currency-prefix">₦</span>
                    <input
                      type="number"
                      id="withdraw-amount"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    <button 
                      type="button" 
                      className="max-amount-btn"
                      onClick={() => setAmount(wallet.availableBalance.toString())}
                    >
                      MAX
                    </button>
                  </div>
                  <span className="input-hint">
                    Current Rate: ₦1,523 = $1.00 USD. Equivalent: <strong>${amount ? (Number(amount) / EXCHANGE_RATE).toFixed(2) : '0.00'} USD</strong>
                  </span>
                </div>
              </div>

              <div className="step-action-row" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setCurrentStep(1)}>
                  <ArrowLeft size={16} style={{ marginRight: '6px' }} /> Back
                </button>
                <button type="button" className="btn btn-primary" onClick={handleNextStep2}>
                  Review Payout <ArrowRight size={16} style={{ marginLeft: '6px' }} />
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="step-view-content">
              <h3>Confirm Payout Details</h3>
              <p className="subtitle-text">Please review your withdrawal request. Payouts are finalized instantly and cannot be reversed.</p>
              
              <div className="withdrawal-summary-confirmation-box" style={{ marginTop: '1.5rem' }}>
                <div className="summary-row-item">
                  <span className="summary-row-label">Method</span>
                  <span className="summary-row-value">{method}</span>
                </div>
                <div className="summary-row-item">
                  <span className="summary-row-label">Recipient</span>
                  <span className="summary-row-value recipient-highlight">{accountDetails}</span>
                </div>
                <div className="summary-row-item">
                  <span className="summary-row-label">Gross Amount</span>
                  <span className="summary-row-value">₦{Number(amount).toLocaleString()} (${(Number(amount) / EXCHANGE_RATE).toFixed(2)} USD)</span>
                </div>
                <div className="summary-row-item">
                  <span className="summary-row-label">Processor Fee</span>
                  <span className="summary-row-value">₦0.00 ($0.00 USD)</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row-item net-row">
                  <span className="summary-row-label">Net Receive Payout</span>
                  <span className="summary-row-value net-payout-val">₦{Number(amount).toLocaleString()}</span>
                </div>
              </div>

              {/* Warning box */}
              <div className="task-warning-highlight-box" style={{ marginTop: '1.5rem', borderColor: 'rgba(239, 68, 68, 0.2)', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
                <ShieldCheck size={20} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: '2px' }} />
                <div className="warning-text">
                  <strong style={{ color: 'var(--danger)' }}>Security Validation:</strong> By confirming, you acknowledge that you are the sole owner of the recipient credentials. Incorrect addresses will result in permanent loss of funds.
                </div>
              </div>

              {/* Confirmation Checkbox */}
              <div className="drawer-verification-checklist" style={{ marginTop: '1.25rem', padding: '0.85rem' }}>
                <label className="checkbox-item" style={{ cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={stepChecked}
                    onChange={(e) => setStepChecked(e.target.checked)}
                    disabled={submitting} 
                  />
                  <span style={{ fontSize: '0.8rem' }}>I verify that my payment address and credentials are correct.</span>
                </label>
              </div>

              <form onSubmit={handleWithdrawSubmit} style={{ marginTop: '2rem' }}>
                <div className="step-action-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setCurrentStep(2)} disabled={submitting}>
                    <ArrowLeft size={16} style={{ marginRight: '6px' }} /> Back
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting || !stepChecked}>
                    {submitting ? 'Processing payout...' : 'Confirm & Request Payout'} <Download size={16} style={{ marginLeft: '6px' }} />
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

        {/* Right Info Sidebar */}
        <div className="withdraw-info-sidebar">
          <div className="card balance-preview-card">
            <h4>Available Balance</h4>
            <h2>₦{wallet.availableBalance.toLocaleString()}</h2>
            <p>${(wallet.availableBalance / EXCHANGE_RATE).toFixed(2)} USD</p>
          </div>

          <div className="card info-bullet-card">
            <h4><Info size={16} className="inline-icon" /> Payout Terms</h4>
            <ul>
              <li>Withdrawals are processed by audit admins within 24 to 48 hours.</li>
              <li>Minimal thresholds: <strong>₦1,500</strong> for PayPal, <strong>₦7,500</strong> for all other channels.</li>
              <li>Conversion rates are updated dynamically. Current base is ₦1,523 = $1.00 USD.</li>
              <li>Fraudulent check-ins or fake screenshot reports will lock available balance.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
