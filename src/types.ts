export type AccountType = 
  | 'cash' 
  | 'card' 
  | 'bank' 
  | 'wallet' 
  | 'crypto' 
  | 'gold' 
  | 'investment' 
  | 'custom';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string; // 'TOMAN' | 'IRR' | 'USD' | 'EUR'
  accountNumber?: string;
  cardNumber?: string;
  bankName?: string;
  color: string;
  icon: string;
  isFavorite?: boolean;
}

export type TransactionType = 'income' | 'expense' | 'transfer' | 'refund';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  accountId: string;
  targetAccountId?: string; // For transfers
  toAccountId?: string; // Alias for targetAccountId
  categoryId?: string;
  date: string; // ISO date format YYYY-MM-DD
  note?: string;
  description?: string; // Alias for note
  tags?: string[];
  receiptImage?: string; // base64 or URL
  location?: {
    name?: string;
    lat?: number;
    lng?: number;
  };
  isRecurring?: boolean;
  recurringInterval?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  isScheduled?: boolean;
}

export interface Category {
  id: string;
  name: string;
  type: 'expense' | 'income';
  icon: string;
  color: string;
  isDefault?: boolean;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: 'monthly' | 'yearly';
  warningThresholdPercent: number; // e.g. 80 for 80%
}

export type DebtType = 'debtor' | 'creditor'; // debtor = طلبکار (others owe us), creditor = بدهکار (we owe others)

export interface Debt {
  id: string;
  personName: string;
  type: DebtType;
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
  description?: string;
  installments?: Installment[];
  status: 'active' | 'completed' | 'overdue';
}

export interface Installment {
  id: string;
  debtId?: string;
  loanId?: string;
  title: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  paidDate?: string;
}

export interface Loan {
  id: string;
  title: string;
  bankOrLender: string;
  totalAmount: number;
  remainingAmount: number;
  monthlyInstallment: number;
  totalInstallments: number;
  paidInstallments: number;
  startDate: string;
  nextDueDate: string;
}

export type ChequeType = 'issued' | 'received'; // صادره / دریافتی
export type ChequeStatus = 'pending' | 'cleared' | 'bounced' | 'cancelled';

export interface Cheque {
  id: string;
  chequeNumber: string;
  type: ChequeType;
  amount: number;
  bankName: string;
  payeeOrPayer: string;
  issueDate: string;
  dueDate: string;
  status: ChequeStatus;
  note?: string;
}

export interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: 'purchase' | 'savings' | 'emergency' | 'travel' | 'custom';
  icon: string;
  color: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate: string;
  category: string;
  icon: string;
  autoRenew: boolean;
  accountId: string;
}

export type AssetType = 'stock' | 'fund' | 'crypto' | 'gold';

export interface InvestmentAsset {
  id: string;
  name: string;
  symbol: string;
  type: AssetType;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  purchaseDate: string;
  unit: string; // e.g., 'گرم', 'عدد', 'تتر'
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  currency: 'TOMAN' | 'IRR' | 'USD' | 'EUR';
  language: 'fa' | 'en';
  dateFormat: 'jalali' | 'gregorian';
  pinCode?: string;
  isPinEnabled: boolean;
  isBiometricsEnabled: boolean;
  enableNotifications: boolean;
}

export interface AiAnalysisResult {
  healthScore: number;
  summary: string;
  savingTips: string[];
  anomalies: string[];
  cashflowForecast: {
    next30DaysIncome: number;
    next30DaysExpenses: number;
    projectedSavings: number;
    advice: string;
  };
  budgetWarnings: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'warning' | 'info' | 'success';
  read: boolean;
}
