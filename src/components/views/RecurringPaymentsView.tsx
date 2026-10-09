import React, { useState } from 'react';
import { RecurringPayment } from '../../types/finance';

interface RecurringPaymentsViewProps {
  recurring: RecurringPayment[];
  onToggleStatus: (id: string, status: 'Active' | 'Paused' | 'Redundant') => void;
  onOpenAudit: () => void;
}

export const RecurringPaymentsView: React.FC<RecurringPaymentsViewProps> = ({
  recurring,
  onToggleStatus,
  onOpenAudit
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'redundant'>('all');

  const filtered = recurring.filter(r => {
    if (filter === 'active') return r.status === 'Active';
    if (filter === 'redundant') return r.status === 'Redundant';
    return true;
  });

  const totalMonthlyBurden = recurring
    .filter(r => r.status !== 'Paused')
    .reduce((sum, r) => sum + (r.billingCycle === 'yearly' ? Math.round(r.amount / 12) : r.amount), 0);

  const redundantCount = recurring.filter(r => r.status === 'Redundant').length;

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md mb-space-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-label-sm uppercase tracking-wider text-secondary font-semibold">Recurring Obligations</span>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary-container" />
            <span className="text-label-sm text-on-surface-variant">Calendar &amp; Auto-Debits</span>
          </div>
          <h1 className="text-headline-lg text-on-surface tracking-tight mt-1 font-bold">Recurring Payments &amp; OTT</h1>
          <p className="text-body-sm text-on-surface-variant mt-0.5">
            Monitor active subscriptions, lease commitments, utility debits, and media bundles.
          </p>
        </div>

        <button
          onClick={onOpenAudit}
          className="bg-secondary text-white hover:bg-secondary/90 text-title-md px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-space-xs transition-all font-semibold cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">tune</span>
          <span>Audit OTT Subscriptions</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md mb-space-lg">
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-surface-container">
          <span className="text-label-sm uppercase text-on-surface-variant font-semibold block">Monthly Recurring Burden</span>
          <span className="text-display-lg text-on-surface font-bold tracking-tight">₹{totalMonthlyBurden.toLocaleString('en-IN')}</span>
          <span className="text-body-sm text-on-surface-variant block mt-1">Across 8 verified services</span>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-surface-container">
          <span className="text-label-sm uppercase text-on-surface-variant font-semibold block">Next Scheduled Debit</span>
          <span className="text-headline-lg text-primary font-bold tracking-tight">₹999 · Tata Play</span>
          <span className="text-body-sm text-on-surface-variant block mt-1">Due in 4 days (28 Oct 2024)</span>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-surface-container">
          <span className="text-label-sm uppercase text-on-surface-variant font-semibold block">Redundant OTT Streaming</span>
          <span className="text-headline-lg text-error font-bold tracking-tight">{redundantCount} Overlapping Tiers</span>
          <span className="text-body-sm text-error block mt-1 font-medium">Save ₹650/month by consolidating</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-space-md">
        {(['all', 'active', 'redundant'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-label-md font-semibold capitalize transition-all cursor-pointer ${
              filter === tab
                ? 'bg-surface-container-lowest text-on-surface shadow-xs border border-surface-container'
                : 'text-on-surface-variant hover:text-on-surface bg-surface-container-low'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-label-sm uppercase tracking-wider border-b border-surface-container">
                <th className="py-3 px-4 font-semibold">Service / Obligation</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Billing Cycle</th>
                <th className="py-3 px-4 font-semibold">Next Due Date</th>
                <th className="py-3 px-4 font-semibold">Payment Channel</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 text-right font-semibold">Cost</th>
                <th className="py-3 px-4 text-center font-semibold">Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container text-body-sm">
              {filtered.map((item) => {
                const isActive = item.status === 'Active';
                const isRedundant = item.status === 'Redundant';

                return (
                  <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center font-bold text-xs text-on-surface">
                          {item.service.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-semibold text-title-md text-on-surface block text-sm">{item.name}</span>
                          <span className="text-[11px] text-on-surface-variant">{item.service}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-surface-container px-2 py-0.5 rounded text-label-sm font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 capitalize text-on-surface-variant">{item.billingCycle}</td>
                    <td className="py-3 px-4 text-on-surface-variant whitespace-nowrap">{item.dueDate}</td>
                    <td className="py-3 px-4 text-on-surface-variant">{item.paymentMethod}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : isRedundant
                          ? 'bg-secondary-fixed text-on-secondary-fixed'
                          : 'bg-error/10 text-error'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-title-md whitespace-nowrap">
                      ₹{item.amount.toLocaleString('en-IN')}{' '}
                      <span className="text-body-sm font-normal text-on-surface-variant">/{item.billingCycle === 'yearly' ? 'yr' : 'mo'}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onToggleStatus(item.id, item.status === 'Paused' ? 'Active' : 'Paused')}
                        className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors cursor-pointer"
                        title={item.status === 'Paused' ? 'Resume payment' : 'Pause payment'}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {item.status === 'Paused' ? 'play_arrow' : 'pause'}
                        </span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
