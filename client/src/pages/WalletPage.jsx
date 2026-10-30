import React, { useState } from 'react';
import {
  Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, Building2,
  CheckCircle2, Clock, ShieldCheck, Download, Plus, AlertCircle,
  CreditCard, DollarSign, Calendar, ChevronRight, X
} from 'lucide-react';
import toast from 'react-hot-toast';

const TRANSACTIONS = [
  {
    id: 'TXN_98241',
    type: 'PAYOUT',
    description: 'Direct Bank Settlement (Access Bank)',
    event: 'Lagos Tech Summit 2026',
    date: 'Oct 14, 2026',
    time: '14:20',
    amount: -1200000,
    status: 'COMPLETED',
    ref: 'ACC_NIP_981249128',
  },
  {
    id: 'TXN_98240',
    type: 'TICKET_SALES',
    description: 'Bulk VIP Pass Orders (50 passes)',
    event: 'Lagos Tech Summit 2026',
    date: 'Oct 14, 2026',
    time: '11:05',
    amount: 1500000,
    status: 'COMPLETED',
    ref: 'PAY_FLW_771829102',
  },
  {
    id: 'TXN_98239',
    type: 'TICKET_SALES',
    description: 'VVIP Corporate Table Reservation',
    event: 'Private Founders VIP Gala',
    date: 'Oct 13, 2026',
    time: '19:42',
    amount: 2400000,
    status: 'COMPLETED',
    ref: 'PAY_STR_449102812',
  },
  {
    id: 'TXN_98238',
    type: 'PAYOUT',
    description: 'Scheduled Weekly Settlement (GTBank)',
    event: 'Annual Charity Ball 2026',
    date: 'Oct 10, 2026',
    time: '08:30',
    amount: -3500000,
    status: 'COMPLETED',
    ref: 'GTB_NIP_109283019',
  },
  {
    id: 'TXN_98237',
    type: 'DISPATCH_FEE',
    description: 'WhatsApp Cloud API Pass Delivery (1,250 sends)',
    event: 'Lagos Tech Summit 2026',
    date: 'Oct 09, 2026',
    time: '16:15',
    amount: -25000,
    status: 'COMPLETED',
    ref: 'FEE_WA_381920391',
  },
];

const BANK_ACCOUNTS = [
  {
    id: 'bnk_1',
    bank: 'Access Bank Nigeria',
    accountNumber: '012****892',
    accountName: 'Kelechi Okafor & Associates',
    currency: 'NGN',
    isPrimary: true,
  },
  {
    id: 'bnk_2',
    bank: 'Guaranty Trust Bank (GTBank)',
    accountNumber: '024****119',
    accountName: 'Kelechi Okafor Event Ltd',
    currency: 'NGN',
    isPrimary: false,
  },
];

