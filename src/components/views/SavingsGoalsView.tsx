import React, { useState } from 'react';
import { SavingsGoal } from '../../types/finance';

interface SavingsGoalsViewProps {
  goals: SavingsGoal[];
  onUpdateGoal: (updated: SavingsGoal) => void;
  onAddGoal: (newGoal: SavingsGoal) => void;
}

export const SavingsGoalsView: React.FC<SavingsGoalsViewProps> = ({
  goals,
  onUpdateGoal,
  onAddGoal
}) => {
  const [depositModalGoal, setDepositModalGoal] = useState<SavingsGoal | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [newGoalModalOpen, setNewGoalModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newMonthly, setNewMonthly] = useState('');

  const totalSaved = goals.reduce((s, g) => s + g.currentAmount, 0);
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const aggregatePercent = Math.round((totalSaved / totalTarget) * 100);

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositModalGoal) return;
    const amountNum = parseFloat(depositAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    onUpdateGoal({
      ...depositModalGoal,
      currentAmount: depositModalGoal.currentAmount + amountNum
    });
    setDepositModalGoal(null);
    setDepositAmount('');
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const targetNum = parseFloat(newTarget);
    const monthlyNum = parseFloat(newMonthly);
    if (!newTitle.trim() || isNaN(targetNum) || targetNum <= 0) return;

    onAddGoal({
      id: `goal-${Date.now()}`,
      title: newTitle,
      currentAmount: 0,
      targetAmount: targetNum,
      deadline: '2025-12-31',
      monthlyContribution: isNaN(monthlyNum) ? Math.round(targetNum / 12) : monthlyNum,
      category: 'Personal',
      color: '#10b981'
    });
    setNewGoalModalOpen(false);
    setNewTitle('');
    setNewTarget('');
    setNewMonthly('');
  };

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md mb-space-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-label-sm uppercase tracking-wider text-primary font-semibold">Wealth Accumulation</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
            <span className="text-label-sm text-on-surface-variant">4 Target Reserves</span>
          </div>
          <h1 className="text-headline-lg text-on-surface tracking-tight mt-1 font-bold">Savings Goals &amp; Reserves</h1>
          <p className="text-body-sm text-on-surface-variant mt-0.5">
            Automated liquidity redirection and long-term milestone modeling.
          </p>
        </div>

        <button
          onClick={() => setNewGoalModalOpen(true)}
          className="bg-primary-container text-on-primary-container hover:bg-primary hover:text-white text-title-md px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-space-xs transition-all font-semibold cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Create New Goal</span>
        </button>
      </div>

      {/* Aggregate Goal Metric Banner */}
      <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-xs border border-surface-container mb-space-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg mb-space-md">
          <div>
            <span className="text-label-sm uppercase text-on-surface-variant font-semibold block">Total Accumulated</span>
            <span className="text-display-lg text-primary font-bold tracking-tight">₹{totalSaved.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-label-sm uppercase text-on-surface-variant font-semibold block">Target Cumulative</span>
            <span className="text-display-lg text-on-surface font-bold tracking-tight">₹{totalTarget.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-label-sm uppercase text-on-surface-variant font-semibold block">Aggregate Progress</span>
            <span className="text-display-lg text-secondary font-bold tracking-tight">{aggregatePercent}%</span>
          </div>
        </div>

        <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-container rounded-full transition-all duration-500" 
            style={{ width: `${aggregatePercent}%` }}
          />
        </div>
      </div>

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        {goals.map((goal) => {
          const percent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const remainingAmount = Math.max(0, goal.targetAmount - goal.currentAmount);

          return (
            <div 
              key={goal.id} 
              className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-xs border border-surface-container flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white" 
                      style={{ backgroundColor: goal.color }}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {goal.category === 'Safety' ? 'security' : goal.category === 'Travel' ? 'flight_takeoff' : goal.category === 'Festive' ? 'celebration' : 'devices'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-title-md font-bold text-on-surface">{goal.title}</h3>
                      <span className="text-label-sm text-on-surface-variant">{goal.category} • Target by {goal.deadline}</span>
                    </div>
                  </div>

                  <span className="bg-primary/10 text-primary text-label-sm font-bold px-2.5 py-0.5 rounded-full">
                    {percent}%
                  </span>
                </div>

                <div className="flex items-baseline justify-between mt-3 mb-1">
                  <span className="text-headline-sm font-bold text-on-surface">
                    ₹{goal.currentAmount.toLocaleString('en-IN')}{' '}
                    <span className="text-body-sm text-on-surface-variant font-normal">/ ₹{goal.targetAmount.toLocaleString('en-IN')}</span>
                  </span>
                  <span className="text-body-sm text-primary font-semibold">
                    ₹{remainingAmount.toLocaleString('en-IN')} left
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden mt-2">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ 
                      backgroundColor: goal.color, 
                      width: `${percent}%` 
                    }}
                  />
                </div>

                <div className="bg-surface-container-low p-2.5 rounded-xl mt-3 text-label-sm text-on-surface-variant flex items-center justify-between">
                  <span>Pacing contribution: <strong>₹{goal.monthlyContribution.toLocaleString('en-IN')}/mo</strong></span>
                  <span className="text-primary font-medium">On track</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-end gap-2">
                <button
                  onClick={() => setDepositModalGoal(goal)}
                  className="px-4 py-2 bg-primary-container text-on-primary-container hover:bg-primary hover:text-white rounded-xl text-label-md font-semibold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>Deposit Funds</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deposit Modal */}
      {depositModalGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-xs" onClick={() => setDepositModalGoal(null)} />
          <div className="relative bg-surface-container-lowest rounded-2xl w-full max-w-sm p-space-lg shadow-2xl z-10 border border-surface-container">
            <h3 className="text-headline-sm font-bold text-on-surface mb-1">Add to {depositModalGoal.title}</h3>
            <p className="text-body-sm text-on-surface-variant mb-4">Transfer liquid surplus directly toward this reserve target.</p>
            
            <form onSubmit={handleDepositSubmit} className="flex flex-col gap-3">
              <div className="relative flex items-center">
                <span className="absolute left-3 text-on-surface-variant font-bold">₹</span>
                <input
                  type="number"
                  placeholder="5000"
                  required
                  step="any"
                  autoFocus
                  className="w-full bg-surface-container-low pl-8 pr-3 py-2.5 rounded-xl text-headline-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <button 
                  type="button" 
                  onClick={() => setDepositModalGoal(null)}
                  className="px-3.5 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-body-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 rounded-xl bg-primary-container text-on-primary-container hover:bg-primary hover:text-white font-semibold text-body-sm cursor-pointer"
                >
                  Confirm Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Goal Modal */}
      {newGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-xs" onClick={() => setNewGoalModalOpen(false)} />
          <div className="relative bg-surface-container-lowest rounded-2xl w-full max-w-md p-space-lg shadow-2xl z-10 border border-surface-container">
            <h3 className="text-headline-sm font-bold text-on-surface mb-1">Create Savings Goal</h3>
            <p className="text-body-sm text-on-surface-variant mb-4">Establish an envelope reserve with custom target amounts.</p>
            
            <form onSubmit={handleCreateGoal} className="flex flex-col gap-3">
              <div>
                <label className="text-label-sm text-on-surface-variant font-semibold block mb-1">Goal Title</label>
                <input
                  type="text"
                  placeholder="e.g. New Home Down Payment"
                  required
                  className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-label-sm text-on-surface-variant font-semibold block mb-1">Target Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="100000"
                    required
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-label-sm text-on-surface-variant font-semibold block mb-1">Monthly Pace (₹)</label>
                  <input
                    type="number"
                    placeholder="10000"
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
                    value={newMonthly}
                    onChange={(e) => setNewMonthly(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-surface-container">
                <button 
                  type="button" 
                  onClick={() => setNewGoalModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-body-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 rounded-xl bg-primary-container text-on-primary-container hover:bg-primary hover:text-white font-semibold text-body-sm cursor-pointer"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
