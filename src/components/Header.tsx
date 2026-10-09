import React, { useState } from 'react';

interface HeaderProps {
  onOpenAddModal: () => void;
  onOpenNotifications: () => void;
  onOpenCommandPalette: () => void;
  onOpenMobileMenu: () => void;
  selectedMonth: string;
  onSelectMonth: (month: string) => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddModal,
  onOpenNotifications,
  onOpenCommandPalette,
  onOpenMobileMenu,
  selectedMonth,
  onSelectMonth,
  unreadCount = 3
}) => {
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);

  const availableMonths = [
    'October 2024',
    'September 2024',
    'August 2024',
    'July 2024',
    'June 2024',
    'May 2024'
  ];

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-20 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-4 sm:px-space-md lg:px-space-xl">
      {/* Left side: Greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-on-surface-variant hover:bg-surface-container"
          aria-label="Open menu"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-space-xs">
            <span className="text-headline-sm text-on-surface font-semibold tracking-tight">
              Good morning, Alex 👋
            </span>
          </div>
          <span className="text-body-sm text-on-surface-variant">Today, 24 Oct 2024</span>
        </div>
      </div>

      {/* Right side: Month filter, Search, Notifications, CTA, Avatar */}
      <div className="flex items-center gap-2 sm:gap-space-md">
        {/* Month Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setMonthDropdownOpen(!monthDropdownOpen)}
            className="hidden sm:flex bg-surface-container-low text-on-surface items-center gap-space-xs px-3 py-2 rounded-xl cursor-pointer hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">calendar_today</span>
            <span className="text-label-md text-on-surface font-medium">{selectedMonth}</span>
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span>
          </button>

          {monthDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-surface-container-lowest rounded-xl shadow-xl py-1.5 z-50 border border-surface-container">
              {availableMonths.map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    onSelectMonth(m);
                    setMonthDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-body-sm flex items-center justify-between hover:bg-surface-container transition-colors ${
                    selectedMonth === m ? 'text-primary font-semibold bg-primary/5' : 'text-on-surface'
                  }`}
                >
                  <span>{m}</span>
                  {selectedMonth === m && (
                    <span className="material-symbols-outlined text-[16px] text-primary">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search bar with ⌘K */}
        <button
          onClick={onOpenCommandPalette}
          className="relative flex items-center text-left cursor-pointer group"
          title="Search transactions and budgets (⌘K)"
        >
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant absolute left-3 pointer-events-none group-hover:text-primary transition-colors">
            search
          </span>
          <span className="hidden md:inline-block bg-surface-container-low text-on-surface-variant text-body-sm pl-9 pr-12 py-2 rounded-xl w-48 lg:w-64 border border-transparent group-hover:border-primary-container transition-all">
            Search transactions...
          </span>
          <span className="md:hidden p-2 rounded-xl text-on-surface-variant hover:bg-surface-container">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </span>
          <kbd className="hidden md:inline-block absolute right-2.5 text-label-sm text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded font-mono text-[10px]">
            ⌘K
          </kbd>
        </button>

        {/* Notifications Icon Button */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          type="button"
          aria-label="View notifications"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Add Transaction CTA */}
        <button
          onClick={onOpenAddModal}
          className="bg-primary-container text-on-primary-container hover:bg-primary hover:text-white text-title-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-[0_1px_2px_rgba(15,23,42,0.04)] flex items-center gap-space-xs transition-all duration-150 cursor-pointer font-semibold whitespace-nowrap active:scale-95"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span className="hidden sm:inline">Add Transaction</span>
          <span className="sm:hidden">Add</span>
        </button>

        {/* Profile Avatar */}
        <img
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover cursor-pointer ring-2 ring-surface-container hover:ring-primary-container transition-all"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzAb5cIW0Hwv4qCle8-EQDfBnbW6c0vyUgi4V_TFLkfptNXNHZ5Bvgotst7oAfvjGKxLWAGo19PCGYe92SWOg_WqKhU9AcuIr-flmt-s3y3hysi5DizQhp6atcZC-Kmk7JkfMOPQbzoaCfNYSoaYQMmoEALZtUaBcccmfqBc1CQeaSU0WHU3ObGIL_tiqxC_U9vyL20Jw_e0nfQh3_qDgn-Y9nu2DW-hW27krZYC7b08WR-b73gFuQFw"
          title="Alex Sharma (PRO)"
        />
      </div>
    </header>
  );
};
