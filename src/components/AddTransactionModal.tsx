import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types/finance';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onAddTransaction
}) => {
  const [txType, setTxType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Food & Groceries');
  const [date, setDate] = useState('2024-10-24');
  const [account, setAccount] = useState('HDFC Direct (..9012)');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    onAddTransaction({
      date,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title,
      subtitle: `${category} • ${account}`,
      merchant: title,
      category,
      account,
      amount: numAmount,
      type: txType,
      status: 'Completed',
      notes: note,
      referenceId: `TXN_${Math.floor(100000000 + Math.random() * 900000000)}`,
      isVerified: true
    });

    // Reset fields
    setAmount('');
    setTitle('');
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative bg-surface-container-lowest rounded-2xl w-full max-w-lg shadow-2xl p-space-lg sm:p-space-xl z-10 flex flex-col max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-space-md border-b border-surface-container">
          <div className="flex items-center gap-space-xs">
            <div className="w-8 h-8 rounded-lg bg-primary-fixed/30 text-on-primary-fixed-variant flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
            </div>
            <span className="text-headline-sm text-on-surface font-bold">Add New Transaction</span>
          </div>
          <button 
            className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer" 
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Type Toggle */}
        <div className="bg-surface-container-low p-1 rounded-xl grid grid-cols-2 gap-1 my-space-md">
          <button 
            type="button"
            onClick={() => {
              setTxType('expense');
              if (category === 'Salary & Bonus') setCategory('Food & Groceries');
            }}
            className={`py-2 rounded-lg text-label-md text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer font-bold ${
              txType === 'expense'
                ? 'bg-surface-container-lowest text-error shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
            Expense
          </button>
          <button 
            type="button"
            onClick={() => {
              setTxType('income');
              setCategory('Salary & Bonus');
            }}
            className={`py-2 rounded-lg text-label-md text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer font-bold ${
              txType === 'income'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">call_received</span>
            Income
          </button>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-space-md" onSubmit={handleSubmit}>
          {/* Amount */}
          <div className="flex flex-col">
            <label className="text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold mb-1">
              Amount
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-headline-lg text-on-surface-variant font-bold pointer-events-none">
                ₹
              </span>
              <input 
                className="w-full bg-surface-container-low pl-10 pr-4 py-3 rounded-xl text-headline-lg text-on-surface font-bold focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container transition-all"
                placeholder="0.00" 
                required 
                step="any"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          {/* Title / Merchant */}
          <div className="flex flex-col">
            <label className="text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold mb-1">
              Title / Merchant
            </label>
            <input 
              className="bg-surface-container-low text-on-surface placeholder:text-on-surface-variant px-4 py-2.5 rounded-xl text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container transition-all"
              placeholder="e.g. Swiggy Gourmet, Nature's Basket, Client Payout" 
              required 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Category & Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div className="flex flex-col">
              <label className="text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold mb-1">
                Category
              </label>
              <div className="relative">
                <select 
                  className="w-full bg-surface-container-low text-on-surface px-4 py-2.5 rounded-xl text-body-md appearance-none focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container transition-all pr-10 cursor-pointer"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {txType === 'income' ? (
                    <>
                      <option value="Salary & Bonus">Salary &amp; Bonus</option>
                      <option value="Freelance & Consulting">Freelance &amp; Consulting</option>
                      <option value="Investments & Dividends">Investments &amp; Dividends</option>
                      <option value="Refunds & Reimbursements">Refunds &amp; Reimbursements</option>
                    </>
                  ) : (
                    <>
                      <option value="Housing & Rent">Housing &amp; Rent</option>
                      <option value="Food & Groceries">Food &amp; Groceries</option>
                      <option value="Transit & Commute">Transit &amp; Commute</option>
                      <option value="Utilities (BESCOM)">Utilities (BESCOM)</option>
                      <option value="Lifestyle & Leisure">Lifestyle &amp; Leisure</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Shopping">Shopping</option>
                    </>
                  )}
                </select>
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant absolute right-3 top-3 pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold mb-1">
                Date
              </label>
              <input 
                className="bg-surface-container-low text-on-surface px-4 py-2.5 rounded-xl text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container transition-all cursor-pointer"
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {/* Payment Method Account */}
          <div className="flex flex-col">
            <label className="text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold mb-1">
              Payment Method
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'HDFC Direct', val: 'HDFC Direct (..9012)' },
                { label: 'ICICI Coral', val: 'ICICI Coral (..4420)' },
                { label: 'UPI (GPay)', val: 'UPI (GPay / HDFC)' },
                { label: 'Petty Cash', val: 'Petty Cash Wallet' }
              ].map((acc) => (
                <button
                  type="button"
                  key={acc.val}
                  onClick={() => setAccount(acc.val)}
                  className={`p-2.5 rounded-xl text-center text-label-sm transition-all truncate cursor-pointer font-medium ${
                    account === acc.val
                      ? 'bg-primary-container text-on-primary-container font-semibold shadow-xs ring-1 ring-primary'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Note / Memo */}
          <div className="flex flex-col">
            <label className="text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold mb-1">
              Optional Note &amp; Tags
            </label>
            <textarea 
              className="bg-surface-container-low text-on-surface placeholder:text-on-surface-variant px-4 py-2 rounded-xl text-body-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container transition-all resize-none"
              placeholder="Add receipt reference, invoice ID or tags (#team, #client)..." 
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-space-sm pt-space-xs border-t border-surface-container">
            <button 
              className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-title-md hover:bg-surface-container-high transition-colors cursor-pointer" 
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button 
              className="px-5 py-2.5 rounded-xl bg-primary-container text-on-primary-container hover:bg-primary hover:text-white text-title-md font-semibold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95" 
              type="submit"
            >
              <span className="material-symbols-outlined text-[18px]">check</span>
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
