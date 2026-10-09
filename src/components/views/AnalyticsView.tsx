import React, { useState } from 'react';
import { Transaction, CategoryBreakdown } from '../../types/finance';

interface AnalyticsViewProps {
  transactions: Transaction[];
  categories: CategoryBreakdown[];
  onOpenCategoryCaps: () => void;
  onOpenSubscriptionsAudit: () => void;
  onCreateGoalRule: () => void;
  onSelectTransaction: (tx: Transaction) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  transactions,
  categories,
  onOpenCategoryCaps,
  onOpenSubscriptionsAudit,
  onCreateGoalRule,
  onSelectTransaction
}) => {
  const [timeframe, setTimeframe] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Yearly' | 'Custom'>('Monthly');
  const [exportOpen, setExportOpen] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [chartType, setChartType] = useState<'bar' | 'donut'>('bar');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Compute live metrics based on transactions
  const totalInflow = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOutflow = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = totalInflow - totalOutflow;
  const savingsRate = totalInflow > 0 ? ((netSavings / totalInflow) * 100).toFixed(1) : '0';
  const averageDailySpend = Math.round(totalOutflow / 24); // Day 24 of month

  const handleExportPDF = () => {
    setExportOpen(false);
    const content = `PennyWise Financial Statement - October 2024\nTotal Inflow: ₹${totalInflow.toLocaleString('en-IN')}\nTotal Outflow: ₹${totalOutflow.toLocaleString('en-IN')}\nNet Surplus: ₹${netSavings.toLocaleString('en-IN')}\nSavings Rate: ${savingsRate}%\nGenerated on: ${new Date().toLocaleDateString()}`;
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PennyWise_October_Statement.pdf`;
    a.click();
  };

  const handleExportExcel = () => {
    setExportOpen(false);
    const rows = [
      ['Date', 'Title', 'Category', 'Account', 'Type', 'Amount (INR)'],
      ...transactions.map(t => [t.date, t.title, t.category, t.account, t.type, t.amount.toString()])
    ];
    const csvContent = rows.map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PennyWise_Ledger_October_2024.csv`;
    a.click();
  };

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Sub-Header & Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md mb-space-lg">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-xs">
            <span className="text-headline-lg text-on-surface font-semibold tracking-tight">Financial Analytics</span>
            <span className="bg-primary/10 text-primary text-label-sm px-2 py-0.5 rounded-full font-semibold">
              Live Real-time
            </span>
          </div>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Deep-dive liquidity modeling, outflow velocity, and algorithmic advisory for October 2024
          </p>
        </div>

        {/* Filters and Export Actions */}
        <div className="flex flex-wrap items-center gap-space-sm">
          <div className="bg-surface-container p-1 rounded-xl flex items-center shadow-xs">
            {(['Daily', 'Weekly', 'Monthly', 'Yearly', 'Custom'] as const).map((period) => {
              const isSelected = timeframe === period;
              return (
                <button
                  key={period}
                  onClick={() => setTimeframe(period)}
                  className={`px-3 py-1.5 rounded-lg text-label-md transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold flex items-center gap-1.5'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  type="button"
                >
                  <span>{period === 'Monthly' ? 'Monthly (Oct 2024)' : period}</span>
                  {isSelected && period === 'Monthly' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
                  )}
                  {period === 'Custom' && (
                    <span className="material-symbols-outlined text-[14px]">tune</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Export Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setExportOpen(!exportOpen)}
              className="bg-surface-container-lowest hover:bg-surface-container text-on-surface shadow-xs text-title-md px-3.5 py-2 rounded-xl flex items-center gap-space-xs transition-all cursor-pointer border border-surface-container"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">ios_share</span>
              <span className="text-label-md font-semibold">Export Report</span>
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span>
            </button>

            {exportOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-52 bg-surface-container-lowest rounded-xl shadow-xl py-1.5 z-20 border border-surface-container">
                <button
                  onClick={handleExportPDF}
                  className="w-full text-left px-3.5 py-2 text-body-sm text-on-surface hover:bg-surface-container flex items-center gap-2 cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px] text-error">picture_as_pdf</span>
                  <span>Export Statement (PDF)</span>
                </button>
                <button
                  onClick={handleExportExcel}
                  className="w-full text-left px-3.5 py-2 text-body-sm text-on-surface hover:bg-surface-container flex items-center gap-2 cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">table_chart</span>
                  <span>Export Raw Ledger (CSV)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Executive Metric Tiles (4-up Bento Strip) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md mb-space-lg">
        {/* Tile 1: Savings Rate */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-container relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Savings Rate</span>
            <span className="bg-primary/10 text-primary p-1.5 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">account_balance</span>
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-display-lg text-on-surface font-bold tracking-tight">{savingsRate}%</span>
              <span className="inline-flex items-center text-primary text-label-md font-semibold">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>+4.2%
              </span>
            </div>
            <div className="flex items-center justify-between text-body-sm text-on-surface-variant mt-2">
              <span>Target: 50.0%</span>
              <span className="text-primary font-semibold">Surplus by +6.7%</span>
            </div>
          </div>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(Number(savingsRate), 100)}%` }}></div>
          </div>
        </div>

        {/* Tile 2: Average Daily Spend */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-container relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Average Daily Spend</span>
            <span className="bg-secondary-fixed/50 text-secondary p-1.5 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-display-lg text-on-surface font-bold tracking-tight">₹{averageDailySpend.toLocaleString('en-IN')}</span>
              <span className="text-body-sm text-on-surface-variant">/ day</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="bg-primary/10 text-primary text-label-sm px-1.5 py-0.5 rounded font-semibold flex items-center">
                <span className="material-symbols-outlined text-[14px]">arrow_downward</span> 15%
              </span>
              <span className="text-body-sm text-on-surface-variant">vs ₹1,230 last month</span>
            </div>
          </div>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-secondary h-full rounded-full" style={{ width: '72%' }}></div>
          </div>
        </div>

        {/* Tile 3: Top Expense Category */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-container relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Top Outflow Category</span>
            <span className="bg-tertiary-fixed text-tertiary p-1.5 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">home_work</span>
            </span>
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-headline-lg text-on-surface font-bold tracking-tight truncate">Housing</span>
              <span className="text-numeric-metric text-on-surface font-bold">55.4%</span>
            </div>
            <p className="text-body-sm text-on-surface-variant mt-2">₹18,000 of total ₹{totalOutflow.toLocaleString('en-IN')} spent</p>
          </div>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-tertiary-container h-full rounded-full" style={{ width: '55.4%' }}></div>
          </div>
        </div>

        {/* Tile 4: Largest Single Outflow */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-container relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Largest Outflow</span>
            <span className="bg-error-container text-on-error-container p-1.5 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">north_east</span>
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-display-lg text-on-surface font-bold tracking-tight">₹18,000</span>
            </div>
            <div className="flex items-center justify-between text-body-sm text-on-surface-variant mt-2">
              <span className="truncate font-medium text-on-surface">Prestige Greenwoods</span>
              <span className="text-on-surface-variant shrink-0">Oct 2</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-on-surface-variant text-[11px] mt-3">
            <span className="bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">Monthly Recurring</span>
            <span className="text-primary font-semibold">NEFT Verified</span>
          </div>
        </div>
      </div>

      {/* Primary Analytic Visualizations Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg mb-space-lg">
        {/* Section 1: Cash Flow Trends 6-Month Comparison (8 Columns) */}
        <div className="xl:col-span-8 bg-surface-container-lowest rounded-2xl p-space-lg shadow-xs border border-surface-container flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md">
            <div>
              <h2 className="text-headline-md text-on-surface font-bold">Cash Flow Trajectory</h2>
              <p className="text-body-sm text-on-surface-variant">6-Month Inflow vs Outflow with dynamic net liquidity delta</p>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-space-md self-start sm:self-auto">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-primary-container" />
                <span className="text-label-sm text-on-surface">Income</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-error" />
                <span className="text-label-sm text-on-surface">Expenses</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-primary/20" />
                <span className="text-label-sm text-on-surface">Net Surplus</span>
              </div>
            </div>
          </div>

          {/* SVG Cash Flow Graph */}
          <div className="relative w-full h-72 flex flex-col justify-end">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 760 220">
              <defs>
                <linearGradient id="analyticsSavingsGlow" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                </linearGradient>
                <linearGradient id="analyticsExpenseGlow" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#ba1a1a" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#ba1a1a" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Horizontal Grid Lines */}
              <line stroke="#dae2fd" strokeDasharray="3 3" strokeOpacity="0.5" x1="0" x2="760" y1="20" y2="20" />
              <line stroke="#dae2fd" strokeDasharray="3 3" strokeOpacity="0.5" x1="0" x2="760" y1="70" y2="70" />
              <line stroke="#dae2fd" strokeDasharray="3 3" strokeOpacity="0.5" x1="0" x2="760" y1="120" y2="120" />
              <line stroke="#dae2fd" strokeDasharray="3 3" strokeOpacity="0.5" x1="0" x2="760" y1="170" y2="170" />

              {/* Shaded Area Between Income and Expense */}
              <polygon fill="url(#analyticsSavingsGlow)" points="40,110 180,95 320,80 460,70 600,55 740,35 740,112 600,122 460,130 320,135 180,140 40,145" />
              <polygon fill="url(#analyticsExpenseGlow)" points="40,145 180,140 320,135 460,130 600,122 740,112 740,210 40,210" />

              {/* Income Line */}
              <path d="M 40,110 C 110,105 130,98 180,95 C 250,90 270,82 320,80 C 390,75 410,72 460,70 C 530,65 550,58 600,55 C 670,45 690,38 740,35" fill="none" stroke="#10b981" strokeLinecap="round" strokeWidth="3.5" />
              {/* Expense Line */}
              <path d="M 40,145 C 110,142 130,141 180,140 C 250,138 270,136 320,135 C 390,132 410,131 460,130 C 530,128 550,124 600,122 C 670,118 690,114 740,112" fill="none" stroke="#ba1a1a" strokeDasharray="4 2" strokeLinecap="round" strokeWidth="2.5" />

              {/* Points for Oct Data Highlight */}
              <circle cx="740" cy="35" fill="#10b981" r="5.5" />
              <circle cx="740" cy="35" fill="#ffffff" r="2.5" />
              <circle cx="740" cy="112" fill="#ba1a1a" r="5" />
              <circle cx="740" cy="112" fill="#ffffff" r="2" />

              {/* Annotation Callout on Oct */}
              <rect fill="#131b2e" height="24" rx="6" width="110" x="620" y="10" />
              <text fill="#ffffff" fontFamily="Inter" fontSize="11" fontWeight="600" textAnchor="middle" x="675" y="26">+₹42,550 Net</text>
            </svg>

            {/* X-Axis Labels */}
            <div className="flex justify-between items-center text-on-surface-variant text-label-md pt-3">
              <div className="text-center">
                <span className="block text-on-surface font-semibold">May</span>
                <span className="text-[10px] text-on-surface-variant">₹62k / ₹38k</span>
              </div>
              <div className="text-center">
                <span className="block text-on-surface font-semibold">Jun</span>
                <span className="text-[10px] text-on-surface-variant">₹65k / ₹39k</span>
              </div>
              <div className="text-center">
                <span className="block text-on-surface font-semibold">Jul</span>
                <span className="text-[10px] text-on-surface-variant">₹68k / ₹37k</span>
              </div>
              <div className="text-center">
                <span className="block text-on-surface font-semibold">Aug</span>
                <span className="text-[10px] text-on-surface-variant">₹70k / ₹36k</span>
              </div>
              <div className="text-center">
                <span className="block text-on-surface font-semibold">Sep</span>
                <span className="text-[10px] text-on-surface-variant">₹72k / ₹35k</span>
              </div>
              <div className="text-center bg-primary/10 px-3 py-1 rounded-xl">
                <span className="block text-primary font-bold">Oct 2024</span>
                <span className="text-[10px] text-primary font-semibold">₹75k / ₹32.4k</span>
              </div>
            </div>
          </div>

          {/* Quick Summary Footer */}
          <div className="mt-space-md pt-space-md bg-surface-container-low rounded-xl p-space-md flex flex-col md:flex-row items-center justify-between gap-space-sm border border-surface-container">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[20px]">verified</span>
              </div>
              <div>
                <div className="text-title-md text-on-surface font-semibold">Net Savings Trend is Accelerating</div>
                <div className="text-body-sm text-on-surface-variant">Current month surplus exceeds historical average by ₹8,200 (+23.8%).</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-label-sm text-on-surface-variant">Total Inflow: <strong className="text-on-surface">₹{totalInflow.toLocaleString('en-IN')}</strong></span>
              <span className="text-on-surface-variant font-bold">·</span>
              <span className="text-label-sm text-on-surface-variant">Total Outflow: <strong className="text-on-surface">₹{totalOutflow.toLocaleString('en-IN')}</strong></span>
            </div>
          </div>
        </div>

        {/* Section 2: Month-over-Month Velocity & Projected Outflow (4 Columns) */}
        <div className="xl:col-span-4 bg-surface-container-lowest rounded-2xl p-space-lg shadow-xs border border-surface-container flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-headline-md text-on-surface font-bold">Spending Velocity</h2>
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">speed</span>
            </div>
            <p className="text-body-sm text-on-surface-variant mb-space-md">September vs. Current October pacing</p>

            {/* Velocity Indicator Card */}
            <div className="bg-surface-container-low rounded-xl p-space-md mb-space-md border border-surface-container">
              <div className="flex justify-between items-center mb-1">
                <span className="text-label-sm text-on-surface-variant uppercase font-semibold">Current Oct Burn</span>
                <span className="text-title-md font-bold text-on-surface">₹32,450</span>
              </div>
              <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden mb-2">
                <div className="bg-secondary-container h-full rounded-full" style={{ width: '85%' }}></div>
              </div>
              <div className="flex justify-between text-label-sm text-on-surface-variant">
                <span>Day 24 of 31</span>
                <span>Projected: <strong className="text-tertiary">₹38,000</strong></span>
              </div>
            </div>

            {/* Comparative Bar Comparison */}
            <div className="space-y-4">
              {/* September */}
              <div>
                <div className="flex justify-between text-body-sm mb-1">
                  <span className="text-on-surface-variant font-medium">September (Actual)</span>
                  <span className="text-on-surface font-semibold">₹35,350</span>
                </div>
                <div className="w-full bg-surface-container h-6 rounded-lg overflow-hidden flex items-center p-1">
                  <div className="bg-on-surface-variant/40 h-full rounded text-surface-container-lowest text-[10px] font-bold flex items-center px-2" style={{ width: '88%' }}>
                    ₹35,350
                  </div>
                </div>
              </div>

              {/* October Actual */}
              <div>
                <div className="flex justify-between text-body-sm mb-1">
                  <span className="text-primary font-medium">October (So Far)</span>
                  <span className="text-primary font-bold">₹32,450</span>
                </div>
                <div className="w-full bg-surface-container h-6 rounded-lg overflow-hidden flex items-center p-1">
                  <div className="bg-primary-container h-full rounded text-on-primary-container text-[10px] font-bold flex items-center px-2" style={{ width: '81%' }}>
                    ₹32,450 (Oct 24)
                  </div>
                </div>
              </div>

              {/* October Projected */}
              <div>
                <div className="flex justify-between text-body-sm mb-1">
                  <span className="text-tertiary font-medium">October (Full Month Est.)</span>
                  <span className="text-tertiary font-bold">₹38,000</span>
                </div>
                <div className="w-full bg-surface-container h-6 rounded-lg overflow-hidden flex items-center p-1">
                  <div className="bg-tertiary-container/80 h-full rounded text-on-tertiary-container text-[10px] font-bold flex items-center px-2" style={{ width: '95%' }}>
                    ₹38,000
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Delta Alert Note */}
          <div className="mt-space-md p-space-md rounded-xl bg-tertiary-fixed/30 flex items-start gap-space-xs border border-tertiary-fixed">
            <span className="material-symbols-outlined text-[20px] text-tertiary shrink-0 mt-0.5">info</span>
            <p className="text-body-sm text-on-surface-variant">
              Projected run-rate is <strong className="text-on-surface">+7.5% higher</strong> than September due to upcoming Diwali festive commitments.
            </p>
          </div>
        </div>
      </div>

      {/* Outflow Breakdown: Donut & Ranking */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg mb-space-lg">
        {/* Category Expense Breakdown (5 Columns) */}
        <div className="xl:col-span-5 bg-surface-container-lowest rounded-2xl p-space-lg shadow-xs border border-surface-container flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className="text-headline-md text-on-surface font-bold">Expense Breakdown</h2>
                <p className="text-body-sm text-on-surface-variant">Categorical distribution for ₹{totalOutflow.toLocaleString('en-IN')} outflow</p>
              </div>
              <div className="flex items-center gap-2">
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
                <span className="bg-surface-container px-2.5 py-1 rounded-full text-on-surface-variant text-label-sm font-semibold">
                  {categories.length} Categories
                </span>
              </div>
            </div>

            {chartType === 'bar' ? (
              /* Bar Plot for Analytics */
              <div className="my-space-sm">
                {/* Total Metric Header */}
                <div className="flex items-center justify-between bg-surface-container-low/70 px-3.5 py-2.5 rounded-xl mb-3 border border-surface-container">
                  <div className="flex flex-col">
                    <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">Total Spent</span>
                    <span className="text-title-md font-bold text-on-surface">₹32,450</span>
                  </div>
                  <span className="bg-primary/10 text-primary text-label-sm font-semibold px-2 py-0.5 rounded-full">
                    84.2% budget
                  </span>
                </div>

                <div className="relative h-44 w-full flex items-end justify-between gap-2 pt-6 pb-2 px-1 bg-surface-container-low/30 rounded-xl border border-surface-container/60">
                  {/* Gridlines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30 py-6">
                    <div className="border-b border-surface-container border-dashed w-full" />
                    <div className="border-b border-surface-container border-dashed w-full" />
                    <div className="border-b border-surface-container border-dashed w-full" />
                  </div>

                  {categories.map((cat) => {
                    const maxPct = Math.max(...categories.map(c => c.percentage));
                    const heightPercent = Math.max(12, Math.round((cat.percentage / maxPct) * 100));
                    const isHovered = hoveredCategory === cat.name;

                    return (
                      <div
                        key={cat.id}
                        onMouseEnter={() => setHoveredCategory(cat.name)}
                        onMouseLeave={() => setHoveredCategory(null)}
                        className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer z-10"
                      >
                        <span className={`text-[11px] font-bold mb-1.5 transition-all ${
                          isHovered ? 'scale-110 text-on-surface' : 'text-on-surface-variant'
                        }`}>
                          {cat.percentage}%
                        </span>

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

                        <div className="mt-2 text-center flex flex-col items-center">
                          <span className={`text-[11px] font-semibold transition-colors truncate max-w-[48px] ${
                            isHovered ? 'text-primary font-bold' : 'text-on-surface-variant'
                          }`}>
                            {cat.name.split(' ')[0]}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Donut Visual */
              <div className="flex flex-col sm:flex-row items-center justify-center gap-space-lg py-space-sm">
                <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" fill="transparent" r="38" stroke="#eaedff" strokeWidth="15" />
                    <circle cx="50" cy="50" fill="transparent" r="38" stroke="#e29100" strokeDasharray="132.2 238.76" strokeDashoffset="0" strokeWidth="15" />
                    <circle cx="50" cy="50" fill="transparent" r="38" stroke="#10b981" strokeDasharray="42.5 238.76" strokeDashoffset="-132.2" strokeWidth="15" />
                    <circle cx="50" cy="50" fill="transparent" r="38" stroke="#6063ee" strokeDasharray="15.5 238.76" strokeDashoffset="-174.7" strokeWidth="15" />
                    <circle cx="50" cy="50" fill="transparent" r="38" stroke="#4edea3" strokeDasharray="13.6 238.76" strokeDashoffset="-190.2" strokeWidth="15" />
                    <circle cx="50" cy="50" fill="transparent" r="38" stroke="#bbcabf" strokeDasharray="34.8 238.76" strokeDashoffset="-203.8" strokeWidth="15" />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-label-sm text-on-surface-variant uppercase font-semibold">Total Spent</span>
                    <span className="text-numeric-metric font-bold text-on-surface">₹32,450</span>
                    <span className="text-label-sm text-primary font-medium">84.2% budget</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 w-full">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between text-body-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                        <span className="text-on-surface font-medium truncate">{cat.name}</span>
                      </div>
                      <span className="font-semibold text-on-surface">{cat.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* List breakdown under bar plot when in bar plot mode */}
            {chartType === 'bar' && (
              <div className="flex flex-col gap-2 mt-space-sm">
                {categories.map((cat) => {
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
            )}
          </div>

          <div className="border-t border-surface-container pt-3 mt-2 flex items-center justify-between text-label-sm text-on-surface-variant">
            <span>Highest concentration: Housing</span>
            <button
              onClick={onOpenCategoryCaps}
              className="text-primary hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
            >
              <span>Set Category Caps</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Ranked Sub-Category & Merchant Outflow Table (7 Columns) */}
        <div className="xl:col-span-7 bg-surface-container-lowest rounded-2xl p-space-lg shadow-xs border border-surface-container flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className="text-headline-md text-on-surface font-bold">Sub-Category Ranking</h2>
                <p className="text-body-sm text-on-surface-variant">Top expenditure drivers sorted by monthly volume</p>
              </div>
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="bg-surface-container text-on-surface text-label-md px-3 py-1.5 rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer font-medium"
                type="button"
              >
                {showAllCategories ? 'Show Top 5' : 'View All (18)'}
              </button>
            </div>

            {/* Outflow Table */}
            <div className="mt-space-md overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-on-surface-variant text-label-sm uppercase tracking-wider pb-2 border-b border-surface-container">
                    <th className="py-2.5 font-semibold">Sub-Category / Payee</th>
                    <th className="py-2.5 font-semibold">Classification</th>
                    <th className="py-2.5 font-semibold text-center">Share</th>
                    <th className="py-2.5 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container text-body-sm">
                  {/* Top 5 Payees */}
                  <tr 
                    onClick={() => {
                      const rentTx = transactions.find(t => t.merchant.includes('Prestige'));
                      if (rentTx) onSelectTransaction(rentTx);
                    }}
                    className="hover:bg-surface-container-low transition-colors cursor-pointer"
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-space-sm">
                        <span className="w-8 h-8 rounded-lg bg-tertiary-fixed text-tertiary flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px]">apartment</span>
                        </span>
                        <div>
                          <div className="text-title-md text-on-surface font-semibold">Prestige Greenwoods</div>
                          <span className="text-on-surface-variant text-[11px]">Monthly Apartment Lease</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="bg-surface-container px-2 py-0.5 rounded text-on-surface font-medium text-[11px]">Fixed · Housing</span>
                    </td>
                    <td className="py-3 text-center text-on-surface-variant font-medium">55.4%</td>
                    <td className="py-3 text-right text-title-md font-bold text-on-surface">₹18,000</td>
                  </tr>

                  <tr 
                    onClick={() => {
                      const nbTx = transactions.find(t => t.merchant.includes('Nature'));
                      if (nbTx) onSelectTransaction(nbTx);
                    }}
                    className="hover:bg-surface-container-low transition-colors cursor-pointer"
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-space-sm">
                        <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                        </span>
                        <div>
                          <div className="text-title-md text-on-surface font-semibold">Nature's Basket &amp; Instamart</div>
                          <span className="text-on-surface-variant text-[11px]">Household Groceries</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-medium text-[11px]">Groceries</span>
                    </td>
                    <td className="py-3 text-center text-on-surface-variant font-medium">10.6%</td>
                    <td className="py-3 text-right text-title-md font-bold text-on-surface">₹3,450</td>
                  </tr>

                  <tr 
                    onClick={() => {
                      const dinTx = transactions.find(t => t.category.includes('Food') && t.amount === 2350);
                      if (dinTx) onSelectTransaction(dinTx);
                    }}
                    className="hover:bg-surface-container-low transition-colors cursor-pointer"
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-space-sm">
                        <span className="w-8 h-8 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px]">restaurant</span>
                        </span>
                        <div>
                          <div className="text-title-md text-on-surface font-semibold">Dining &amp; Takeouts</div>
                          <span className="text-on-surface-variant text-[11px]">Restaurants &amp; Zomato</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded font-medium text-[11px]">Discretionary</span>
                    </td>
                    <td className="py-3 text-center text-on-surface-variant font-medium">7.2%</td>
                    <td className="py-3 text-right text-title-md font-bold text-on-surface">₹2,350</td>
                  </tr>

                  <tr 
                    onClick={() => {
                      const metroTx = transactions.find(t => t.merchant.includes('Metro'));
                      if (metroTx) onSelectTransaction(metroTx);
                    }}
                    className="hover:bg-surface-container-low transition-colors cursor-pointer"
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-space-sm">
                        <span className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px]">directions_subway</span>
                        </span>
                        <div>
                          <div className="text-title-md text-on-surface font-semibold">Namma Metro &amp; Fuel</div>
                          <span className="text-on-surface-variant text-[11px]">Bengaluru Transit Pass</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded font-medium text-[11px]">Commute</span>
                    </td>
                    <td className="py-3 text-center text-on-surface-variant font-medium">6.5%</td>
                    <td className="py-3 text-right text-title-md font-bold text-on-surface">₹2,100</td>
                  </tr>

                  <tr 
                    onClick={() => {
                      const bescomTx = transactions.find(t => t.merchant.includes('BESCOM'));
                      if (bescomTx) onSelectTransaction(bescomTx);
                    }}
                    className="hover:bg-surface-container-low transition-colors cursor-pointer"
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-space-sm">
                        <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px]">bolt</span>
                        </span>
                        <div>
                          <div className="text-title-md text-on-surface font-semibold">BESCOM Electricity</div>
                          <span className="text-on-surface-variant text-[11px]">Utility Power Bill (Auto-pay)</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="bg-surface-container px-2 py-0.5 rounded text-on-surface font-medium text-[11px]">Utilities</span>
                    </td>
                    <td className="py-3 text-center text-on-surface-variant font-medium">5.7%</td>
                    <td className="py-3 text-right text-title-md font-bold text-on-surface">₹1,850</td>
                  </tr>

                  {showAllCategories && (
                    <>
                      <tr className="hover:bg-surface-container-low transition-colors">
                        <td className="py-3">
                          <div className="flex items-center gap-space-sm">
                            <span className="w-8 h-8 rounded-lg bg-surface-container text-on-surface flex items-center justify-center">
                              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                            </span>
                            <div>
                              <div className="text-title-md text-on-surface font-semibold">Zara Retail</div>
                              <span className="text-on-surface-variant text-[11px]">Autumn Apparel</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="bg-surface-container px-2 py-0.5 rounded text-on-surface font-medium text-[11px]">Shopping</span>
                        </td>
                        <td className="py-3 text-center text-on-surface-variant font-medium">5.8%</td>
                        <td className="py-3 text-right text-title-md font-bold text-on-surface">₹1,885</td>
                      </tr>
                      <tr className="hover:bg-surface-container-low transition-colors">
                        <td className="py-3">
                          <div className="flex items-center gap-space-sm">
                            <span className="w-8 h-8 rounded-lg bg-error-container text-on-error-container flex items-center justify-center">
                              <span className="material-symbols-outlined text-[18px]">medical_services</span>
                            </span>
                            <div>
                              <div className="text-title-md text-on-surface font-semibold">Apollo Pharmacy</div>
                              <span className="text-on-surface-variant text-[11px]">Prescription Care</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="bg-surface-container px-2 py-0.5 rounded text-on-surface font-medium text-[11px]">Health</span>
                        </td>
                        <td className="py-3 text-center text-on-surface-variant font-medium">3.8%</td>
                        <td className="py-3 text-right text-title-md font-bold text-on-surface">₹1,250</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Actionable Financial Intelligence Cards (Bento 2-Column Split) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
        {/* Intelligence Card 1: Dining Optimization */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-xs border-l-4 border-primary border border-surface-container flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                </span>
                <span className="text-label-md uppercase tracking-wider text-primary font-bold">Smart Recommendation</span>
              </div>
              <span className="bg-primary-container text-on-primary-container text-label-sm font-semibold px-2.5 py-0.5 rounded-full">
                Save ₹3,200/mo
              </span>
            </div>
            <p className="text-headline-sm text-on-surface font-semibold mt-1">
              Food Delivery Optimization
            </p>
            <p className="text-body-md text-on-surface-variant mt-2 leading-relaxed">
              Reducing app delivery orders by <strong className="text-on-surface">2 times a week</strong> could save an estimated <strong className="text-primary font-bold">₹3,200/month</strong>, redirecting ₹38,400 annually into your emergency reserve.
            </p>
          </div>
          <div className="mt-space-md pt-space-md border-t border-surface-container flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-on-surface-variant text-label-sm">
              <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
              <span>Calculated from 14 dining events in Oct</span>
            </div>
            <button
              onClick={onCreateGoalRule}
              className="bg-primary-container hover:bg-primary text-on-primary-container hover:text-white text-title-md px-3.5 py-1.5 rounded-xl transition-colors font-semibold cursor-pointer"
              type="button"
            >
              Create Goal Rule
            </button>
          </div>
        </div>

        {/* Intelligence Card 2: Recurring Subscriptions */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-xs border-l-4 border-secondary border border-surface-container flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">tune</span>
                </span>
                <span className="text-label-md uppercase tracking-wider text-secondary font-bold">Subscriptions Audit</span>
              </div>
              <span className="bg-secondary-fixed text-on-secondary-fixed text-label-sm font-semibold px-2.5 py-0.5 rounded-full">
                Redundancy Alert
              </span>
            </div>
            <p className="text-headline-sm text-on-surface font-semibold mt-1">
              4 Active OTT Media Subscriptions
            </p>
            <p className="text-body-md text-on-surface-variant mt-2 leading-relaxed">
              Detected concurrent streaming bundles (Netflix, Prime, Hotstar, SonyLIV). Consolidating or pausing unused tiers reveals a <strong className="text-secondary font-bold">₹650/month</strong> overlap.
            </p>
          </div>
          <div className="mt-space-md pt-space-md border-t border-surface-container flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-on-surface-variant text-label-sm">
              <span className="material-symbols-outlined text-[16px] text-secondary">sync_saved_locally</span>
              <span>Next cycle renews on Nov 3</span>
            </div>
            <button
              onClick={onOpenSubscriptionsAudit}
              className="bg-surface-container hover:bg-surface-container-high text-on-surface text-title-md px-3.5 py-1.5 rounded-xl transition-colors font-semibold cursor-pointer"
              type="button"
            >
              Audit Subscriptions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
