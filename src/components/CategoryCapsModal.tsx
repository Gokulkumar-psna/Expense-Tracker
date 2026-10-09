import React, { useState } from 'react';
import { CategoryBreakdown } from '../types/finance';

interface CategoryCapsModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryBreakdown[];
  onUpdateCaps: (updated: CategoryBreakdown[]) => void;
}

export const CategoryCapsModal: React.FC<CategoryCapsModalProps> = ({
  isOpen,
  onClose,
  categories,
  onUpdateCaps
}) => {
  const [caps, setCaps] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    categories.forEach(c => { map[c.id] = c.budgetCap; });
    return map;
  });

  if (!isOpen) return null;

  const handleSave = () => {
    const updated = categories.map(c => ({
      ...c,
      budgetCap: caps[c.id] || c.budgetCap
    }));
    onUpdateCaps(updated);
    onClose();
  };

  const totalCap = Object.values(caps).reduce((a, b) => a + b, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-xs" onClick={onClose} />
      
      <div className="relative bg-surface-container-lowest rounded-2xl w-full max-w-lg shadow-2xl p-space-xl z-10 border border-surface-container flex flex-col gap-space-md animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-space-sm border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">tune</span>
            <h3 className="text-headline-sm font-bold text-on-surface">Set Monthly Category Caps</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <p className="text-body-sm text-on-surface-variant">
          Adjust maximum spend ceilings per classification to prevent budget overshoot and maintain optimal savings velocity.
        </p>

        <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-surface-container-low p-3 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div 
                  className="w-3.5 h-3.5 rounded-full shrink-0" 
                  style={{ backgroundColor: cat.color }} 
                />
                <div>
                  <span className="text-title-md font-semibold text-on-surface block text-sm">{cat.name}</span>
                  <span className="text-[11px] text-on-surface-variant">Current spend: ₹{cat.amount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-on-surface-variant">₹</span>
                <input
                  type="number"
                  step="500"
                  className="w-28 bg-surface-container-lowest border border-surface-container text-on-surface font-semibold text-body-sm px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-container text-right"
                  value={caps[cat.id] || 0}
                  onChange={(e) => setCaps({ ...caps, [cat.id]: Number(e.target.value) })}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-surface-container p-3 rounded-xl flex items-center justify-between">
          <span className="text-title-md text-on-surface font-medium">Aggregated Monthly Budget:</span>
          <span className="text-headline-sm text-primary font-bold">₹{totalCap.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-body-md"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-primary-container text-on-primary-container hover:bg-primary hover:text-white font-semibold text-body-md transition-colors"
          >
            Apply Budget Caps
          </button>
        </div>
      </div>
    </div>
  );
};
