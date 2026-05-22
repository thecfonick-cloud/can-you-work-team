import React, { useState, useEffect } from 'react';
import { Download, CreditCard, ArrowRight, CheckCircle2, AlertCircle, Info } from 'lucide-react';
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

  const EXCHANGE_RATE = 1523.0;

  const paymentMethods = [
    { name: 'PayPal', minVal: 1500, minUSD: 1.0, desc: 'Instant transfer to your PayPal email address.' },
    { name: 'Bank Transfer', minVal: 7500, minUSD: 5.0, desc: 'Direct deposit into Nigerian or international bank accounts.' },
    { name: 'USDT (TRC20)', minVal: 7500, minUSD: 5.0, desc: 'TRON network address. Payout calculated at current market rates.' },
    { name: 'BTC (Bitcoin)', minVal: 7500, minUSD: 5.0, desc: 'Bitcoin wallet address payout.' },
    { name: 'Payoneer', minVal: 7500, minUSD: 5.0, desc: 'Receive payout directly into your Payoneer balance.' }
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

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    setSuccess(false);

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setMsg({ type: 'error', text: 'Please enter a valid positive payout amount.' });
      return;
    }

    const withdrawAmount = Number(amount);

    if (withdrawAmount > wallet.availableBalance) {
      setMsg({ type: 'error', text: `Insufficient balance. Your available balance is ₦${wallet.availableBalance.toLocaleString()}` });
      return;
    }

    if (withdrawAmount < activeMethod.minVal) {
      setMsg({ type: 'error', text: `Minimum withdrawal for ${activeMethod.name} is ₦${activeMethod.minVal.toLocaleString()} ($${activeMethod.minUSD.toFixed(2)} USD)` });
      return;
    }

    if (!accountDetails) {
      setMsg({ type: 'error', text: 'Please enter your payment account transfer details.' });
      return;
    }

    setSubmitting(true);
    const res = await api.requestWithdrawal(method, accountDetails, withdrawAmount);
    setSubmitting(false);

    if (res.success) {
      setSuccess(true);
      setMsg({ type: 'success', text: `Withdrawal request of ₦${withdrawAmount.toLocaleString()} submitted successfully.` });
      setAmount('');
      setAccountDetails('');
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
      <div className="withdraw-grid-row">
        {/* Left Form Panel */}
        <div className="withdraw-form-card card">
          <h3>Request Payout</h3>
          <p className="subtitle-text">Select your preferred payout gateway and specify the amount you want to withdraw.</p>

          {msg.text && (
            <div className={`auth-alert alert-${msg.type}`}>
              {msg.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
              <span>{msg.text}</span>
            </div>
          )}

          <form className="withdraw-form" onSubmit={handleWithdrawSubmit}>
            <div className="form-group">
              <label>Select Payout Method</label>
              <div className="payout-methods-select-grid">
                {paymentMethods.map((p) => (
                  <div 
                    key={p.name}
                    className={`payout-method-option ${method === p.name ? 'active' : ''}`}
                    onClick={() => {
                      setMethod(p.name);
                      setMsg({ type: '', text: '' });
                    }}
                  >
                    <div className="option-radio"></div>
                    <div className="option-info">
                      <h4>{p.name}</h4>
                      <p>Min: ₦{p.minVal.toLocaleString()} (${p.minUSD.toFixed(2)})</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="account-details">
                {method === 'PayPal' || method === 'Payoneer' ? 'Email Address' : 'Account/Wallet Address'}
              </label>
              <input
                type="text"
                id="account-details"
                placeholder={method === 'PayPal' || method === 'Payoneer' ? 'email@example.com' : 'Enter wallet/bank account number'}
                value={accountDetails}
                onChange={(e) => setAccountDetails(e.target.value)}
                disabled={submitting}
              />
              <span className="input-hint">{activeMethod.desc}</span>
            </div>

            <div className="form-group">
              <label htmlFor="withdraw-amount">Amount to Withdraw (₦)</label>
              <div className="amount-input-wrapper">
                <span className="currency-prefix">₦</span>
                <input
                  type="number"
                  id="withdraw-amount"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={submitting}
                />
                <button 
                  type="button" 
                  className="max-amount-btn"
                  onClick={() => setAmount(wallet.availableBalance)}
                  disabled={submitting}
                >
                  MAX
                </button>
              </div>
              <span className="input-hint">
                Equivalent: ${amount ? (Number(amount) / EXCHANGE_RATE).toFixed(2) : '0.00'} USD
              </span>
            </div>

            <div className="withdraw-summary-footer">
              <div className="summary-item">
                <span>Fee</span>
                <span>₦{fee} ($0.00)</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-item total">
                <span>Net Payout</span>
                <span>₦{amount ? Number(amount).toLocaleString() : '0'}</span>
              </div>
            </div>

            <button type="submit" className="btn btn-primary withdraw-submit-btn w-full" disabled={submitting}>
              {submitting ? 'Processing request...' : 'Confirm Withdrawal'} <ArrowRight size={16} />
            </button>
          </form>
        </div>

        {/* Right Info Sidebar */}
        <div className="withdraw-info-sidebar">
          <div className="card balance-preview-card">
            <h4>Available Balance</h4>
            <h2>₦{wallet.availableBalance.toLocaleString()}</h2>
            <p>${(wallet.availableBalance / EXCHANGE_RATE).toFixed(2)} USD</p>
          </div>

          <div className="card info-bullet-card">
            <h4><Info size={16} className="inline-icon" /> Withdrawal Guidelines</h4>
            <ul>
              <li>All withdrawals are processed manually within 24 to 48 hours.</li>
              <li>Please confirm your payout details before submitting. Transfers cannot be reversed.</li>
              <li>Fees are <strong>₦0.00</strong> across all payment gateways.</li>
              <li>Multiple accounts linked to the same payout address will be auto-flagged for fraud.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
