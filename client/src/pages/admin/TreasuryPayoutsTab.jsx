import React, { useState, useMemo } from 'react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

const TreasuryPayoutsTab = ({ metrics, payouts, onOpenPayoutModal }) => {
  const [filter, setFilter] = useState('PENDING'); // 'PENDING' | 'APPROVED' | 'ALL'

  const filteredPayouts = useMemo(() => {
    return payouts.filter((p) => {
      if (filter === 'PENDING') return p.status === 'PENDING_APPROVAL';
      if (filter === 'APPROVED') return p.status === 'APPROVED';
      return true;
    });
  }, [payouts, filter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* ─── Treasury Balances Header ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Disbursed to Date</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">₦4,350,000</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">Settled via NIBSS NIP Rail</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Pending Payout Queue</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">
            ₦{(metrics.pendingPayoutTotal || 3600000).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {metrics.pendingPayoutsCount} requests requiring compliance signoff
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Treasury Escrow Float</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-2">
            ₦{(metrics.escrowReserve || 8208750).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Verified bank reserve balance</div>
        </div>
      </div>

      {/* ─── Filter Pills ─── */}
      <div className="flex items-center gap-2.5">
        {[
          { id: 'PENDING', label: 'Pending Approvals Queue' },
          { id: 'APPROVED', label: 'Settled Payouts Audit' },
          { id: 'ALL', label: 'All Transfers' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === f.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ─── Payouts Table ─── */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200/80 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Organizer & Event</th>
                <th className="py-3.5 px-5">Beneficiary Bank Account</th>
                <th className="py-3.5 px-5">Gross Request</th>
                <th className="py-3.5 px-5">Platform 1.5% Fee</th>
                <th className="py-3.5 px-5">Net Payout</th>
                <th className="py-3.5 px-5">Status & Ref</th>
                <th className="py-3.5 px-5 text-right">Approval Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
              {filteredPayouts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    No payout records in this view.
                  </td>
                </tr>
              ) : (
                filteredPayouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-slate-900 dark:text-white text-xs">{payout.organizerName}</div>
                      <div className="text-[11px] text-slate-400">{payout.eventTitle}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{payout.requestedAt}</div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-semibold text-slate-900 dark:text-white">{payout.bankName}</div>
                      <div className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400">{payout.accountNumber}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[160px]">{payout.accountName}</div>
                    </td>
                    <td className="py-4 px-5 font-bold text-slate-900 dark:text-white">
                      ₦{payout.amount.toLocaleString()}
                    </td>
                    <td className="py-4 px-5 font-semibold text-indigo-600 dark:text-indigo-400">
                      -₦{payout.feeDeducted.toLocaleString()}
                    </td>
                    <td className="py-4 px-5 font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      ₦{payout.netAmount.toLocaleString()}
                    </td>
                    <td className="py-4 px-5">
                      {payout.status === 'APPROVED' ? (
                        <div>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 size={12} />
                            Settled
                          </span>
                          <div className="font-mono text-[9px] text-slate-400 mt-1 truncate max-w-[150px]">
                            {payout.reference}
                          </div>
                        </div>
                      ) : payout.status === 'REJECTED' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                          <XCircle size={12} />
                          Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          <Clock size={12} />
                          Pending Review
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-right">
                      {payout.status === 'PENDING_APPROVAL' ? (
                        <button
                          onClick={() => onOpenPayoutModal(payout)}
                          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer active:scale-95"
                        >
                          Review & Disburse
                        </button>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-400">Archived</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default TreasuryPayoutsTab;

