import React from 'react';
import { Wallet, X, RefreshCw, CheckCircle2 } from 'lucide-react';

const PayoutApprovalModal = ({ payout, loading, onClose, onAction }) => {
  if (!payout) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-7 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Wallet size={19} />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Compliance Payout Approval
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Beneficiary Details Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Organizer:</span>
            <span className="font-bold text-slate-900 dark:text-white">{payout.organizerName}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Event:</span>
            <span className="font-semibold text-slate-900 dark:text-white">{payout.eventTitle}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Destination Bank:</span>
            <span className="font-semibold text-slate-900 dark:text-white">{payout.bankName}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Account Number:</span>
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{payout.accountNumber}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Account Name:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">{payout.accountName}</span>
          </div>
        </div>

        {/* Amount Breakdown Card */}
        <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">Net Settlement Amount</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              ₦{payout.netAmount.toLocaleString()}
            </div>
          </div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
            1.5% Fee: ₦{payout.feeDeducted.toLocaleString()}
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          By confirming, you authorize an automated disbursement via NIBSS Instant Payment (NIP) clearing rail. Funds will arrive in the organizer's verified corporate account immediately.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={() => onAction('REJECT')}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200 dark:border-rose-500/20 transition-all cursor-pointer"
          >
            Reject Request
          </button>

          <button
            onClick={() => onAction('APPROVE')}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-2 active:scale-95"
          >
            {loading ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Transmitting to NIP...</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={15} />
                <span>Approve & Disburse</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default PayoutApprovalModal;

