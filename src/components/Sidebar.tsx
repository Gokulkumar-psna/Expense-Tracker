import React from 'react';

export type NavTab = 
  | 'dashboard' 
  | 'transactions' 
  | 'budgets' 
  | 'analytics' 
  | 'savings-goals' 
  | 'recurring-payments' 
  | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  mobileOpen = false,
  onCloseMobile
}) => {
  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: 'dashboard' },
    { id: 'transactions' as NavTab, label: 'Transactions', icon: 'receipt_long' },
    { id: 'budgets' as NavTab, label: 'Budgets', icon: 'pie_chart' },
    { id: 'analytics' as NavTab, label: 'Analytics', icon: 'insights' },
    { id: 'savings-goals' as NavTab, label: 'Savings Goals', icon: 'savings' },
    { id: 'recurring-payments' as NavTab, label: 'Recurring Payments', icon: 'event_repeat' },
    { id: 'settings' as NavTab, label: 'Settings', icon: 'settings' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`fixed left-0 top-0 h-full w-72 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between select-none transition-transform duration-200 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col">
          {/* Logo Header */}
          <div className="h-20 px-space-lg flex items-center justify-between">
            <div className="flex items-center gap-space-md">
              <img 
                alt="PennyWise Logo" 
                className="h-8 w-auto object-contain" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQ9vC4OZDagp19gG1GvaMOXIVtPTG2Qz2r3dlvD7enFHFmP29yGBloVGMy2uMICAkKLsoxXJ2v5PQB-9ZH61G4h5HkKyfurCWY8DJOz7Rx7DBs0ltPw8nHOwilXouHgEey43IG2Xb-GFZw-wtuTKM_44Agim8EeqY0c-BLkVN7c77azVQODMrkNBx9bbqDrHdYNUAFOCwSzYuI33GZidDiSjZbvs_1sCnfVUHdDSfAF_ztJyQ4ql5HPg"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-title-md text-on-surface tracking-tight">PennyWise</span>
                <span className="text-label-sm text-on-surface-variant font-medium">Expense &amp; Budget</span>
              </div>
            </div>

            {/* Mobile close button */}
            <button 
              className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container"
              onClick={onCloseMobile}
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Nav List */}
          <div className="px-space-md py-space-sm">
            <nav className="flex flex-col gap-space-xs">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`flex items-center gap-space-md px-space-md py-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-primary-container text-on-primary-container font-semibold shadow-xs'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-normal'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    <span className="text-body-md">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User Profile Card at Bottom */}
        <div className="p-space-md">
          <div className="bg-surface-container-low rounded-xl p-space-md flex items-center justify-between gap-space-sm">
            <div className="flex items-center gap-space-sm min-w-0">
              <img 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-1 ring-surface-container-high" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzAb5cIW0Hwv4qCle8-EQDfBnbW6c0vyUgi4V_TFLkfptNXNHZ5Bvgotst7oAfvjGKxLWAGo19PCGYe92SWOg_WqKhU9AcuIr-flmt-s3y3hysi5DizQhp6atcZC-Kmk7JkfMOPQbzoaCfNYSoaYQMmoEALZtUaBcccmfqBc1CQeaSU0WHU3ObGIL_tiqxC_U9vyL20Jw_e0nfQh3_qDgn-Y9nu2DW-hW27krZYC7b08WR-b73gFuQFw"
              />
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-space-xs">
                  <span className="text-title-md text-on-surface font-semibold truncate">Alex Sharma</span>
                  <span className="bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">PRO</span>
                </div>
                <span className="text-label-sm text-on-surface-variant truncate">alex.sharma@example.com</span>
              </div>
            </div>
            <button 
              onClick={() => onSelectTab('settings')}
              className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer" 
              title="Account Settings"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
