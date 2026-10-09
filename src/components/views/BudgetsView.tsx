import React, { useState } from 'react';
import { CategoryBreakdown, Transaction } from '../../types/finance';

interface BudgetsViewProps {
  categories: CategoryBreakdown[];
  transactions: Transaction[];
  onOpenCategoryCaps: () => void;
}

export const BudgetsView: React.FC<BudgetsViewProps> = ({
  categories,
  transactions,
  onOpenCategoryCaps
}) => {
  const totalBudgeted = categories.reduce((s, c) => s + c.budgetCap, 0);
  const totalSpent = categories.reduce((s, c) => s + c.amount, 0);
  const remaining = totalBudgeted - totalSpent;
  const overallUsedPercent = Math.round((totalSpent / totalBudgeted) * 100);

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md mb-space-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-label-sm uppercase tracking-wider text-primary font-semibold">Budget Optimization</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
            <span className="text-label-sm text-on-surface-variant">Active Caps</span>
          </div>
          <h1 className="text-headline-lg text-on-surface tracking-tight mt-1 font-bold">Monthly Budgets &amp; Caps</h1>
          <p className="text-body-sm text-on-surface-variant mt-0.5">
            Track categorical envelope pacing, velocity alerts, and expenditure ceilings.
          </p>
        </div>

        <button
          onClick={onOpenCategoryCaps}
          className="bg-primary-container text-on-primary-container hover:bg-primary hover:text-white text-title-md px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-space-xs transition-all font-semibold cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">tune</span>
          <span>Edit Category Caps</span>
        </button>
      </div>

      {/* Aggregate Overview Card */}
      <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-xs border border-surface-container mb-space-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg mb-space-md">
          <div>
            <span className="text-label-sm uppercase text-on-surface-variant font-semibold block">Total Monthly Budget</span>
            <span className="text-display-lg text-on-surface font-bold tracking-tight">₹{totalBudgeted.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-label-sm uppercase text-on-surface-variant font-semibold block">Total Spent (So Far)</span>
            <span className="text-display-lg text-error font-bold tracking-tight">₹{totalSpent.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-label-sm uppercase text-on-surface-variant font-semibold block">Unallocated / Remaining</span>
            <span className="text-display-lg text-primary font-bold tracking-tight">₹{remaining.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div>
          <div className="flex justify-between text-body-sm mb-1.5">
            <span className="text-on-surface font-medium">Aggregated Budget Utilization</span>
            <span className="font-bold text-on-surface">{overallUsedPercent}% used</span>
          </div>
          <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                overallUsedPercent > 90 ? 'bg-error' : overallUsedPercent > 75 ? 'bg-tertiary' : 'bg-primary-container'
              }`}
              style={{ width: `${Math.min(overallUsedPercent, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Budget Envelopes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        {categories.map((cat) => {
          const usedPercent = Math.round((cat.amount / cat.budgetCap) * 100);
          const isOver = cat.amount > cat.budgetCap;
          const leftAmount = Math.max(0, cat.budgetCap - cat.amount);

          return (
            <div 
              key={cat.id} 
              className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-xs border border-surface-container flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white" 
                      style={{ backgroundColor: cat.color }}
                    >
                      <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-title-md font-bold text-on-surface">{cat.name}</h3>
                      <span className="text-label-sm text-on-surface-variant">{cat.classification}</span>
                    </div>
                  </div>

                  <span className={`text-label-sm font-semibold px-2 py-0.5 rounded-full ${
                    isOver ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'
                  }`}>
                    {usedPercent}% used
                  </span>
                </div>

                <div className="flex items-baseline justify-between mt-2 mb-1">
                  <span className="text-headline-sm font-bold text-on-surface">
                    ₹{cat.amount.toLocaleString('en-IN')}{' '}
                    <span className="text-body-sm text-on-surface-variant font-normal">/ ₹{cat.budgetCap.toLocaleString('en-IN')}</span>
                  </span>
                  <span className={`text-body-sm font-medium ${isOver ? 'text-error font-bold' : 'text-primary'}`}>
                    {isOver ? `Over by ₹${(cat.amount - cat.budgetCap).toLocaleString('en-IN')}` : `₹${leftAmount.toLocaleString('en-IN')} Left`}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden mt-2">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ 
                      backgroundColor: isOver ? '#ba1a1a' : cat.color,
                      width: `${Math.min(usedPercent, 100)}%`
                    }}
                  />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between text-label-sm text-on-surface-variant">
                <span>Pacing: {usedPercent <= 80 ? 'Within safety threshold' : 'High run rate warning'}</span>
                <button 
                  onClick={onOpenCategoryCaps}
                  className="text-primary hover:underline font-semibold cursor-pointer"
                >
                  Adjust Cap
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
