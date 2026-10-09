import React, { useState } from 'react';
import { Transaction, CategoryBreakdown } from '../../types/finance';
import { NavTab } from '../Sidebar';

interface DashboardViewProps {
  transactions: Transaction[];
  categories: CategoryBreakdown[];
  onSelectTab: (tab: NavTab) => void;
  onSelectTransaction: (tx: Transaction) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  transactions,
  categories,
  onSelectTab,
  onSelectTransaction
}) => {
  const [period, setPeriod] = useState<'7D' | '30D' | '3M' | '1Y'>('30D');
  const [recentFilter, setRecentFilter] = useState<'all' | 'expense' | 'income'>('all');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(300);

  // Compute values
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = 142550; // Reconciled balance across 3 accounts
  const budgetCap = 50000;
  const remainingBudget = Math.max(0, budgetCap - totalExpense);
  const budgetPercent = ((totalExpense / budgetCap) * 100).toFixed(1);

  const [chartType, setChartType] = useState<'bar' | 'donut'>('bar');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const breakdownCategories = [
    { id: 'cat-housing', name: 'Housing', short: 'Housing', amount: 18000, percentage: 55, color: '#006c49', icon: 'apartment' },
    { id: 'cat-food', name: 'Food & Dining', short: 'Dining', amount: 5800, percentage: 18, color: '#e29100', icon: 'restaurant' },
    { id: 'cat-transit', name: 'Transportation', short: 'Transit', amount: 3200, percentage: 10, color: '#4648d4', icon: 'directions_car' },
    { id: 'cat-utilities', name: 'Utilities', short: 'Utilities', amount: 2650, percentage: 8, color: '#6063ee', icon: 'bolt' },
    { id: 'cat-other', name: 'Entertainment & Others', short: 'Others', amount: 2800, percentage: 9, color: '#ba1a1a', icon: 'movie' },
  ];

  const maxPercentage = Math.max(...breakdownCategories.map(c => c.percentage));

  // Filter recent transactions
  const recentTx = transactions
    .filter(t => {
      if (recentFilter === 'income') return t.type === 'income';
      if (recentFilter === 'expense') return t.type === 'expense';
      return true;
    })
    .slice(0, 6);

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Row 1: KPI Financial Metric Tiles (4-column grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-space-xl">
        {/* Tile 1: Total Balance */}
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs hover:shadow-md transition-shadow duration-200 border border-surface-container flex flex-col justify-between">
          <div className="flex items-center justify-between mb-space-sm">
            <span className="text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
              Total Balance
            </span>
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
            </div>
          </div>
          <div>
            <div className="text-display-lg text-on-surface font-bold tracking-tight mb-space-xs">
              ₹{totalBalance.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-space-xs">
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-primary-fixed/30 text-on-primary-fixed-variant text-label-md font-semibold">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                +12.4%
              </span>
              <span className="text-body-sm text-on-surface-variant truncate">
                vs last month · 3 accounts
              </span>
            </div>
          </div>
        </div>

        {/* Tile 2: Total Income */}
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs hover:shadow-md transition-shadow duration-200 border border-surface-container flex flex-col justify-between">
          <div className="flex items-center justify-between mb-space-sm">
            <span className="text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
              Total Income
            </span>
            <div className="w-8 h-8 rounded-lg bg-primary-fixed/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">arrow_downward_alt</span>
            </div>
          </div>
          <div>
            <div className="text-display-lg text-on-surface font-bold tracking-tight mb-space-xs">
              ₹{totalIncome.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-space-xs">
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-primary-fixed/30 text-on-primary-fixed-variant text-label-md font-semibold">
                <span className="material-symbols-outlined text-[14px]">north_east</span>
                +5.0%
              </span>
              <span className="text-body-sm text-on-surface-variant truncate">
                Salary &amp; Investments
              </span>
            </div>
          </div>
        </div>

        {/* Tile 3: Total Expenses */}
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs hover:shadow-md transition-shadow duration-200 border border-surface-container flex flex-col justify-between">
          <div className="flex items-center justify-between mb-space-sm">
            <span className="text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
              Total Expenses
            </span>
            <div className="w-8 h-8 rounded-lg bg-error-container/40 flex items-center justify-center text-error">
              <span className="material-symbols-outlined text-[18px]">arrow_upward_alt</span>
            </div>
          </div>
          <div>
            <div className="text-display-lg text-on-surface font-bold tracking-tight mb-space-xs">
              ₹{totalExpense.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-space-xs">
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-label-md font-semibold">
                <span className="material-symbols-outlined text-[14px]">south_east</span>
                -8.2%
              </span>
              <span className="text-body-sm text-on-surface-variant truncate">
                Spent this month
              </span>
            </div>
          </div>
        </div>

        {/* Tile 4: Remaining Budget */}
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs hover:shadow-md transition-shadow duration-200 border border-surface-container flex flex-col justify-between">
          <div className="flex items-center justify-between mb-space-sm">
            <span className="text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
              Remaining Budget
            </span>
            <div className="w-8 h-8 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[18px]">savings</span>
            </div>
          </div>
          <div>
            <div className="text-display-lg text-on-surface font-bold tracking-tight mb-space-xs">
              ₹{remainingBudget.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-space-xs">
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-container text-label-md font-semibold">
                {budgetPercent}% used
              </span>
              <span className="text-body-sm text-on-surface-variant truncate">
                Cap: ₹50,000
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: 2-Column Core Dashboard Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* LEFT COLUMN (8 cols): Charts & Detailed Transaction Feed */}
        <div className="lg:col-span-8 flex flex-col gap-space-xl">
          {/* Interactive Cashflow Area Chart Card */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs border border-surface-container flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-lg">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-title-md text-on-surface font-semibold">Cashflow Overview</span>
                  <span className="px-2 py-0.5 rounded-full bg-primary-fixed/20 text-on-primary-fixed-variant text-label-sm font-semibold">
                    Live Trend
                  </span>
                </div>
                <p className="text-body-sm text-on-surface-variant">Income versus expenditures across October</p>
              </div>

              {/* Period Selector Tabs */}
              <div className="bg-surface-container-low p-1 rounded-xl flex items-center text-on-surface-variant border border-surface-container">
                {(['7D', '30D', '3M', '1Y'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-1 text-label-md rounded-lg transition-all cursor-pointer font-semibold ${
                      period === p
                        ? 'bg-surface-container-lowest text-primary shadow-xs'
                        : 'hover:text-on-surface'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Metric Indicator Pills */}
            <div className="flex items-center gap-space-md mb-space-md flex-wrap">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary-container" />
                <span className="text-label-md text-on-surface font-medium">Income: ₹75,000</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-error" />
                <span className="text-label-md text-on-surface font-medium">Expense: ₹32,450</span>
              </div>
              <div className="flex items-center gap-2 ml-auto text-on-surface-variant text-label-sm">
                <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                Reconciled with 2 Banks
              </div>
            </div>

            {/* SVG Chart Container */}
            <div className="relative w-full h-64 bg-surface-container-low/40 rounded-xl p-4 flex flex-col justify-end overflow-hidden border border-surface-container">
              <svg className="w-full h-full overflow-visible" fill="none" preserveAspectRatio="none" viewBox="0 0 600 180">
                <defs>
                  <linearGradient id="dashIncomeGrad" x1="0%" x2="0%" y1="0%" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="dashExpenseGrad" x1="0%" x2="0%" y1="0%" y2="1">
                    <stop offset="0%" stopColor="#ba1a1a" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#ba1a1a" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Gridlines */}
                <line stroke="#dae2fd" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="600" y1="30" y2="30" />
                <line stroke="#dae2fd" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="600" y1="80" y2="80" />
                <line stroke="#dae2fd" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="600" y1="130" y2="130" />

                {/* Income Shaded Area & Line */}
                <path d="M 0,140 Q 80,135 150,130 T 300,30 T 450,45 T 600,60 L 600,180 L 0,180 Z" fill="url(#dashIncomeGrad)" />
                <path d="M 0,140 Q 80,135 150,130 T 300,30 T 450,45 T 600,60" fill="none" stroke="#10b981" strokeLinecap="round" strokeWidth="2.5" />

                {/* Expense Shaded Area & Line */}
                <path d="M 0,160 Q 90,140 180,110 T 300,115 T 440,90 T 600,105 L 600,180 L 0,180 Z" fill="url(#dashExpenseGrad)" />
                <path d="M 0,160 Q 90,140 180,110 T 300,115 T 440,90 T 600,105" fill="none" stroke="#ba1a1a" strokeLinecap="round" strokeWidth="2.5" />

                {/* Indicator Line on Oct 15 */}
                {hoveredPoint && (
                  <>
                    <line stroke="#6063ee" strokeDasharray="3 3" strokeWidth="1.5" x1={hoveredPoint} x2={hoveredPoint} y1="0" y2="180" />
                    <circle cx={hoveredPoint} cy="30" fill="#10b981" r="5" stroke="#ffffff" strokeWidth="2" />
                    <circle cx={hoveredPoint} cy="115" fill="#ba1a1a" r="5" stroke="#ffffff" strokeWidth="2" />
                  </>
                )}
              </svg>

              {/* Floating Tooltip Marker at Oct 15 */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-3 py-1.5 rounded-lg shadow-xl pointer-events-none flex flex-col gap-0.5 border border-surface-container-highest/20">
                <span className="text-[11px] text-surface-dim uppercase font-semibold">15 Oct 2024</span>
                <div className="flex items-center gap-3 text-label-md">
                  <span className="text-primary-fixed-dim font-bold">Income ₹75,000</span>
                  <span className="text-surface-dim">|</span>
                  <span className="text-error-container font-bold">Expense ₹4,200</span>
                </div>
              </div>

              {/* X-Axis Labels */}
              <div className="w-full flex justify-between pt-2 text-on-surface-variant text-label-sm select-none">
                <span>01 Oct</span>
                <span>06 Oct</span>
                <span>12 Oct</span>
                <span className="font-bold text-secondary">15 Oct (Peak)</span>
                <span>20 Oct</span>
                <span>24 Oct (Today)</span>
              </div>
            </div>
          </div>

          {/* Recent Transactions Table Card */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs border border-surface-container flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md">
              <div className="flex items-center gap-space-sm">
                <span className="text-headline-sm text-on-surface font-bold">Recent Transactions</span>
                <span className="bg-surface-container px-2 py-0.5 rounded-full text-label-sm text-on-surface-variant font-medium">
                  {recentTx.length} items
                </span>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-space-xs">
                <div className="bg-surface-container-low p-1 rounded-xl flex items-center border border-surface-container">
                  {(['all', 'expense', 'income'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setRecentFilter(cat)}
                      className={`px-3 py-1 text-label-md rounded-lg transition-all cursor-pointer capitalize font-semibold ${
                        recentFilter === cat
                          ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {cat === 'all' ? 'All' : cat === 'expense' ? 'Expenses' : 'Income'}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => onSelectTab('transactions')}
                  className="text-label-md text-primary font-semibold hover:underline px-2 py-1 flex items-center gap-0.5 cursor-pointer"
                >
                  View All <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Ledger Table */}
            <div className="overflow-x-auto -mx-space-lg px-space-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/60 text-on-surface-variant text-label-sm uppercase tracking-wider">
                    <th className="py-3 px-4 rounded-l-xl">Merchant &amp; Description</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Payment Method</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4 rounded-r-xl text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-0 text-body-sm">
                  {recentTx.map((tx) => {
                    const isInc = tx.type === 'income';
                    return (
                      <tr 
                        key={tx.id} 
                        onClick={() => onSelectTransaction(tx)}
                        className="hover:bg-surface-container-low/50 transition-colors group cursor-pointer"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              isInc ? 'bg-primary-fixed/30 text-on-primary-fixed-variant' : 'bg-surface-container text-on-surface'
                            }`}>
                              <span className="material-symbols-outlined text-[20px]">
                                {isInc ? 'domain' : tx.category.includes('Housing') ? 'home' : tx.category.includes('Groceries') ? 'shopping_cart' : tx.category.includes('Utilities') ? 'bolt' : tx.category.includes('Food') ? 'restaurant' : 'subscriptions'}
                              </span>
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-title-md text-on-surface font-semibold truncate">{tx.title}</span>
                              <span className="text-body-sm text-on-surface-variant truncate">{tx.subtitle || tx.category}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface text-label-sm font-medium">
                            {tx.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-on-surface-variant whitespace-nowrap">{tx.account}</td>
                        <td className="py-3 px-4 text-on-surface-variant whitespace-nowrap">{tx.date}</td>
                        <td className="py-3 px-4 text-right font-bold text-title-md whitespace-nowrap">
                          <span className={isInc ? 'text-primary' : 'text-error'}>
                            {isInc ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => onSelectTransaction(tx)}
                              className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                              title="View Receipt"
                            >
                              <span className="material-symbols-outlined text-[18px]">receipt</span>
                            </button>
                            <button
                              onClick={() => onSelectTransaction(tx)}
                              className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <span className="material-symbols-outlined text-[18px]">edit</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (4 cols): Category Breakdown, Budget Thermometer & Smart Insights */}
        <div className="lg:col-span-4 flex flex-col gap-space-xl">
          {/* Expense Category Breakdown Card */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs border border-surface-container flex flex-col">
            <div className="flex items-center justify-between mb-space-md">
              <div>
                <span className="text-title-md text-on-surface font-semibold">Expense Breakdown</span>
                <p className="text-body-sm text-on-surface-variant">Distribution by category</p>
              </div>
              <div className="flex items-center gap-2">
                {/* Chart view toggle */}
                <div className="bg-surface-container-low p-0.5 rounded-lg flex items-center border border-surface-container">
                  <button
                    onClick={() => setChartType('bar')}
                    className={`p-1 rounded-md transition-colors cursor-pointer ${
                      chartType === 'bar'
                        ? 'bg-surface-container-lowest text-primary shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                    title="Bar Plot View"
                  >
                    <span className="material-symbols-outlined text-[16px]">bar_chart</span>
                  </button>
                  <button
                    onClick={() => setChartType('donut')}
                    className={`p-1 rounded-md transition-colors cursor-pointer ${
                      chartType === 'donut'
                        ? 'bg-surface-container-lowest text-primary shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                    title="Donut Chart View"
                  >
                    <span className="material-symbols-outlined text-[16px]">donut_large</span>
                  </button>
                </div>
                <span className="text-label-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded font-medium">
                  This Month
                </span>
              </div>
            </div>

            {/* Total Spent Badge */}
            <div className="flex items-center justify-between bg-surface-container-low/70 px-3.5 py-2.5 rounded-xl mb-3 border border-surface-container">
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">Total Spent</span>
                <span className="text-title-md font-bold text-on-surface">₹32,450</span>
              </div>
              <span className="bg-primary/10 text-primary text-label-sm font-semibold px-2 py-0.5 rounded-full">
                84.2% budget
              </span>
            </div>

            {chartType === 'bar' ? (
              /* High-Craft Bar Plot */
              <div className="relative my-space-sm bg-surface-container-low/30 rounded-xl p-3 border border-surface-container/60">
                {/* Tooltip on active hover */}
                {hoveredCategory && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-2.5 py-1 rounded-lg text-xs shadow-md z-10 pointer-events-none animate-in fade-in duration-100 flex items-center gap-1.5 whitespace-nowrap">
                    <span className="font-semibold">{hoveredCategory}</span>
                    <span>•</span>
                    <span className="text-primary-fixed-dim font-bold">
                      ₹{breakdownCategories.find(c => c.name === hoveredCategory)?.amount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-surface-dim">
                      ({breakdownCategories.find(c => c.name === hoveredCategory)?.percentage}%)
                    </span>
                  </div>
                )}

                {/* Vertical Bar Plot Columns */}
                <div className="relative h-44 w-full flex items-end justify-between gap-2 pt-6 pb-1 px-1">
                  {/* Subtle Gridlines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30 py-6">
                    <div className="border-b border-surface-container border-dashed w-full" />
                    <div className="border-b border-surface-container border-dashed w-full" />
                    <div className="border-b border-surface-container border-dashed w-full" />
                  </div>

                  {breakdownCategories.map((cat) => {
                    const heightPercent = Math.max(12, Math.round((cat.percentage / maxPercentage) * 100));
                    const isHovered = hoveredCategory === cat.name;

                    return (
                      <div
                        key={cat.id}
                        onMouseEnter={() => setHoveredCategory(cat.name)}
                        onMouseLeave={() => setHoveredCategory(null)}
                        className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer z-10"
                      >
                        {/* Percentage Label */}
                        <span className={`text-[11px] font-bold mb-1.5 transition-all ${
                          isHovered ? 'scale-110 text-on-surface' : 'text-on-surface-variant'
                        }`}>
                          {cat.percentage}%
                        </span>

                        {/* Bar Body */}
                        <div className="w-full max-w-[36px] bg-surface-container-high/60 rounded-t-lg h-full flex flex-col justify-end p-0.5 overflow-hidden">
                          <div
                            className={`w-full rounded-t-md transition-all duration-500 shadow-xs ${
                              isHovered ? 'brightness-110 ring-2 ring-white/50' : 'opacity-95'
                            }`}
                            style={{
                              height: `${heightPercent}%`,
                              backgroundColor: cat.color
                            }}
                          />
                        </div>

                        {/* Category Label below Bar */}
                        <div className="mt-2 text-center flex flex-col items-center">
                          <span className={`text-[11px] font-semibold transition-colors truncate max-w-[48px] ${
                            isHovered ? 'text-primary font-bold' : 'text-on-surface-variant'
                          }`}>
                            {cat.short}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Donut Visual */
              <div className="relative flex items-center justify-center my-space-sm">
                <svg className="w-44 h-44 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" fill="none" r="38" stroke="#f2f3ff" strokeWidth="12" />
                  <circle cx="50" cy="50" fill="none" r="38" stroke="#006c49" strokeDasharray="131.3 238.76" strokeDashoffset="0" strokeWidth="12" />
                  <circle cx="50" cy="50" fill="none" r="38" stroke="#e29100" strokeDasharray="42.9 238.76" strokeDashoffset="-131.3" strokeWidth="12" />
                  <circle cx="50" cy="50" fill="none" r="38" stroke="#4648d4" strokeDasharray="23.8 238.76" strokeDashoffset="-174.2" strokeWidth="12" />
                  <circle cx="50" cy="50" fill="none" r="38" stroke="#6063ee" strokeDasharray="19.1 238.76" strokeDashoffset="-198.0" strokeWidth="12" />
                  <circle cx="50" cy="50" fill="none" r="38" stroke="#ba1a1a" strokeDasharray="21.5 238.76" strokeDashoffset="-217.1" strokeWidth="12" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <span className="text-label-sm text-on-surface-variant font-medium">Total Spent</span>
                  <span className="text-headline-sm text-on-surface font-bold">₹32,450</span>
                </div>
              </div>
            )}

            {/* Category Legend with Interactive Highlight */}
            <div className="flex flex-col gap-2 mt-space-sm">
              {breakdownCategories.map((cat) => {
                const isHovered = hoveredCategory === cat.name;

                return (
                  <div
                    key={cat.id}
                    onMouseEnter={() => setHoveredCategory(cat.name)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    className={`flex items-center justify-between text-body-sm p-1.5 rounded-lg transition-colors cursor-pointer ${
                      isHovered ? 'bg-surface-container' : 'hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-3 h-3 rounded shrink-0 transition-transform"
                        style={{
                          backgroundColor: cat.color,
                          transform: isHovered ? 'scale(1.25)' : 'scale(1)'
                        }}
                      />
                      <span className="text-on-surface font-medium truncate">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-label-md shrink-0">
                      <span className="text-on-surface font-semibold">₹{cat.amount.toLocaleString('en-IN')}</span>
                      <span className="text-on-surface-variant font-normal">{cat.percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly Budget Progress Card */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs border border-surface-container flex flex-col">
            <div className="flex items-center justify-between mb-space-xs">
              <span className="text-title-md text-on-surface font-semibold">Monthly Budget Cap</span>
              <span className="text-label-md text-on-surface font-bold">{budgetPercent}%</span>
            </div>
            <div className="flex items-baseline justify-between mb-space-sm">
              <span className="text-headline-sm font-bold text-on-surface">
                ₹{totalExpense.toLocaleString('en-IN')}{' '}
                <span className="text-body-sm text-on-surface-variant font-normal">/ ₹50,000</span>
              </span>
              <span className="text-label-sm text-primary font-semibold">
                ₹{remainingBudget.toLocaleString('en-IN')} Left
              </span>
            </div>
            <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden mb-space-sm relative">
              <div
                className="h-full bg-primary-container rounded-full transition-all duration-500"
                style={{ width: `${budgetPercent}%` }}
              />
            </div>
            <div className="bg-surface-container-low rounded-xl p-3 flex items-start gap-2.5 mt-space-xs border border-surface-container">
              <span className="material-symbols-outlined text-[18px] text-tertiary-container shrink-0 mt-0.5">
                schedule
              </span>
              <span className="text-body-sm text-on-surface">
                You have used <strong className="text-on-surface font-semibold">65%</strong> of your monthly budget with <span className="text-secondary font-semibold">8 days</span> remaining in October.
              </span>
            </div>
          </div>

          {/* Smart Financial Insights Cards */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs border border-surface-container flex flex-col">
            <div className="flex items-center justify-between mb-space-md">
              <span className="text-title-md text-on-surface font-semibold">Smart Insights</span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-sm font-semibold">
                AI Powered
              </span>
            </div>
            <div className="flex flex-col gap-space-sm">
              <div 
                onClick={() => onSelectTab('analytics')}
                className="p-3 rounded-xl bg-primary-fixed/20 flex items-start gap-3 transition-transform hover:translate-x-1 duration-150 cursor-pointer border border-primary-fixed/30"
              >
                <span className="text-xl leading-none">💡</span>
                <div className="flex flex-col">
                  <span className="text-label-md text-on-primary-fixed font-semibold">Dining Expenditure Reduced</span>
                  <p className="text-body-sm text-on-surface-variant">
                    You spent <strong className="text-primary font-semibold">12% less</strong> on dining out compared to September. Great pacing!
                  </p>
                </div>
              </div>

              <div 
                onClick={() => onSelectTab('recurring-payments')}
                className="p-3 rounded-xl bg-surface-container-low flex items-start gap-3 transition-transform hover:translate-x-1 duration-150 cursor-pointer border border-surface-container"
              >
                <span className="text-xl leading-none">⚡</span>
                <div className="flex flex-col">
                  <span className="text-label-md text-on-surface font-semibold">Upcoming Recurring Bill</span>
                  <p className="text-body-sm text-on-surface-variant">
                    <strong className="text-on-surface font-semibold">Tata Play Fiber (₹999)</strong> auto-debit scheduled in 4 days.
                  </p>
                </div>
              </div>

              <div 
                onClick={() => onSelectTab('savings-goals')}
                className="p-3 rounded-xl bg-secondary-fixed/30 flex items-start gap-3 transition-transform hover:translate-x-1 duration-150 cursor-pointer border border-secondary-fixed/40"
              >
                <span className="text-xl leading-none">🎯</span>
                <div className="flex flex-col">
                  <span className="text-label-md text-on-secondary-fixed font-semibold">Emergency Fund Pace</span>
                  <p className="text-body-sm text-on-surface-variant">
                    Emergency Fund goal reached <strong className="text-secondary font-semibold">68% milestone</strong> (₹1,36,000 / ₹2,00,000).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