const WalletPage = () => {
  const [currency, setCurrency] = useState('NGN');
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState(BANK_ACCOUNTS[0].id);
  const [transactions, setTransactions] = useState(TRANSACTIONS);
  const [filterType, setFilterType] = useState('ALL');

  const availableBalance = 1850000;
  const pendingSettlement = 420000;
  const lifetimeRevenue = 7250000;

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (!amt || amt <= 0) {
      toast.error('Please enter a valid withdrawal amount');
      return;
    }
    if (amt > availableBalance) {
      toast.error('Amount exceeds your available balance');
      return;
    }

    const newTxn = {
      id: `TXN_${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'PAYOUT',
      description: `Manual Settlement Request`,
      event: 'Instant Payout',
      date: 'Just now',
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      amount: -amt,
      status: 'PENDING',
      ref: `NIP_${Date.now().toString().slice(-9)}`,
    };

    setTransactions([newTxn, ...transactions]);
    setWithdrawModal(false);
    setWithdrawAmount('');
    toast.success(`Withdrawal request for ₦${amt.toLocaleString()} initiated! Transfer will hit your bank account within 10 minutes.`);
  };

  const filteredTxns = transactions.filter(t => {
    if (filterType === 'ALL') return true;
    if (filterType === 'PAYOUT') return t.type === 'PAYOUT';
    if (filterType === 'SALES') return t.type === 'TICKET_SALES';
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-up pb-16">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-[var(--text-primary)]">Wallet & Settlements</h1>
          <p className="text-[13px] text-[var(--text-tertiary)] mt-0.5">
            Monitor real-time ticket sales volume, bank settlement transfers, and dispatch costs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrency(c => c === 'NGN' ? 'USD' : 'NGN')}
            className="h-9 px-3 rounded-lg border border-[var(--border)] text-[12px] font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            {currency} Currency ⇄
          </button>
          <button
            onClick={() => setWithdrawModal(true)}
            className="h-9 px-4 rounded-lg text-[13px] font-semibold text-white cursor-pointer btn-accent flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
          >
            <ArrowUpRight size={15} strokeWidth={2.5} />
            Request Payout
          </button>
        </div>
      </div>

      {/* Hero Financial Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Available Balance */}
        <div className="card-glow rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--text-tertiary)]">
            <span className="label-xs">Available Balance</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Wallet size={16} />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-black tracking-tight text-[var(--text-primary)]">
              {currency === 'NGN' ? `₦${availableBalance.toLocaleString()}` : `$${(availableBalance / 1500).toFixed(2)}`}
            </div>
            <p className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 size={12} /> Ready for instant bank settlement
            </p>
          </div>
          <button
            onClick={() => setWithdrawModal(true)}
            className="text-[12px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
          >
            Withdraw to Bank <ChevronRight size={13} />
          </button>
        </div>

        {/* Pending Clearing */}
        <div className="card-glow rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--text-tertiary)]">
            <span className="label-xs">Pending Clearing (T+1)</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Clock size={16} />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-black tracking-tight text-[var(--text-primary)]">
              {currency === 'NGN' ? `₦${pendingSettlement.toLocaleString()}` : `$${(pendingSettlement / 1500).toFixed(2)}`}
            </div>
            <p className="text-[11px] text-[var(--text-tertiary)] mt-1">
              Clears automatically at 00:00 UTC
            </p>
          </div>
          <div className="h-1.5 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full w-2/3" />
          </div>
        </div>

        {/* Total Lifetime Volume */}
        <div className="card-glow rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.06))' }}>
          <div className="flex items-center justify-between text-[var(--text-tertiary)]">
            <span className="label-xs">Lifetime Sales Volume</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-black tracking-tight text-[var(--text-primary)]">
              {currency === 'NGN' ? `₦${lifetimeRevenue.toLocaleString()}` : `$${(lifetimeRevenue / 1500).toFixed(2)}`}
            </div>
            <p className="text-[11px] text-indigo-400 font-semibold mt-1">
              Across 3 organized events
            </p>
          </div>
          <div className="text-[11px] text-[var(--text-tertiary)]">
            Zero chargeback penalty record
          </div>
        </div>
      </div>

      {/* Linked Bank Accounts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[14px] font-bold text-[var(--text-primary)]">Settlement Accounts</h2>
            <p className="text-[11px] text-[var(--text-tertiary)]">Verified bank destinations for automatic and on-demand payouts</p>
          </div>
          <button
            onClick={() => toast.success('Add new bank account dialog')}
            className="h-8 px-3 rounded-lg border border-[var(--border)] text-[11px] font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer flex items-center gap-1.5"
          >
            <Plus size={12} /> Add Bank Account
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {BANK_ACCOUNTS.map(acc => (
            <div key={acc.id} className="card-glow rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Building2 size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-[var(--text-primary)]">{acc.bank}</span>
                    {acc.isPrimary && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/15 text-emerald-400 uppercase">
                        Primary
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-mono text-[var(--text-secondary)] mt-0.5">
                    {acc.accountNumber} • {acc.accountName}
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Verified
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History Ledger */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-[14px] font-bold text-[var(--text-primary)]">Transaction Ledger</h2>
            <p className="text-[11px] text-[var(--text-tertiary)]">Immutable record of ticket settlements and messaging deductions</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)]">
              {['ALL', 'PAYOUT', 'SALES'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilterType(f)}
                  className={`h-6 px-2.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    filterType === f
                      ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border)] shadow-xs'
                      : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                  }`}
                >
                  {f === 'ALL' ? 'All' : f === 'PAYOUT' ? 'Payouts' : 'Ticket Sales'}
                </button>
              ))}
            </div>
            <button
              onClick={() => toast.success('Statement export downloaded!')}
              className="h-8 px-3 rounded-lg border border-[var(--border)] text-[11px] font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer flex items-center gap-1.5"
            >
              <Download size={12} /> Export Statement
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="card-glow rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-subtle)]/40">
                  <th className="py-3 px-4 label-xs text-[var(--text-tertiary)]">Transaction</th>
                  <th className="py-3 px-4 label-xs text-[var(--text-tertiary)]">Event Source</th>
                  <th className="py-3 px-4 label-xs text-[var(--text-tertiary)]">Date & Time</th>
                  <th className="py-3 px-4 label-xs text-[var(--text-tertiary)]">Reference ID</th>
                  <th className="py-3 px-4 label-xs text-[var(--text-tertiary)]">Status</th>
                  <th className="py-3 px-4 label-xs text-[var(--text-tertiary)] text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] text-[12px]">
                {filteredTxns.map(t => {
                  const isPositive = t.amount > 0;
                  return (
                    <tr key={t.id} className="hover:bg-[var(--bg-subtle)]/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-indigo-500/10 text-indigo-400'
                          }`}>
                            {isPositive ? <ArrowDownLeft size={13} /> : <ArrowUpRight size={13} />}
                          </div>
                          <div>
                            <div className="font-semibold text-[var(--text-primary)]">{t.description}</div>
                            <div className="text-[10px] text-[var(--text-tertiary)] font-mono">{t.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[var(--text-secondary)]">{t.event}</td>
                      <td className="py-3.5 px-4 text-[var(--text-tertiary)]">
                        {t.date} · <span className="font-mono">{t.time}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[var(--text-tertiary)]">{t.ref}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          t.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {t.status}
                        </span>
                      </td>
                      <td className={`py-3.5 px-4 text-right font-bold font-mono text-[13px] ${
                        isPositive ? 'text-emerald-400' : 'text-[var(--text-primary)]'
                      }`}>
                        {isPositive ? '+' : ''}₦{Math.abs(t.amount).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {withdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="card-glow rounded-2xl w-full max-w-md p-6 bg-[var(--bg-surface)] border border-[var(--border)] shadow-2xl space-y-5 animate-fade-up">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div>
                <h3 className="font-bold text-[16px] text-[var(--text-primary)]">Initiate Payout</h3>
                <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">Direct bank transfer via NIBSS Instant Payment</p>
              </div>
              <button
                onClick={() => setWithdrawModal(false)}
                className="w-7 h-7 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4 text-[13px]">
              <div>
                <label className="block label-xs text-[var(--text-tertiary)] mb-1.5">Destination Bank Account</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text-primary)] outline-none"
                >
                  {BANK_ACCOUNTS.map(b => (
                    <option key={b.id} value={b.id}>{b.bank} - {b.accountNumber}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="label-xs text-[var(--text-tertiary)]">Amount (NGN)</label>
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount(availableBalance.toString())}
                    className="text-[11px] text-indigo-400 font-semibold cursor-pointer"
                  >
                    Max (₦{availableBalance.toLocaleString()})
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-[var(--text-tertiary)]">₦</span>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="e.g. 500,000"
                    className="w-full h-10 pl-8 pr-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text-primary)] font-mono font-bold outline-none"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300 flex items-start gap-2">
                <ShieldCheck size={16} className="shrink-0 text-indigo-400 mt-0.5" />
                <span>
                  Settlements are processed via automated clearing. Average arrival time is 2 to 10 minutes into your registered commercial account.
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setWithdrawModal(false)}
                  className="flex-1 h-9 rounded-lg border border-[var(--border)] text-[12px] font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-9 rounded-lg text-[12px] font-semibold text-white cursor-pointer btn-accent"
                  style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
                >
                  Confirm Payout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;
