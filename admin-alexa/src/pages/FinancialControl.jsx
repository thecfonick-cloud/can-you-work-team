import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RefreshCw, DollarSign, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { adminApi } from '../api';

const FinancialControl = () => {
  const [tab, setTab] = useState('deposits');
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [msg, setMsg] = useState('');

  const refresh = () => {
    const d = adminApi.getPendingDeposits(); if (d.success) setDeposits(d.deposits);
    const w = adminApi.getAllWithdrawals(); if (w.success) setWithdrawals(w.withdrawals);
    const t = adminApi.getAllTransactions(); if (t.success) setTransactions(t.transactions);
  };

  useEffect(() => { refresh(); }, []);

  const act = (fn, ...args) => {
    const res = fn(...args);
    if (res.success) { refresh(); setMsg(res.message || 'Done'); setTimeout(() => setMsg(''), 3000); }
  };

  const tabs = [
    { id: 'deposits', label: 'Pending Deposits', count: deposits.length, icon: ArrowDownCircle },
    { id: 'withdrawals', label: 'Withdrawal Payouts', count: withdrawals.filter(w => w.status?.toLowerCase() === 'pending').length, icon: ArrowUpCircle },
    { id: 'ledger', label: 'Transaction Ledger', count: transactions.length, icon: DollarSign },
  ];

  return (
    <div className="animate-fade-in">
      {msg && <div className="alert alert-success">{msg}</div>}

      <div className="card-header" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {tabs.map(t => (
            <button key={t.id} className={`btn btn-sm ${tab === t.id ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab(t.id)}>
              <t.icon size={14} /> {t.label} ({t.count})
            </button>
          ))}
        </div>
        <button className="btn btn-outline btn-sm" onClick={refresh}><RefreshCw size={14} /> Refresh</button>
      </div>

      {tab === 'deposits' && (
        <div className="glass-card" style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead><tr><th>User</th><th>Amount</th><th>TX Hash</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {deposits.map(d => (
                <tr key={d.id}>
                  <td data-label="User">{d.user?.name || d.user?.email || d.userId}</td>
                  <td data-label="Amount" className="text-mono text-success">₦{(d.amount || 0).toLocaleString()}</td>
                  <td data-label="TX Hash" className="text-mono" style={{ fontSize: '0.8rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.txHash || d.referenceNumber || '—'}</td>
                  <td data-label="Date" className="text-muted">{new Date(d.createdAt).toLocaleDateString()}</td>
                  <td data-label="Actions">
                    <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end' }}>
                      <button className="btn btn-success btn-sm" onClick={() => act(adminApi.approveDeposit, d.id)}><CheckCircle size={12} /> Approve</button>
                      <button className="btn btn-danger btn-sm" onClick={() => act(adminApi.rejectDeposit, d.id)}><XCircle size={12} /> Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {deposits.length === 0 && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No pending deposits</p>}
        </div>
      )}

      {tab === 'withdrawals' && (
        <div className="glass-card" style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead><tr><th>User</th><th>Method</th><th>Account</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {withdrawals.map(w => (
                <tr key={w.id}>
                  <td data-label="User"><strong>{w.user?.name || w.fullname || 'Unknown'}</strong></td>
                  <td data-label="Method"><span className="badge badge-info">{w.method || 'Bank'}</span></td>
                  <td data-label="Account" className="text-mono" style={{ fontSize: '0.8rem' }}>{w.accountDetails || '—'}</td>
                  <td data-label="Amount" className="text-mono text-danger">₦{(w.amount || 0).toLocaleString()}</td>
                  <td data-label="Status">
                    <span className={`badge ${w.status === 'paid' || w.status === 'Completed' || w.status === 'completed' ? 'badge-success' : w.status === 'rejected' || w.status === 'Rejected' ? 'badge-danger' : 'badge-warning'}`}>{w.status}</span>
                  </td>
                  <td data-label="Actions">
                    {(w.status?.toLowerCase() === 'pending') && (
                      <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end' }}>
                        <button className="btn btn-success btn-sm" onClick={() => act(adminApi.approveWithdrawal, w.id)}><CheckCircle size={12} /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => { const r = prompt('Rejection reason?'); if (r) act(adminApi.rejectWithdrawal, w.id, r); }}><XCircle size={12} /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {withdrawals.length === 0 && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No withdrawals</p>}
        </div>
      )}

      {tab === 'ledger' && (
        <div className="glass-card" style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead><tr><th>Date</th><th>User</th><th>Type</th><th>Description</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {transactions.slice(0, 100).map((tx, i) => (
                <tr key={tx.id || i}>
                  <td data-label="Date" className="text-mono" style={{ fontSize: '0.8rem' }}>{new Date(tx.createdAt).toLocaleDateString()}</td>
                  <td data-label="User">{tx.user?.name || tx.userId}</td>
                  <td data-label="Type"><span className="badge badge-info">{tx.type}</span></td>
                  <td data-label="Description">{tx.description}</td>
                  <td data-label="Amount" className={`text-mono ${tx.type === 'withdrawal' ? 'text-danger' : 'text-success'}`}>
                    {tx.type === 'withdrawal' ? '-' : '+'}₦{(tx.amount || 0).toLocaleString()}
                  </td>
                  <td data-label="Status">
                    <span className={`badge ${tx.status === 'Completed' || tx.status === 'completed' ? 'badge-success' : tx.status === 'Pending' || tx.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>{tx.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {transactions.length === 0 && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No transactions</p>}
        </div>
      )}
    </div>
  );
};

export default FinancialControl;
