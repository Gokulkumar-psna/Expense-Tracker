import React, { useState, useEffect } from 'react';
import { Transaction } from '../types/finance';

interface TransactionDrawerProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updated: Transaction) => void;
  onDelete: (id: string) => void;
}

export const TransactionDrawer: React.FC<TransactionDrawerProps> = ({
  transaction,
  isOpen,
  onClose,
  onUpdate,
  onDelete
}) => {
  const [memo, setMemo] = useState('');
  const [isSplit, setIsSplit] = useState(false);
  const [splitCount, setSplitCount] = useState(2);
  const [splitNotes, setSplitNotes] = useState('Split equally with Roommates');

  useEffect(() => {
    if (transaction) {
      setMemo(transaction.notes || '');
      setIsSplit(Boolean(transaction.splitWith && transaction.splitWith.length > 0));
    }
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  const isIncome = transaction.type === 'income';

  const handleSave = () => {
    onUpdate({
      ...transaction,
      notes: memo,
      splitWith: isSplit ? [`Split ${splitCount} ways: ${splitNotes}`] : undefined
    });
    onClose();
  };

  const getCategoryIcon = (cat: string) => {
    if (cat.includes('Salary')) return 'account_balance';
    if (cat.includes('Housing') || cat.includes('Rent')) return 'apartment';
    if (cat.includes('Food') || cat.includes('Groceries')) return 'shopping_cart';
    if (cat.includes('Utilities')) return 'bolt';
    if (cat.includes('Transit') || cat.includes('Fuel')) return 'directions_car';
    if (cat.includes('Healthcare')) return 'medical_services';
    if (cat.includes('Shopping')) return 'shopping_bag';
    return 'receipt';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-on-surface/30 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="absolute top-0 right-0 h-full w-full max-w-md bg-surface-container-lowest shadow-2xl flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-space-lg flex flex-col gap-space-sm bg-surface-container-low/50 border-b border-surface-container">
          <div className="flex items-center justify-between">
            <span className="text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">
              Transaction Record
            </span>
            <button 
              className="p-1.5 rounded-xl hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              onClick={onClose}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div className="flex items-center gap-3 mt-1">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
              isIncome 
                ? 'bg-primary-container text-on-primary-container' 
                : 'bg-surface-container text-on-surface'
            }`}>
              <span className="material-symbols-outlined text-[24px]">
                {getCategoryIcon(transaction.category)}
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <h3 className="text-headline-sm text-on-surface font-bold truncate">
                {transaction.title}
              </h3>
              <span className="text-body-sm text-on-surface-variant">
                {transaction.date}, {transaction.time}
              </span>
            </div>
          </div>

          {/* Amount Card inside Header */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs flex items-center justify-between mt-2 border border-surface-container">
            <div className="flex flex-col">
              <span className="text-label-sm text-on-surface-variant">Cleared Total</span>
              <span className={`text-display-lg font-bold tracking-tight ${
                isIncome ? 'text-primary' : 'text-on-surface'
              }`}>
                {isIncome ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <span className={`text-label-sm font-semibold px-2.5 py-1 rounded-full ${
              transaction.status === 'Settled'
                ? 'bg-surface-container-high text-primary'
                : 'bg-surface-container text-on-surface'
            }`}>
              {transaction.status}
            </span>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="p-space-lg flex flex-col gap-space-lg flex-1">
          {/* Metadata Breakdown */}
          <div className="flex flex-col gap-space-sm">
            <span className="text-label-md text-on-surface font-semibold">Financial Breakdown</span>
            <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-3 text-body-sm">
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant">Category</span>
                <span className="font-semibold text-on-surface">{transaction.category}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant">Payment Channel</span>
                <span className="font-semibold text-on-surface">{transaction.account}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant">Transaction ID</span>
                <span className="font-mono text-on-surface font-semibold text-[12px]">
                  {transaction.referenceId || 'TXN_48291039ACME'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant">Tax / Deductions</span>
                <span className="text-on-surface font-semibold">
                  {isIncome ? '₹0.00 (Exempt / Pre-deducted)' : 'Included in Total'}
                </span>
              </div>
            </div>
          </div>

          {/* Receipt & Documentation */}
          <div className="flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <span className="text-label-md text-on-surface font-semibold">Receipt &amp; Documentation</span>
              <button 
                type="button"
                onClick={() => alert('Receipt uploaded and attached to transaction record.')}
                className="text-primary text-label-sm font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">upload_file</span> Attach
              </button>
            </div>
            
            <div className="bg-surface-container-low p-space-md rounded-xl flex items-center justify-between gap-space-sm border border-surface-container">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">description</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-title-md text-on-surface font-semibold text-sm">
                    {transaction.receiptName || `${transaction.merchant.toLowerCase().replace(/[^a-z0-9]/g, '_')}_voucher.pdf`}
                  </span>
                  <span className="text-label-sm text-on-surface-variant">
                    {transaction.receiptSize || '128 KB'} • Authenticated by Bank Gateway
                  </span>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => {
                  const blob = new Blob([`PennyWise Verified Receipt\nMerchant: ${transaction.merchant}\nAmount: ₹${transaction.amount}\nDate: ${transaction.date}`], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${transaction.merchant}_receipt.txt`;
                  a.click();
                }}
                className="p-2 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container shadow-xs transition-colors cursor-pointer" 
                title="Download Receipt"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
              </button>
            </div>
          </div>

          {/* Split Expense Option Card */}
          <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-3 border border-surface-container">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">call_split</span>
                <span className="text-title-md text-on-surface font-semibold">Split Transaction</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isSplit} 
                  onChange={(e) => setIsSplit(e.target.checked)} 
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
              </label>
            </div>
            <p className="text-body-sm text-on-surface-variant">
              Divide this charge across roommates, projects, or separate business envelopes.
            </p>

            {isSplit && (
              <div className="pt-2 border-t border-surface-container flex flex-col gap-2">
                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-on-surface-variant">Split Count:</span>
                  <div className="flex items-center gap-2">
                    {[2, 3, 4].map(n => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setSplitCount(n)}
                        className={`w-7 h-7 rounded-md font-semibold text-xs ${
                          splitCount === n ? 'bg-secondary text-white' : 'bg-surface-container text-on-surface'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between text-body-sm font-semibold text-on-surface bg-surface-container-lowest p-2 rounded-lg">
                  <span>Your Share (1/{splitCount}):</span>
                  <span className="text-secondary font-bold">
                    ₹{(transaction.amount / splitCount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Memo & Notes */}
          <div className="flex flex-col gap-1.5">
            <span className="text-label-md text-on-surface font-semibold">Internal Memo</span>
            <textarea 
              className="w-full bg-surface-container-low text-on-surface text-body-sm p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-container resize-none border border-surface-container"
              placeholder="Add personal reconciliation notes..." 
              rows={3}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </div>
        </div>

        {/* Drawer Bottom Action Footer */}
        <div className="p-space-lg bg-surface-container-low/60 flex items-center justify-between gap-space-sm border-t border-surface-container">
          <button 
            type="button"
            className="p-2 text-error hover:bg-error-container/40 rounded-xl transition-colors cursor-pointer" 
            title="Delete record"
            onClick={() => {
              if (confirm(`Are you sure you want to delete "${transaction.title}"?`)) {
                onDelete(transaction.id);
                onClose();
              }
            }}
          >
            <span className="material-symbols-outlined text-[20px]">delete</span>
          </button>
          
          <div className="flex items-center gap-2">
            <button 
              type="button"
              className="px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container text-title-md transition-colors cursor-pointer" 
              onClick={onClose}
            >
              Close
            </button>
            <button 
              type="button"
              className="px-4 py-2 rounded-xl bg-primary-container text-on-primary-container hover:bg-primary hover:text-white text-title-md shadow-xs transition-all duration-150 cursor-pointer font-semibold"
              onClick={handleSave}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
