export type TransactionType = 'income' | 'expense';

export type TransactionStatus = 'Settled' | 'Completed' | 'Pending';

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. 09:30 AM
  title: string;
  subtitle?: string;
  merchant: string;
  category: string;
  account: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  notes?: string;
  referenceId?: string;
  isVerified?: boolean;
  hasReceipt?: boolean;
  receiptName?: string;
  receiptSize?: string;
  isRecurring?: boolean;
  isAutoDebit?: boolean;
  splitWith?: string[];
}

export interface CategoryBreakdown {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  budgetCap: number;
  color: string;
  icon: string;
  classification: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  currentAmount: number;
  targetAmount: number;
  deadline: string;
  monthlyContribution: number;
  category: string;
  color: string;
}

export interface RecurringPayment {
  id: string;
  name: string;
  service: string;
  amount: number;
  dueDate: string;
  billingCycle: 'monthly' | 'yearly';
  paymentMethod: string;
  status: 'Active' | 'Paused' | 'Redundant';
  category: string;
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success';
}
