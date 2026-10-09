import React, { useState } from 'react';
import { RecurringPayment } from '../types/finance';

interface SubscriptionsAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  recurring: RecurringPayment[];
  onToggleStatus: (id: string, status: 'Active' | 'Paused' | 'Redundant') => void;
}

export const SubscriptionsAuditModal: React.FC<SubscriptionsAuditModalProps> = ({
  isOpen,
  onClose,
  recurring,
  onToggleStatus
}) => {
  const [activeItems, setActiveItems] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    recurring.forEach(r => {
      map[r.id] = r.status !== 'Paused';
    });
    return map;
  });

  if (!isOpen) return null;

  const ottItems = recurring.filter(r => 
    r.category === 'Entertainment' || r.name.toLowerCase().includes('netflix') || r.name.toLowerCase().includes('prime') || r.name.toLowerCase().includes('hotstar') || r.name.toLowerCase().includes('sonyliv')
  );

  const pausedCount = Object.entries(activeItems).filter(([id, active]) => {
    return !active && ottItems.some(o => o.id === id);
  }).length;

  const savedPerMonth = ottItems.reduce((acc, curr) => {
    if (!activeItems[curr.id]) {
      return acc + (curr.billingCycle === 'yearly' ? Math.round(curr.amount / 12) : curr.amount);
    }
    return acc;
  }, 0);

  const handleToggle = (id: string) => {
    const nextVal = !activeItems[id];
    setActiveItems({ ...activeItems, [id]: nextVal });
    onToggleStatus(id, nextVal ? 'Active' : 'Paused');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-xs" onClick={onClose} />

      <div className="relative bg-surface-container-lowest rounded-2xl w-full max-w-lg shadow-2xl p-space-xl z-10 border border-surface-container flex flex-col gap-space-md animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-space-sm border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[24px]">tune</span>
            <div>
              <h3 className="text-headline-sm font-bold text-on-surface">OTT Subscriptions Audit</h3>
              <span className="text-label-sm text-on-surface-variant">4 Active Streaming Bundles Detected</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Intelligence Banner */}
        <div className="bg-secondary-fixed/20 border-l-4 border-secondary p-3 rounded-xl flex items-start gap-2.5">
          <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">info</span>
          <p className="text-body-sm text-on-surface-variant">
            Pausing duplicate video streaming tiers (e.g. Disney+ Hotstar and SonyLIV) recovers <strong className="text-secondary font-bold">₹650/month</strong>, redirecting ₹7,800 annually into your emergency reserve.
          </p>
        </div>

        {/* OTT Subscription items list */}
        <div className="flex flex-col gap-2.5 max-h-72 overflow-y-auto pr-1">
          {ottItems.map((item) => {
            const isActive = activeItems[item.id] !== false;
            return (
              <div 
                key={item.id} 
                className={`p-3 rounded-xl flex items-center justify-between border transition-all ${
                  isActive 
                    ? 'bg-surface-container-low border-surface-container text-on-surface' 
                    : 'bg-surface-container/40 border-dashed border-outline-variant text-on-surface-variant opacity-75'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                    isActive ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-surface-container text-on-surface-variant'
                  }`}>
                    {item.service.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-title-md font-semibold block text-sm">{item.name}</span>
                    <span className="text-label-sm text-on-surface-variant">
                      ₹{item.amount}/{item.billingCycle === 'yearly' ? 'yr' : 'mo'} • Renews {item.dueDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'
                  }`}>
                    {isActive ? 'Active' : 'Paused'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggle(item.id)}
                    className={`px-3 py-1 rounded-lg text-label-md font-semibold transition-colors cursor-pointer ${
                      isActive 
                        ? 'bg-surface-container hover:bg-error-container hover:text-error text-on-surface' 
                        : 'bg-primary-container text-on-primary-container hover:bg-primary hover:text-white'
                    }`}
                  >
                    {isActive ? 'Pause Tier' : 'Resume'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Savings counter summary */}
        <div className="bg-primary/10 border border-primary/20 p-3.5 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-label-sm text-primary font-bold uppercase tracking-wider block">Estimated Savings</span>
            <span className="text-body-sm text-on-surface-variant">{pausedCount} subscription(s) paused</span>
          </div>
          <span className="text-headline-md font-bold text-primary">
            +₹{savedPerMonth.toLocaleString('en-IN')}/mo
          </span>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
          <button 
            type="button" 
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-primary-container text-on-primary-container hover:bg-primary hover:text-white font-semibold text-body-md transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
