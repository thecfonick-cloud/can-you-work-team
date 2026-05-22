import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Download, 
  Clock, 
  CheckCircle2, 
  XCircle,
  HelpCircle,
  CreditCard
} from 'lucide-react';
import { api } from '../api';

const Wallet = () => {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [historyTab, setHistoryTab] = useState('transactions');

  useEffect(() => {
    fetchWalletDetails();
    fetchTransactions();
    fetchWithdrawals();
  }, []);

  const fetchWalletDetails = async () => {
    const res = await api.getWallet();
    if (res.success) {
      setWallet(res.balances);
    }
  };

  const fetchTransactions = async () => {
    const res = await api.getTransactions();
    if (res.success) {
      setTransactions(res.transactions);
    }
  };

  const fetchWithdrawals = async () => {
    const res = await api.getWithdrawalHistory();
    if (res.success) {
      setWithdrawals(res.withdrawals);
    }
  };

  if (!wallet) {
    return <div className="loading-spinner-container">Loading Wallet Details...</div>;
  }

  const getTransactionIcon = (type) => {
    if (type === 'withdrawal') {
      return <ArrowUpRight className="tx-icon text-danger" size={18} />;
    }
    return <ArrowDownLeft className="tx-icon text-success" size={18} />;
  };

  return (
    <div className="wallet-view-container">
      {/* Balances summary row */}
      <div className="wallet-balances-summary-grid">
        <div className="card balance-summary-card available">
          <div className="card-top-icon">
            <CreditCard size={20} />
          </div>
          <span className="balance-label">Available Balance</span>
          <h2>₦{wallet.availableBalance.toLocaleString()}</h2>
          <span className="balance-sub">${wallet.availableBalanceUSD.toFixed(2)} USD</span>
          <button className="btn btn-primary withdraw-cta-btn" onClick={() => navigate('/withdraw')}>
            Withdraw Funds <Download size={14} />
          </button>
        </div>

        <div className="card balance-summary-card pending">
          <div className="card-top-icon">
            <Clock size={20} />
          </div>
          <span className="balance-label">Pending Reviews</span>
          <h2>₦{wallet.pendingBalance.toLocaleString()}</h2>
          <span className="balance-sub">${wallet.pendingBalanceUSD.toFixed(2)} USD</span>
          <p className="pending-hint-text">Will credit once verified by admin.</p>
        </div>

        <div className="card balance-summary-card total-earned">
          <div className="card-top-icon">
            <TrendingUp size={20} />
          </div>
          <span className="balance-label">Total Earnings</span>
          <h2>₦{wallet.totalEarned.toLocaleString()}</h2>
          <span className="balance-sub">${wallet.totalEarnedUSD.toFixed(2)} USD</span>
          <p className="pending-hint-text">All-time reward payouts.</p>
        </div>

        <div className="card balance-summary-card withdrawn">
          <div className="card-top-icon">
            <CheckCircle2 size={20} />
          </div>
          <span className="balance-label">Total Withdrawn</span>
          <h2>₦{wallet.totalWithdrawn.toLocaleString()}</h2>
          <span className="balance-sub">${wallet.totalWithdrawnUSD.toFixed(2)} USD</span>
          <p className="pending-hint-text">Successful payout transfers.</p>
        </div>
      </div>

      {/* History logs card */}
      <div className="wallet-history-card card">
        <div className="history-header">
          <div className="history-tabs">
            <button 
              className={`history-tab-btn ${historyTab === 'transactions' ? 'active' : ''}`}
              onClick={() => setHistoryTab('transactions')}
            >
              Transaction Ledger
            </button>
            <button 
              className={`history-tab-btn ${historyTab === 'withdrawals' ? 'active' : ''}`}
              onClick={() => setHistoryTab('withdrawals')}
            >
              Withdrawal Logs
            </button>
          </div>
        </div>

        {historyTab === 'transactions' ? (
          transactions.length === 0 ? (
            <div className="empty-history-placeholder">
              <HelpCircle size={40} className="text-muted" />
              <h4>No transactions recorded</h4>
              <p>Your ledger is currently empty. Complete tasks to earn.</p>
            </div>
          ) : (
            <div className="history-table-wrapper">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx._id}>
                      <td className="tx-type-cell">
                        {getTransactionIcon(tx.type)}
                        <span>{tx.type.replace('_', ' ').toUpperCase()}</span>
                      </td>
                      <td>{tx.description}</td>
                      <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                      <td className={`tx-amount-cell ${tx.amount < 0 ? 'text-danger' : 'text-success'}`}>
                        {tx.amount < 0 ? '-' : '+'}₦{Math.abs(tx.amount).toLocaleString()}
                      </td>
                      <td>
                        <span className={`status-pill ${tx.status.toLowerCase()}`}>
                          {tx.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          withdrawals.length === 0 ? (
            <div className="empty-history-placeholder">
              <HelpCircle size={40} className="text-muted" />
              <h4>No withdrawals requested</h4>
              <p>You haven't requested any payouts yet.</p>
            </div>
          ) : (
            <div className="history-table-wrapper">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Payment Method</th>
                    <th>Recipient Details</th>
                    <th>Request Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map((w) => (
                    <tr key={w._id}>
                      <td className="w-method-cell">
                        <strong>{w.method}</strong>
                      </td>
                      <td>{w.accountDetails}</td>
                      <td>{new Date(w.createdAt).toLocaleDateString()}</td>
                      <td>₦{w.amount.toLocaleString()}</td>
                      <td>
                        <span className={`status-pill ${w.status}`}>
                          {w.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Wallet;
