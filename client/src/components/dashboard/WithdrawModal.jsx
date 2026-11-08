import React, { useState } from 'react';
import { Building2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const WithdrawModal = ({ isOpen, onClose, balance, currency }) => {
  const [bank, setBank] = useState('GTBank Nigeria (•••• 4819)');
  const [amount, setAmount] = useState(balance);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleWithdraw = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success(
        `Disbursement of ${currency === 'NGN' ? '₦' : '$'}${Number(amount).toLocaleString()} initiated to ${bank}! Expected in your account within 10 minutes.`
      );
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#11131a] border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5 animate-fade-up">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Building2 size={18} />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-[16px] text-slate-900 dark:text-white">
                Bank Settlement Transfer
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-body">
                Instant clearing via NIBSS / Paystack Direct
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleWithdraw} className="space-y-4 font-body">
          <div>
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              Destination Bank Account
            </label>
            <select
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-indigo-500"
            >
              <option value="GTBank Nigeria (•••• 4819)">GTBank — 0123844819 (EnnyTech Ent.)</option>
              <option value="Access Bank (•••• 9920)">Access Bank — 0098199920 (QInvite Events)</option>
              <option value="Zenith Bank (•••• 3314)">Zenith Bank — 2100883314 (Corporate)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              Transfer Amount ({currency})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono text-xs">
                {currency === 'NGN' ? '₦' : '$'}
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                max={balance}
                min={1000}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-bold font-mono-numbers focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>Max available: {currency === 'NGN' ? '₦' : '$'}{balance.toLocaleString()}</span>
              <button
                type="button"
                onClick={() => setAmount(balance)}
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
              >
                Withdraw Max
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <div className="flex justify-between font-medium">
              <span>Settlement Fee (0% subsidized)</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">FREE</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Estimated Delivery</span>
              <span className="text-slate-900 dark:text-white font-bold">&lt; 10 Minutes</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing || amount <= 0}
            className="w-full py-3 rounded-xl text-white font-heading font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                Authorizing Bank Disburse...
              </>
            ) : (
              <>
                <Building2 size={14} />
                Confirm Transfer {currency === 'NGN' ? '₦' : '$'}{Number(amount).toLocaleString()}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WithdrawModal;

