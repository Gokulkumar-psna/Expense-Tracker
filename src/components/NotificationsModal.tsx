import React from 'react';
import { AppNotification } from '../types/finance';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-20">
      <div className="fixed inset-0 bg-black/20 backdrop-blur-xs" onClick={onClose} />
      
      <div className="relative bg-surface-container-lowest rounded-2xl w-full max-w-sm shadow-2xl p-space-md z-10 border border-surface-container flex flex-col gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
        <div className="flex items-center justify-between pb-2 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">notifications</span>
            <span className="font-bold text-title-md text-on-surface">Notifications</span>
            <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-full">
              {notifications.filter(n => !n.read).length} new
            </span>
          </div>
          <button 
            onClick={onMarkAllRead}
            className="text-primary text-label-sm font-semibold hover:underline cursor-pointer"
          >
            Mark all read
          </button>
        </div>

        <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
          {notifications.map((item) => (
            <div 
              key={item.id}
              className={`p-3 rounded-xl transition-colors border ${
                item.read 
                  ? 'bg-surface-container-low/40 border-transparent text-on-surface-variant' 
                  : 'bg-surface-container-low border-surface-container text-on-surface'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-label-md font-semibold text-on-surface">{item.title}</span>
                <span className="text-[10px] text-on-surface-variant">{item.time}</span>
              </div>
              <p className="text-body-sm text-on-surface-variant leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-surface-container flex justify-end">
          <button
            onClick={onClose}
            className="text-label-md px-3 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
