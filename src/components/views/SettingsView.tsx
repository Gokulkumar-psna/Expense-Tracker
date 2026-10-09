import React, { useState } from 'react';
import { Transaction } from '../../types/finance';

interface SettingsViewProps {
  transactions: Transaction[];
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  transactions,
  onResetData
}) => {
  const [name, setName] = useState('Alex Sharma');
  const [email, setEmail] = useState('alex.sharma@example.com');
  const [currency] = useState('INR (₹)');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportAll = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(transactions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "PennyWise_Financial_Backup.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex flex-col w-full pb-space-xl max-w-4xl">
      {/* Header */}
      <div className="mb-space-lg">
        <div className="flex items-center gap-2">
          <span className="text-label-sm uppercase tracking-wider text-primary font-semibold">Account &amp; Security</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
          <span className="text-label-sm text-on-surface-variant">Profile Preferences</span>
        </div>
        <h1 className="text-headline-lg text-on-surface tracking-tight mt-1 font-bold">Preferences &amp; Bank Links</h1>
        <p className="text-body-sm text-on-surface-variant mt-0.5">
          Configure financial accounts, base reporting currency, and export historical statements.
        </p>
      </div>

      <div className="flex flex-col gap-space-lg">
        {/* Profile Card */}
        <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-xs border border-surface-container">
          <h2 className="text-title-md font-bold text-on-surface mb-space-md">User Profile</h2>
          
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-space-md">
            <div className="flex items-center gap-4">
              <img
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover ring-4 ring-surface-container"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzAb5cIW0Hwv4qCle8-EQDfBnbW6c0vyUgi4V_TFLkfptNXNHZ5Bvgotst7oAfvjGKxLWAGo19PCGYe92SWOg_WqKhU9AcuIr-flmt-s3y3hysi5DizQhp6atcZC-Kmk7JkfMOPQbzoaCfNYSoaYQMmoEALZtUaBcccmfqBc1CQeaSU0WHU3ObGIL_tiqxC_U9vyL20Jw_e0nfQh3_qDgn-Y9nu2DW-hW27krZYC7b08WR-b73gFuQFw"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-headline-sm font-bold text-on-surface">{name}</span>
                  <span className="bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold px-2 py-0.5 rounded-full">PRO MEMBER</span>
                </div>
                <span className="text-body-sm text-on-surface-variant">Active subscription since January 2024</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md mt-2">
              <div>
                <label className="text-label-sm uppercase font-semibold text-on-surface-variant block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
                />
              </div>

              <div>
                <label className="text-label-sm uppercase font-semibold text-on-surface-variant block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {savedSuccess ? (
                <span className="text-primary text-body-sm font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  Changes saved successfully!
                </span>
              ) : <div />}

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-primary-container text-on-primary-container hover:bg-primary hover:text-white font-semibold text-body-md transition-colors cursor-pointer"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>

        {/* Connected Bank Accounts */}
        <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-xs border border-surface-container">
          <div className="flex items-center justify-between mb-space-md">
            <div>
              <h2 className="text-title-md font-bold text-on-surface">Connected Accounts &amp; Gateways</h2>
              <p className="text-body-sm text-on-surface-variant">Open Banking OpenFin APIs with direct reconciliation.</p>
            </div>
            <span className="text-label-sm bg-primary/10 text-primary font-bold px-2.5 py-1 rounded-full">
              3 Connected
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {[
              {
                title: 'HDFC Corporate Salary Account',
                accountNumber: '•••• •••• •••• 9012',
                type: 'Direct Salary Inflow',
                status: 'Live Synced'
              },
              {
                title: 'ICICI Coral Credit Card',
                accountNumber: '•••• •••• •••• 4420',
                type: 'Primary Daily Outflow',
                status: 'Live Synced'
              },
              {
                title: 'Petty Cash & UPI Reserve',
                accountNumber: 'alex@hdfcbank',
                type: 'Instant Digital Wallet',
                status: 'Reconciled'
              }
            ].map((acc, i) => (
              <div key={i} className="bg-surface-container-low p-3.5 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary font-bold">
                    <span className="material-symbols-outlined text-[20px]">account_balance</span>
                  </div>
                  <div>
                    <span className="text-title-md font-bold text-on-surface block text-sm">{acc.title}</span>
                    <span className="text-[12px] text-on-surface-variant">{acc.accountNumber} • {acc.type}</span>
                  </div>
                </div>
                <span className="text-label-sm bg-surface-container-high text-primary font-semibold px-2.5 py-0.5 rounded-full">
                  {acc.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Currency & Locale Settings */}
        <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-xs border border-surface-container">
          <h2 className="text-title-md font-bold text-on-surface mb-1">Financial Locale</h2>
          <p className="text-body-sm text-on-surface-variant mb-space-md">All metrics reflect this standard notation.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div className="bg-surface-container-low p-3 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-label-sm text-on-surface-variant uppercase font-semibold block">Currency</span>
                <span className="text-title-md font-bold text-on-surface">{currency}</span>
              </div>
              <span className="material-symbols-outlined text-primary text-[20px]">currency_rupee</span>
            </div>

            <div className="bg-surface-container-low p-3 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-label-sm text-on-surface-variant uppercase font-semibold block">Number Notation</span>
                <span className="text-title-md font-bold text-on-surface">Lakhs &amp; Crores (Indian Format)</span>
              </div>
              <span className="material-symbols-outlined text-primary text-[20px]">pin</span>
            </div>
          </div>
        </div>

        {/* Data & Backup Management */}
        <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-xs border border-surface-container">
          <h2 className="text-title-md font-bold text-on-surface mb-1">Data &amp; Portability</h2>
          <p className="text-body-sm text-on-surface-variant mb-space-md">Backup your complete financial history or reset demo state.</p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportAll}
              className="bg-surface-container text-on-surface hover:bg-surface-container-high text-body-md px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Export Full JSON Ledger</span>
            </button>

            <button
              onClick={() => {
                if (confirm('Reset transactions and budgets back to initial October demo data?')) {
                  onResetData();
                }
              }}
              className="bg-error/10 text-error hover:bg-error hover:text-white text-body-md px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              <span>Reset Demo State</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
