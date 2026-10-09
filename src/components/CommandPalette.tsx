import React, { useState, useEffect } from 'react';
import { Transaction } from '../types/finance';
import { NavTab } from './Sidebar';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
  onSelectTab: (tab: NavTab) => void;
  onOpenAddModal: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  transactions,
  onSelectTransaction,
  onSelectTab,
  onOpenAddModal
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle palette
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or toggle
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTx = transactions.filter(t => 
    t.title.toLowerCase().includes(query.toLowerCase()) ||
    t.merchant.toLowerCase().includes(query.toLowerCase()) ||
    t.category.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const allNavActions: { label: string; tab: NavTab; icon: string }[] = [
    { label: 'Go to Financial Analytics', tab: 'analytics', icon: 'insights' },
    { label: 'Go to Transactions Ledger', tab: 'transactions', icon: 'receipt_long' },
    { label: 'Go to Budget Planner', tab: 'budgets', icon: 'pie_chart' },
    { label: 'Go to Savings Goals', tab: 'savings-goals', icon: 'savings' },
    { label: 'Go to Recurring Payments', tab: 'recurring-payments', icon: 'event_repeat' },
    { label: 'Go to Account Settings', tab: 'settings', icon: 'settings' }
  ];
  const navActions = allNavActions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4">
      <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-xs" onClick={onClose} />
      
      <div className="relative bg-surface-container-lowest rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden border border-surface-container z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-surface-container gap-3 bg-surface-container-low/50">
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant">search</span>
          <input
            className="w-full bg-transparent text-on-surface placeholder:text-on-surface-variant text-body-md focus:outline-none"
            placeholder="Type to search transactions, views, or actions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <kbd className="text-[10px] bg-surface-container text-on-surface-variant px-1.5 py-0.5 rounded font-mono">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="p-3 max-h-96 overflow-y-auto flex flex-col gap-3">
          {/* Quick Action */}
          <div>
            <span className="text-[11px] font-bold text-on-surface-variant uppercase px-2 tracking-wider">
              Actions
            </span>
            <div className="mt-1 flex flex-col gap-1">
              <button
                onClick={() => {
                  onClose();
                  onOpenAddModal();
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-primary/10 flex items-center justify-between text-on-surface text-body-sm cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">add_circle</span>
                  <span className="font-semibold text-primary">Add New Transaction</span>
                </div>
                <span className="text-label-sm text-on-surface-variant group-hover:text-primary">Press Enter</span>
              </button>
            </div>
          </div>

          {/* Navigation */}
          {navActions.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-on-surface-variant uppercase px-2 tracking-wider">
                Views &amp; Screens
              </span>
              <div className="mt-1 flex flex-col gap-1">
                {navActions.map((item) => (
                  <button
                    key={item.tab}
                    onClick={() => {
                      onSelectTab(item.tab);
                      onClose();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-surface-container flex items-center justify-between text-on-surface text-body-sm cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                      chevron_right
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Transactions */}
          {filteredTx.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-on-surface-variant uppercase px-2 tracking-wider">
                Matching Transactions
              </span>
              <div className="mt-1 flex flex-col gap-1">
                {filteredTx.map((tx) => (
                  <button
                    key={tx.id}
                    onClick={() => {
                      onSelectTransaction(tx);
                      onClose();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-surface-container flex items-center justify-between text-body-sm cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${tx.type === 'income' ? 'bg-primary' : 'bg-error'}`} />
                      <span className="font-semibold text-on-surface truncate max-w-[200px]">{tx.title}</span>
                      <span className="text-label-sm text-on-surface-variant">{tx.category}</span>
                    </div>
                    <span className={`font-semibold ${tx.type === 'income' ? 'text-primary' : 'text-on-surface'}`}>
                      {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
