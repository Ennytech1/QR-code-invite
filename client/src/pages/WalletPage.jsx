import React, { useState, useMemo } from 'react';
import {
  Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, Building2,
  CheckCircle2, Clock, ShieldCheck, Download, Plus, AlertCircle,
  CreditCard, DollarSign, Calendar, ChevronRight, X, Sparkles,
  Search, Filter, RefreshCw, ExternalLink, Zap, Layers,
  Check, ArrowRight, Shield, BadgeCheck, Landmark
} from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_TRANSACTIONS = [
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
    channel: 'NIBSS Instant Payment',
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
    ref: 'PAY_PSTK_771829102',
    channel: 'Paystack Checkout',
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
    channel: 'Stripe Global Card',
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
    channel: 'NIBSS Automated Clearing',
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
    ref: 'FEE_META_381920391',
    channel: 'Meta Graph Billing',
  },
  {
    id: 'TXN_98236',
    type: 'TICKET_SALES',
    description: 'Early Bird General Admission (180 tickets)',
    event: 'Lagos Tech Summit 2026',
    date: 'Oct 08, 2026',
    time: '10:00',
    amount: 1800000,
    status: 'COMPLETED',
    ref: 'PAY_PSTK_109283912',
    channel: 'Paystack Checkout',
  },
];

const BANK_ACCOUNTS = [
  {
    id: 'bnk_1',
    bank: 'Access Bank Nigeria',
    accountNumber: '012****892',
    accountName: 'Kelechi Okafor & Associates Ltd',
    currency: 'NGN',
    isPrimary: true,
    logoBg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30',
  },
  {
    id: 'bnk_2',
    bank: 'Guaranty Trust Bank (GTBank)',
    accountNumber: '024****119',
    accountName: 'Kelechi Okafor Event Ventures',
    currency: 'NGN',
    isPrimary: false,
    logoBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
  },
];

const EVENT_REVENUE_BREAKDOWN = [
  {
    id: 'evt_1',
    name: 'Lagos Tech Summit 2026',
    gross: 4500000,
    ticketsSold: 320,
    pct: 62,
    payoutStatus: 'Settling Automatically',
  },
  {
    id: 'evt_2',
    name: 'Private Founders VIP Gala',
    gross: 2400000,
    ticketsSold: 45,
    pct: 33,
    payoutStatus: 'Available for Withdrawal',
  },
  {
    id: 'evt_3',
    name: 'Annual Charity Ball 2026',
    gross: 350000,
    ticketsSold: 70,
    pct: 5,
    payoutStatus: 'Fully Disbursed',
  },
];

