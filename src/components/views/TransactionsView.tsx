import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType } from '../../types/finance';

interface TransactionsViewProps {
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
  onOpenAddModal: () => void;
  onDeleteTransaction: (id: string) => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  onSelectTransaction,
  onOpenAddModal,
  onDeleteTransaction
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [activeTab, setActiveTab] = useState<'all' | 'income' | 'expense' | 'pending'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Compute summary stats
  const totalInflow = useMemo(() => 
    transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
    [transactions]
  );
  const totalOutflow = useMemo(() => 
    transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    [transactions]
  );
  const netRetained = totalInflow - totalOutflow;
  const retainedPercent = totalInflow > 0 ? Math.round((netRetained / totalInflow) * 100) : 0;

  // Filter logic
  const filteredList = useMemo(() => {
    return transactions.filter((t) => {
      // Tab filter
      if (activeTab === 'income' && t.type !== 'income') return false;
      if (activeTab === 'expense' && t.type !== 'expense') return false;
      if (activeTab === 'pending' && t.status !== 'Pending') return false;

      // Category filter
      if (selectedCategory && !t.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
        return false;
      }

      // Account filter
      if (selectedAccount !== 'all') {
        if (!t.account.toLowerCase().includes(selectedAccount.toLowerCase())) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesMerchant = t.merchant.toLowerCase().includes(q);
        const matchesNotes = t.notes?.toLowerCase().includes(q);
        const matchesRef = t.referenceId?.toLowerCase().includes(q);
        const matchesCat = t.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesMerchant && !matchesNotes && !matchesRef && !matchesCat) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, activeTab, selectedCategory, selectedAccount, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredList.length / pageSize) || 1;
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredList.slice(start, start + pageSize);
  }, [filteredList, currentPage, pageSize]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedList.map(t => t.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleExportCSV = () => {
    const rows = [
      ['Date', 'Time', 'Merchant', 'Details', 'Category', 'Account', 'Status', 'Type', 'Amount (INR)'],
      ...filteredList.map(t => [
        t.date,
        t.time,
        t.merchant,
        t.subtitle || '',
        t.category,
        t.account,
        t.status,
        t.type,
        t.amount.toString()
      ])
    ];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PennyWise_Transactions_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedIds.length} selected transaction(s)?`)) {
      selectedIds.forEach(id => onDeleteTransaction(id));
      setSelectedIds([]);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedAccount('all');
    setActiveTab('all');
    setCurrentPage(1);
  };

  const getCategoryColor = (cat: string) => {
    if (cat.includes('Salary')) return 'bg-primary';
    if (cat.includes('Housing') || cat.includes('Rent')) return 'bg-secondary';
    if (cat.includes('Food') || cat.includes('Groceries')) return 'bg-tertiary';
    if (cat.includes('Utilities')) return 'bg-tertiary-fixed-dim';
    if (cat.includes('Transit') || cat.includes('Fuel')) return 'bg-secondary-container';
    if (cat.includes('Subscriptions')) return 'bg-secondary';
    if (cat.includes('Healthcare')) return 'bg-error';
    return 'bg-tertiary-container';
  };

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Page Header & Ambient Tone */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md py-space-lg">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-label-sm uppercase tracking-wider text-primary font-semibold">Ledger &amp; Cashflow</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
            <span className="text-label-sm text-on-surface-variant">Live Synchronized</span>
          </div>
          <h1 className="text-headline-lg text-on-surface tracking-tight mt-1 font-bold">Transactions &amp; Records</h1>
          <p className="text-body-md text-on-surface-variant mt-0.5">Search, filter, categorize, and export your personal transactions.</p>
        </div>

        {/* Quick Action Hub */}
        <div className="flex items-center gap-space-sm flex-wrap">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-error/10 text-error hover:bg-error hover:text-white text-title-md px-3.5 py-2 rounded-xl transition-all flex items-center gap-1 cursor-pointer font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
              <span>Delete ({selectedIds.length})</span>
            </button>
          )}
          <button
            onClick={handleExportCSV}
            className="bg-surface-container-lowest text-on-surface hover:bg-surface-container text-title-md px-3.5 py-2 rounded-xl shadow-xs border border-surface-container flex items-center gap-space-xs transition-all duration-150 cursor-pointer font-semibold"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">download</span>
            <span>Export CSV</span>
          </button>
          <button
            onClick={onOpenAddModal}
            className="bg-primary-container text-on-primary-container hover:bg-primary hover:text-white text-title-md px-4 py-2 rounded-xl shadow-xs flex items-center gap-space-xs transition-all duration-150 cursor-pointer font-semibold"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Top Visual Stats Banner: 3 Metric Bento Cards + Mini Visual Cashflow Spark */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-gutter mb-space-lg">
        {/* Stat 1: Total Inflow */}
        <div className="lg:col-span-4 bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-surface-container flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:scale-125 transition-transform duration-300" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[18px]">arrow_downward_alt</span>
              </div>
              <span className="text-label-md uppercase tracking-wider text-on-surface-variant font-semibold">Total Inflow</span>
            </div>
            <span className="text-label-sm bg-surface-container px-2 py-0.5 rounded-full text-on-surface-variant font-medium">
              {transactions.filter(t => t.type === 'income').length} record(s)
            </span>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-display-lg text-primary tracking-tight font-bold">
                ₹{totalInflow.toLocaleString('en-IN')}
              </span>
              <span className="text-label-sm text-on-surface-variant">.00</span>
            </div>
            <span className="text-label-sm text-primary flex items-center font-semibold bg-surface-container-high/60 px-2 py-1 rounded-md">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> 100% Regular
            </span>
          </div>
        </div>

        {/* Stat 2: Total Outflow */}
        <div className="lg:col-span-4 bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-surface-container flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-error/5 rounded-full blur-xl group-hover:scale-125 transition-transform duration-300" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-error-container flex items-center justify-center text-on-error-container">
                <span className="material-symbols-outlined text-[18px]">arrow_upward_alt</span>
              </div>
              <span className="text-label-md uppercase tracking-wider text-on-surface-variant font-semibold">Total Outflow</span>
            </div>
            <span className="text-label-sm bg-surface-container px-2 py-0.5 rounded-full text-on-surface-variant font-medium">
              {transactions.filter(t => t.type === 'expense').length} records
            </span>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-display-lg text-on-surface tracking-tight font-bold">
                ₹{totalOutflow.toLocaleString('en-IN')}
              </span>
              <span className="text-label-sm text-on-surface-variant">.50</span>
            </div>
            <span className="text-label-sm text-error flex items-center font-semibold bg-error-container/60 px-2 py-1 rounded-md">
              <span className="material-symbols-outlined text-[14px]">south_east</span> 43.3% Burn
            </span>
          </div>
        </div>

        {/* Stat 3: Net Retained & Gauge */}
        <div className="lg:col-span-4 bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-surface-container flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-secondary/5 rounded-full blur-xl group-hover:scale-125 transition-transform duration-300" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
              </div>
              <span className="text-label-md uppercase tracking-wider text-on-surface-variant font-semibold">Net Retained</span>
            </div>
            <div className="flex items-center gap-1 text-label-sm text-primary font-bold bg-primary-fixed/40 px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-[13px]">verified</span>
              {retainedPercent}% Saved
            </div>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-display-lg text-on-surface tracking-tight font-bold">
                  ₹{netRetained.toLocaleString('en-IN')}
                </span>
                <span className="text-label-sm text-on-surface-variant">.00</span>
              </div>
              <span className="text-body-sm text-on-surface-variant">Surplus added to Liquidity</span>
            </div>
            {/* Inline Gauge */}
            <div className="w-12 h-12 relative flex items-center justify-center">
              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-surface-container"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                />
                <path
                  className="text-primary-container"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray={`${retainedPercent}, 100`}
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
              </svg>
              <span className="absolute text-[10px] font-bold text-on-surface">{retainedPercent}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter, Search, Account Chips Bar */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-container mb-space-md flex flex-col gap-space-md">
        {/* Filter Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-space-sm items-center">
          {/* Search Input */}
          <div className="md:col-span-5 relative flex items-center">
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant absolute left-3 pointer-events-none">
              search
            </span>
            <input
              className="w-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant text-body-sm pl-9 pr-8 py-2 rounded-xl focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary-container transition-all"
              placeholder="Search by merchant, note, or reference..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="material-symbols-outlined text-[16px] text-on-surface-variant absolute right-3 cursor-pointer hover:text-on-surface"
              >
                clear
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="md:col-span-2 relative">
            <select
              className="w-full bg-surface-container-low text-on-surface text-body-sm px-3 py-2 rounded-xl appearance-none focus:outline-none cursor-pointer"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="salary">Salary &amp; Income</option>
              <option value="housing">Housing &amp; Rent</option>
              <option value="food">Groceries &amp; Food</option>
              <option value="transit">Transit &amp; Fuel</option>
              <option value="utilities">Bills &amp; Utilities</option>
              <option value="lifestyle">Lifestyle &amp; Leisure</option>
              <option value="healthcare">Healthcare</option>
            </select>
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant absolute right-3 top-2.5 pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Account Filter */}
          <div className="md:col-span-2 relative">
            <select
              className="w-full bg-surface-container-low text-on-surface text-body-sm px-3 py-2 rounded-xl appearance-none focus:outline-none cursor-pointer"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
            >
              <option value="all">All Accounts</option>
              <option value="hdfc">HDFC Bank Salary</option>
              <option value="icici">ICICI Coral Credit</option>
              <option value="petty">Petty Cash Wallet</option>
              <option value="upi">UPI / GPay</option>
            </select>
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant absolute right-3 top-2.5 pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Date Range Picker */}
          <div className="md:col-span-3 relative flex items-center justify-between bg-surface-container-low px-3 py-2 rounded-xl cursor-pointer hover:bg-surface-container transition-colors">
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant shrink-0">calendar_month</span>
              <span className="text-label-md text-on-surface truncate">Oct 1, 2024 - Oct 31, 2024</span>
            </div>
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant shrink-0">tune</span>
          </div>
        </div>

        {/* Secondary Tabs & Active Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-space-sm pt-2">
          {/* Segmented Filter */}
          <div className="inline-flex bg-surface-container-low p-1 rounded-xl gap-1">
            <button
              onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-lg text-label-md transition-all cursor-pointer font-semibold ${
                activeTab === 'all'
                  ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
            >
              All Transactions <span className="ml-1 text-[11px] px-1.5 py-0.2 bg-surface-container rounded-full text-on-surface-variant font-bold">{transactions.length}</span>
            </button>
            <button
              onClick={() => { setActiveTab('income'); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-lg text-label-md transition-all cursor-pointer font-semibold ${
                activeTab === 'income'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
            >
              Income <span className="ml-1 text-[11px] px-1.5 py-0.2 bg-surface-container-high rounded-full text-primary font-bold">1</span>
            </button>
            <button
              onClick={() => { setActiveTab('expense'); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-lg text-label-md transition-all cursor-pointer font-semibold ${
                activeTab === 'expense'
                  ? 'bg-surface-container-lowest text-error shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
            >
              Expenses <span className="ml-1 text-[11px] px-1.5 py-0.2 bg-surface-container rounded-full text-on-surface-variant font-bold">{transactions.length - 1}</span>
            </button>
            <button
              onClick={() => { setActiveTab('pending'); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-lg text-label-md transition-all cursor-pointer font-semibold ${
                activeTab === 'pending'
                  ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
            >
              Pending <span className="ml-1 text-[11px] px-1.5 py-0.2 bg-surface-container rounded-full text-on-surface-variant">0</span>
            </button>
          </div>

          {/* Active Filter Pill */}
          <div className="flex items-center gap-space-xs text-on-surface-variant">
            <span className="text-label-sm">Active filter:</span>
            <span className="inline-flex items-center gap-1 bg-surface-container text-on-surface text-label-sm px-2.5 py-1 rounded-full font-medium">
              <span>This Month (October)</span>
            </span>
            {(searchQuery || selectedCategory || selectedAccount !== 'all' || activeTab !== 'all') && (
              <button
                onClick={handleResetFilters}
                className="text-primary text-label-sm font-semibold ml-2 hover:underline cursor-pointer"
                type="button"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Primary Ledger Data Table Card */}
      <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-label-sm uppercase tracking-wider border-b border-surface-container">
                <th className="py-3 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={paginatedList.length > 0 && selectedIds.length === paginatedList.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded accent-primary cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4 font-semibold">Date &amp; Time</th>
                <th className="py-3 px-4 font-semibold">Merchant / Details</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Account / Mode</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 text-right font-semibold">Amount</th>
                <th className="py-3 px-4 text-center font-semibold w-12">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container text-body-sm text-on-surface">
              {paginatedList.map((tx) => {
                const isInc = tx.type === 'income';
                const isSelected = selectedIds.includes(tx.id);
                return (
                  <tr
                    key={tx.id}
                    onClick={() => onSelectTransaction(tx)}
                    className={`hover:bg-surface-container-low transition-colors duration-150 cursor-pointer group ${
                      isSelected ? 'bg-primary/5' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleOne(tx.id)}
                        className="w-4 h-4 rounded accent-primary cursor-pointer"
                      />
                    </td>

                    {/* Date & Time */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                          isInc ? 'bg-primary-fixed/40 text-on-primary-fixed' : 'bg-surface-container text-on-surface-variant'
                        }`}>
                          {new Date(tx.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }).toUpperCase()}
                        </span>
                        <span className="text-on-surface-variant text-label-sm">{tx.time}</span>
                      </div>
                    </td>

                    {/* Merchant / Details */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isInc 
                            ? 'bg-surface-container text-primary group-hover:bg-primary-container group-hover:text-on-primary-container'
                            : 'bg-surface-container text-on-surface group-hover:bg-surface-container-high'
                        }`}>
                          <span className="material-symbols-outlined text-[20px]">
                            {isInc ? 'account_balance' : tx.category.includes('Housing') ? 'apartment' : tx.category.includes('Food') ? 'local_grocery_store' : tx.category.includes('Utilities') ? 'bolt' : tx.category.includes('Transit') ? 'directions_car' : tx.category.includes('Healthcare') ? 'medical_services' : 'shopping_bag'}
                          </span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-title-md text-on-surface font-semibold truncate">{tx.title}</span>
                            {tx.isVerified && (
                              <span className="material-symbols-outlined text-[14px] text-primary" title="Verified">verified</span>
                            )}
                            {tx.isRecurring && (
                              <span className="bg-surface-container px-1.5 py-0.2 rounded text-[10px] text-on-surface-variant font-semibold">Recurring</span>
                            )}
                            {tx.isAutoDebit && (
                              <span className="bg-surface-container px-1.5 py-0.2 rounded text-[10px] text-on-surface-variant font-semibold">Auto-Debit</span>
                            )}
                            {tx.hasReceipt && (
                              <span className="material-symbols-outlined text-[14px] text-on-surface-variant" title="Has receipt">receipt</span>
                            )}
                          </div>
                          <span className="text-body-sm text-on-surface-variant truncate">
                            {tx.subtitle || `${tx.category} • REF#${tx.referenceId?.slice(-6) || '88391'}`}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 bg-surface-container px-2.5 py-1 rounded-full text-on-surface text-label-md font-medium">
                        <span className={`w-1.5 h-1.5 rounded-full ${getCategoryColor(tx.category)}`} />
                        {tx.category}
                      </span>
                    </td>

                    {/* Account / Mode */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-body-sm">
                        <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                          {tx.account.includes('UPI') ? 'qr_code_2' : tx.account.includes('Coral') ? 'credit_card' : tx.account.includes('Cash') ? 'wallet' : 'account_balance'}
                        </span>
                        <span>{tx.account}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`text-label-sm font-semibold px-2 py-0.5 rounded-full ${
                        tx.status === 'Settled'
                          ? 'bg-surface-container-high text-primary'
                          : 'bg-surface-container text-on-surface'
                      }`}>
                        {tx.status}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4 text-right whitespace-nowrap font-bold text-title-md">
                      <span className={isInc ? 'text-primary' : 'text-on-surface'}>
                        {isInc ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectTransaction(tx)}
                        className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                        title="View details"
                      >
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="bg-surface-container-low px-space-md py-3 flex flex-col sm:flex-row items-center justify-between gap-space-sm border-t border-surface-container">
          <div className="flex items-center gap-2">
            <span className="text-body-sm text-on-surface-variant">
              Showing <span className="font-semibold text-on-surface">{Math.min((currentPage - 1) * pageSize + 1, filteredList.length)}</span> to{' '}
              <span className="font-semibold text-on-surface">{Math.min(currentPage * pageSize, filteredList.length)}</span> of{' '}
              <span className="font-semibold text-on-surface">{filteredList.length}</span> transactions
            </span>
            <span className="text-on-surface-variant">•</span>
            <select
              className="bg-surface-container-lowest text-on-surface text-label-sm px-2 py-1 rounded-md focus:outline-none border border-surface-container cursor-pointer"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container disabled:opacity-40 transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`w-8 h-8 rounded-lg text-label-md font-bold flex items-center justify-center transition-colors cursor-pointer ${
                  currentPage === num
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
                type="button"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container disabled:opacity-40 transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
