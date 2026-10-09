import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/views/DashboardView';
import { TransactionsView } from './components/views/TransactionsView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { BudgetsView } from './components/views/BudgetsView';
import { SavingsGoalsView } from './components/views/SavingsGoalsView';
import { RecurringPaymentsView } from './components/views/RecurringPaymentsView';
import { SettingsView } from './components/views/SettingsView';
import { AddTransactionModal } from './components/AddTransactionModal';
import { TransactionDrawer } from './components/TransactionDrawer';
import { NotificationsModal } from './components/NotificationsModal';
import { CommandPalette } from './components/CommandPalette';
import { CategoryCapsModal } from './components/CategoryCapsModal';
import { SubscriptionsAuditModal } from './components/SubscriptionsAuditModal';
import { 
  INITIAL_TRANSACTIONS, 
  INITIAL_CATEGORIES, 
  INITIAL_SAVINGS_GOALS, 
  INITIAL_RECURRING, 
  INITIAL_NOTIFICATIONS 
} from './data/initialData';
import { Transaction, CategoryBreakdown, SavingsGoal, RecurringPayment, AppNotification } from './types/finance';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('analytics');
  const [selectedMonth, setSelectedMonth] = useState('October 2024');

  // Persistence in LocalStorage
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('pennywise_tx_v2');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [categories, setCategories] = useState<CategoryBreakdown[]>(() => {
    const saved = localStorage.getItem('pennywise_cat_v2');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [goals, setGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem('pennywise_goals_v2');
    return saved ? JSON.parse(saved) : INITIAL_SAVINGS_GOALS;
  });

  const [recurring, setRecurring] = useState<RecurringPayment[]>(() => {
    const saved = localStorage.getItem('pennywise_rec_v2');
    return saved ? JSON.parse(saved) : INITIAL_RECURRING;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('pennywise_notif_v2');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Modal / Drawer states
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isCategoryCapsOpen, setIsCategoryCapsOpen] = useState(false);
  const [isSubscriptionsAuditOpen, setIsSubscriptionsAuditOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  useEffect(() => {
    localStorage.setItem('pennywise_tx_v2', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('pennywise_cat_v2', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('pennywise_goals_v2', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('pennywise_rec_v2', JSON.stringify(recurring));
  }, [recurring]);

  useEffect(() => {
    localStorage.setItem('pennywise_notif_v2', JSON.stringify(notifications));
  }, [notifications]);

  // Handlers
  const handleAddTransaction = (newTxData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...newTxData,
      id: `tx-${Date.now()}`
    };
    setTransactions([newTx, ...transactions]);

    // Update category total if expense
    if (newTx.type === 'expense') {
      setCategories(prev => prev.map(c => {
        if (c.name.toLowerCase().includes(newTx.category.toLowerCase()) || newTx.category.toLowerCase().includes(c.name.toLowerCase())) {
          return {
            ...c,
            amount: c.amount + newTx.amount
          };
        }
        return c;
      }));
    }

    showToast(`Recorded ${newTx.type === 'income' ? '+₹' : '-₹'}${newTx.amount.toLocaleString('en-IN')} for ${newTx.title}`);
  };

  const handleUpdateTransaction = (updated: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updated.id ? updated : t));
    showToast(`Updated transaction: ${updated.title}`);
  };

  const handleDeleteTransaction = (id: string) => {
    const deleted = transactions.find(t => t.id === id);
    setTransactions(prev => prev.filter(t => t.id !== id));
    showToast(`Deleted transaction ${deleted ? deleted.title : ''}`);
  };

  const handleSelectTransaction = (tx: Transaction) => {
    setSelectedTx(tx);
    setIsDrawerOpen(true);
  };

  const handleUpdateCategoryCaps = (updatedCaps: CategoryBreakdown[]) => {
    setCategories(updatedCaps);
    showToast('Category budget caps updated');
  };

  const handleToggleRecurringStatus = (id: string, status: 'Active' | 'Paused' | 'Redundant') => {
    setRecurring(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    showToast(`Subscription ${status.toLowerCase()}`);
  };

  const handleUpdateGoal = (updatedGoal: SavingsGoal) => {
    setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
    showToast(`Deposited into ${updatedGoal.title}`);
  };

  const handleAddGoal = (newGoal: SavingsGoal) => {
    setGoals(prev => [...prev, newGoal]);
    showToast(`Created savings goal: ${newGoal.title}`);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  };

  const handleResetData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setCategories(INITIAL_CATEGORIES);
    setGoals(INITIAL_SAVINGS_GOALS);
    setRecurring(INITIAL_RECURRING);
    setNotifications(INITIAL_NOTIFICATIONS);
    showToast('Reset to initial October demo data');
  };

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen flex">
      {/* Global Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-8 z-50 bg-inverse-surface text-inverse-on-surface px-space-md py-3 rounded-xl shadow-xl flex items-center gap-space-sm animate-in fade-in slide-in-from-bottom-4 duration-200 border border-surface-container-highest/20">
          <span className="material-symbols-outlined text-primary-fixed-dim text-[20px] fill-1">
            check_circle
          </span>
          <span className="text-body-md font-medium text-surface-container-lowest">
            {toastMsg}
          </span>
        </div>
      )}

      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        mobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="pl-0 lg:pl-72 flex flex-col min-h-screen flex-1 w-full">
        {/* Top Header */}
        <Header
          selectedMonth={selectedMonth}
          onSelectMonth={setSelectedMonth}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          unreadCount={notifications.filter(n => !n.read).length}
        />

        {/* Views */}
        <main className="relative pt-20 w-full px-4 sm:px-space-md lg:px-space-xl bg-surface flex-1">
          {activeTab === 'analytics' && (
            <AnalyticsView
              transactions={transactions}
              categories={categories}
              onOpenCategoryCaps={() => setIsCategoryCapsOpen(true)}
              onOpenSubscriptionsAudit={() => setIsSubscriptionsAuditOpen(true)}
              onCreateGoalRule={() => {
                setActiveTab('savings-goals');
                showToast('Initiating Food Delivery savings rule into Emergency Reserve');
              }}
              onSelectTransaction={handleSelectTransaction}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionsView
              transactions={transactions}
              onSelectTransaction={handleSelectTransaction}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onDeleteTransaction={handleDeleteTransaction}
            />
          )}

          {activeTab === 'dashboard' && (
            <DashboardView
              transactions={transactions}
              categories={categories}
              onSelectTab={setActiveTab}
              onSelectTransaction={handleSelectTransaction}
            />
          )}

          {activeTab === 'budgets' && (
            <BudgetsView
              categories={categories}
              transactions={transactions}
              onOpenCategoryCaps={() => setIsCategoryCapsOpen(true)}
            />
          )}

          {activeTab === 'savings-goals' && (
            <SavingsGoalsView
              goals={goals}
              onUpdateGoal={handleUpdateGoal}
              onAddGoal={handleAddGoal}
            />
          )}

          {activeTab === 'recurring-payments' && (
            <RecurringPaymentsView
              recurring={recurring}
              onToggleStatus={handleToggleRecurringStatus}
              onOpenAudit={() => setIsSubscriptionsAuditOpen(true)}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              transactions={transactions}
              onResetData={handleResetData}
            />
          )}
        </main>
      </div>

      {/* Modals & Slide-over Drawers */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTransaction={handleAddTransaction}
      />

      <TransactionDrawer
        transaction={selectedTx}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedTx(null);
        }}
        onUpdate={handleUpdateTransaction}
        onDelete={handleDeleteTransaction}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotificationsRead}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        transactions={transactions}
        onSelectTransaction={handleSelectTransaction}
        onSelectTab={setActiveTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      <CategoryCapsModal
        isOpen={isCategoryCapsOpen}
        onClose={() => setIsCategoryCapsOpen(false)}
        categories={categories}
        onUpdateCaps={handleUpdateCategoryCaps}
      />

      <SubscriptionsAuditModal
        isOpen={isSubscriptionsAuditOpen}
        onClose={() => setIsSubscriptionsAuditOpen(false)}
        recurring={recurring}
        onToggleStatus={handleToggleRecurringStatus}
      />
    </div>
  );
}