const WalletPage = () => {
  const [currency, setCurrency] = useState('NGN'); // 'NGN' | 'USD'
  const [exchangeRate] = useState(1500); // 1 USD = 1,500 NGN
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState(BANK_ACCOUNTS[0].id);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [filterType, setFilterType] = useState('ALL'); // ALL | PAYOUT | SALES | DISPATCH_FEE
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessingWithdrawal, setIsProcessingWithdrawal] = useState(false);

  // Financial Balances (in NGN)
  const availableBalance = 1850000;
  const pendingSettlement = 420000;
  const lifetimeRevenue = 7250000;

  const formatMoney = (valInNgn) => {
    if (currency === 'USD') {
      const inUsd = Math.abs(valInNgn) / exchangeRate;
      return `$${inUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `₦${Math.abs(valInNgn).toLocaleString()}`;
  };

  const handleQuickPercent = (pct) => {
    const calc = Math.floor(availableBalance * (pct / 100));
    setWithdrawAmount(calc.toString());
  };

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

    setIsProcessingWithdrawal(true);
    setTimeout(() => {
      const bankObj = BANK_ACCOUNTS.find((b) => b.id === selectedBank) || BANK_ACCOUNTS[0];
      const newTxn = {
        id: `TXN_${Math.floor(10000 + Math.random() * 90000)}`,
        type: 'PAYOUT',
        description: `Direct Bank Settlement (${bankObj.bank})`,
        event: 'Manual Payout Request',
        date: 'Just now',
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        amount: -amt,
        status: 'PENDING',
        ref: `NIP_${Date.now().toString().slice(-9)}`,
        channel: 'NIBSS Instant Transfer',
      };

      setTransactions([newTxn, ...transactions]);
      setIsProcessingWithdrawal(false);
      setWithdrawModal(false);
      setWithdrawAmount('');
      toast.success(
        `Withdrawal of ₦${amt.toLocaleString()} initiated! Expected in ${bankObj.bank} in 2-10 minutes.`
      );
    }, 1000);
  };

  // Filtered Ledger
  const filteredTxns = useMemo(() => {
    return transactions.filter((t) => {
      const matchesFilter =
        filterType === 'ALL' ||
        (filterType === 'PAYOUT' && t.type === 'PAYOUT') ||
        (filterType === 'SALES' && t.type === 'TICKET_SALES') ||
        (filterType === 'FEE' && t.type === 'DISPATCH_FEE');

      const matchesSearch =
        !searchQuery ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [transactions, filterType, searchQuery]);

  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Type', 'Description', 'Event Source', 'Date', 'Time', 'Channel', 'Reference ID', 'Status', 'Amount'];
    const rows = filteredTxns.map((t) => [
      `"${t.id}"`,
      `"${t.type}"`,
      `"${t.description}"`,
      `"${t.event}"`,
      `"${t.date}"`,
      `"${t.time}"`,
      `"${t.channel}"`,
      `"${t.ref}"`,
      `"${t.status}"`,
      t.amount,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Wallet_Payout_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Wallet transaction ledger exported to CSV!');
  };

  return (
    <div className="space-y-7 pb-24 font-body text-slate-800 dark:text-slate-100 max-w-6xl mx-auto px-3 sm:px-4">
      
      {/* ─── Top Header & Payout Trigger ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 font-mono">
              SETTLEMENT VAULT
            </span>
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Paystack & Stripe Webhooks Active
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white font-heading mt-1">
            Wallet & Settlements
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Monitor real-time ticket checkout volume, pending T+1 bank clearings, and request instant commercial disbursements.
          </p>
        </div>

        {/* Currency Switcher & Withdraw Action */}
        <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setCurrency((c) => (c === 'NGN' ? 'USD' : 'NGN'))}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-2xs hover:scale-102 flex items-center gap-1.5"
            title="Switch displayed currency"
          >
            <DollarSign size={13} className="text-indigo-500" />
            <span>Currency: <strong>{currency}</strong></span>
          </button>

          <button
            type="button"
            onClick={() => setWithdrawModal(true)}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-95 group"
          >
            <ArrowUpRight size={16} strokeWidth={2.5} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            <span>Request Bank Payout</span>
          </button>
        </div>
      </div>

      {/* ─── Hero Financial Balance Cards (3 Columns) ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Available Balance */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0e14] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-emerald-500/50 hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />

          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Available for Withdrawal
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                <Wallet size={18} />
              </div>
            </div>

            <div className="my-4">
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
                {formatMoney(availableBalance)}
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1.5 flex items-center gap-1.5">
                <CheckCircle2 size={13} className="shrink-0 animate-count-pulse" />
                <span>Ready for instant commercial bank transfer</span>
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setWithdrawModal(true)}
              className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer group/link"
            >
              <span>Disburse to Bank Account</span>
              <ChevronRight size={13} className="group-hover/link:translate-x-1 transition-transform" />
            </button>
            <span className="text-[10px] text-slate-400 font-mono">Instant NIP</span>
          </div>
        </div>

        {/* Card 2: Pending Clearing (T+1 Escrow) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0e14] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-amber-500/50 hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />

          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Pending Clearing (T+1 Settlement)
              </span>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs">
                <Clock size={18} />
              </div>
            </div>

            <div className="my-4">
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
                {formatMoney(pendingSettlement)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-amber-500 shrink-0" />
                <span>Card fraud verification & 24h escrow clearing</span>
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Clearing Progress</span>
              <span className="font-mono font-bold text-amber-500">68% verified</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full w-2/3" />
            </div>
          </div>
        </div>

        {/* Card 3: Lifetime Revenue Volume */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0e14] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-indigo-500/50 hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />

          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Lifetime Gross Ticket Sales
              </span>
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
                <TrendingUp size={18} />
              </div>
            </div>

            <div className="my-4">
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
                {formatMoney(lifetimeRevenue)}
              </div>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mt-1.5 flex items-center gap-1.5">
                <BadgeCheck size={13} className="shrink-0" />
                <span>Zero chargeback penalty • 100% payout fulfillment</span>
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Across 3 organized campaigns</span>
            <span className="font-bold text-slate-900 dark:text-white">435 passes sold</span>
          </div>
        </div>

      </div>

      {/* ─── Revenue Breakdown by Event & Gate Gateway ─── */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0c0e14] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
              PORTFOLIO BREAKDOWN
            </span>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-heading mt-0.5">
              Event Revenue & Settlement Status
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live earnings split by active ticket campaigns and sales distribution.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 self-start sm:self-auto">
            100% Host Retention Rate (0.5% Platform Fee)
          </span>
        </div>

        <div className="space-y-4">
          {EVENT_REVENUE_BREAKDOWN.map((evt) => (
            <div
              key={evt.id}
              className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40 space-y-2 hover:border-slate-200 dark:hover:border-slate-700 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {evt.name}
                  </h4>
                  <span className="text-slate-400 text-[11px]">
                    {evt.ticketsSold} passes issued • {evt.payoutStatus}
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-mono font-black text-sm text-slate-900 dark:text-white block">
                    {formatMoney(evt.gross)}
                  </span>
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                    {evt.pct}% of total volume
                  </span>
                </div>
              </div>

              {/* Ingress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-500 rounded-full transition-all duration-500"
                  style={{ width: `${evt.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Linked Commercial Settlement Accounts ─── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-heading">
              Settlement Bank Accounts
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified commercial bank destinations for on-demand payouts and automated midnight clearings.
            </p>
          </div>

          <button
            type="button"
            onClick={() => toast.success('Commercial account verification is powered by Paystack NIP lookup.')}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-2xs hover:scale-102 flex items-center gap-1.5"
          >
            <Plus size={13} />
            <span>Add Bank Account</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BANK_ACCOUNTS.map((acc) => (
            <div
              key={acc.id}
              className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0e14] shadow-sm flex items-center justify-between gap-4 hover:border-indigo-500/50 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-2xs ${acc.logoBg}`}>
                  <Landmark size={22} />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900 dark:text-white truncate">
                      {acc.bank}
                    </span>
                    {acc.isPrimary && (
                      <span className="px-2 py-0.2 rounded-md text-[9px] font-black uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                        Primary
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-mono font-bold text-slate-500 mt-0.5">
                    {acc.accountNumber}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {acc.accountName}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1">
                  <Check size={11} strokeWidth={3} />
                  Verified
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">Instant NIP</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Transaction Ledger & Payout History ─── */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0c0e14] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        
        {/* Ledger Header & Search/Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-heading">
              Transaction Ledger & Audit Trail
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Immutable record of ticket settlements, bank payouts, and dispatch deductions.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-2xs hover:scale-102 flex items-center gap-1.5"
            >
              <Download size={13} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Toolbar: Search & Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by transaction reference, event, or description..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
            {[
              { id: 'ALL', label: 'All' },
              { id: 'SALES', label: 'Ticket Sales' },
              { id: 'PAYOUT', label: 'Bank Payouts' },
              { id: 'FEE', label: 'Dispatch Fees' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterType(f.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterType === f.id
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-2xs scale-102'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table Container */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Transaction / Description</th>
                  <th className="py-3 px-4">Event Source</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Channel / Reference</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Settlement Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-[#0c0e14]">
                {filteredTxns.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No transactions found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTxns.map((t) => {
                    const isPositive = t.amount > 0;
                    return (
                      <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                              isPositive
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                                : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                            }`}>
                              {isPositive ? <ArrowDownLeft size={15} /> : <ArrowUpRight size={15} />}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 dark:text-white truncate max-w-[220px]">
                                {t.description}
                              </p>
                              <span className="text-[10px] font-mono text-slate-400">
                                {t.id}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                          {t.event}
                        </td>

                        <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                          {t.date} • <span className="font-mono text-slate-400">{t.time}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300 block truncate max-w-[160px]">
                            {t.ref}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {t.channel}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            t.status === 'COMPLETED'
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                              : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {t.status}
                          </span>
                        </td>

                        <td className={`py-3.5 px-4 text-right font-black font-mono text-sm whitespace-nowrap ${
                          isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                        }`}>
                          {isPositive ? '+' : '-'}{formatMoney(t.amount)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          BANK WITHDRAWAL MODAL (LIGHT & DARK MODE READY)
         ───────────────────────────────────────────────────────────── */}
      {withdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-[#0c0e14] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-fade-in-scale text-slate-900 dark:text-slate-100 my-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
                  <ArrowUpRight size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white font-heading">
                    Request Commercial Payout
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Direct NIBSS Instant Settlement</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setWithdrawModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              {/* Destination Bank Account */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Destination Commercial Account
                </label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 cursor-pointer shadow-2xs"
                >
                  {BANK_ACCOUNTS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.bank} — {b.accountNumber} ({b.accountName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount Input & Percent Shortcuts */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Withdrawal Amount (NGN)
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Max: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">₦{availableBalance.toLocaleString()}</strong>
                  </span>
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-sm text-slate-400">₦</span>
                  <input
                    type="number"
                    min="1000"
                    max={availableBalance}
                    required
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="e.g. 500000"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-mono font-bold text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>

                {/* Quick % buttons */}
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {[25, 50, 75, 100].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleQuickPercent(pct)}
                      className="py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300 cursor-pointer transition-all active:scale-95 shadow-2xs"
                    >
                      {pct === 100 ? 'Max (100%)' : `${pct}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* NIP Speed Guarantee Notice */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-500/20 text-xs space-y-1 text-indigo-950 dark:text-indigo-200">
                <p className="font-extrabold flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300">
                  <ShieldCheck size={14} />
                  <span>NIBSS Instant Payment Settlement</span>
                </p>
                <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                  Transfers are settled through automated interbank clearing. Funds reflect in your verified commercial account within 2 to 10 minutes.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setWithdrawModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessingWithdrawal}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {isProcessingWithdrawal ? 'Authorizing Payout...' : 'Confirm Bank Payout'}
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
