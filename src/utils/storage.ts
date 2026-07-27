import {
  Account,
  Transaction,
  Category,
  Budget,
  Debt,
  Loan,
  Cheque,
  FinancialGoal,
  Subscription,
  InvestmentAsset,
  UserSettings,
  NotificationItem,
} from '../types';
import { getTodayIso } from './formatters';

const STORAGE_KEYS = {
  ACCOUNTS: 'wealthpulse_accounts',
  TRANSACTIONS: 'wealthpulse_transactions',
  CATEGORIES: 'wealthpulse_categories',
  BUDGETS: 'wealthpulse_budgets',
  DEBTS: 'wealthpulse_debts',
  LOANS: 'wealthpulse_loans',
  CHEQUES: 'wealthpulse_cheques',
  GOALS: 'wealthpulse_goals',
  SUBSCRIPTIONS: 'wealthpulse_subscriptions',
  INVESTMENTS: 'wealthpulse_investments',
  SETTINGS: 'wealthpulse_settings',
  NOTIFICATIONS: 'wealthpulse_notifications',
};

// Initial Default Categories
export const DEFAULT_CATEGORIES: Category[] = [
  // Expenses
  { id: 'cat_groceries', name: 'خوراکی و سوپرمارکت', type: 'expense', icon: 'ShoppingBag', color: '#10b981', isDefault: true },
  { id: 'cat_housing', name: 'مسکن و اجاره', type: 'expense', icon: 'Home', color: '#6366f1', isDefault: true },
  { id: 'cat_transport', name: 'حمل‌ونقل و سوخت', type: 'expense', icon: 'Car', color: '#f59e0b', isDefault: true },
  { id: 'cat_restaurant', name: 'رستوران و فست‌فود', type: 'expense', icon: 'Utensils', color: '#ef4444', isDefault: true },
  { id: 'cat_health', name: 'درمان و سلامت', type: 'expense', icon: 'HeartPulse', color: '#ec4899', isDefault: true },
  { id: 'cat_entertainment', name: 'تفریح و گردشگری', type: 'expense', icon: 'Film', color: '#8b5cf6', isDefault: true },
  { id: 'cat_bills', name: 'قبوض و شارژ', type: 'expense', icon: 'Zap', color: '#3b82f6', isDefault: true },
  { id: 'cat_apparel', name: 'پوشاک و زیبایی', type: 'expense', icon: 'Shirt', color: '#14b8a6', isDefault: true },
  { id: 'cat_education', name: 'آموزش و کتاب', type: 'expense', icon: 'GraduationCap', color: '#06b6d4', isDefault: true },
  { id: 'cat_installments', name: 'اقساط و وام', type: 'expense', icon: 'CreditCard', color: '#d97706', isDefault: true },

  // Income
  { id: 'cat_salary', name: 'حقوق و دستمزد', type: 'income', icon: 'Briefcase', color: '#22c55e', isDefault: true },
  { id: 'cat_bonus', name: 'پاداش و کارانه', type: 'income', icon: 'Award', color: '#10b981', isDefault: true },
  { id: 'cat_investment_returns', name: 'سود سرمایه‌گذاری', type: 'income', icon: 'TrendingUp', color: '#3b82f6', isDefault: true },
  { id: 'cat_other_income', name: 'سایر درآمدها', type: 'income', icon: 'Coins', color: '#8b5cf6', isDefault: true },
];

// Initial Accounts
export const DEFAULT_ACCOUNTS: Account[] = [
  {
    id: 'acc_pasargad',
    name: 'کارت اصلی بانک پاسارگاد',
    type: 'card',
    balance: 48500000,
    currency: 'TOMAN',
    cardNumber: '5022-2910-4321-8890',
    bankName: 'بانک پاسارگاد',
    color: '#eab308',
    icon: 'CreditCard',
    isFavorite: true,
  },
  {
    id: 'acc_mellat',
    name: 'حساب سپرده بانک ملت',
    type: 'bank',
    balance: 120000000,
    currency: 'TOMAN',
    accountNumber: '82947102948',
    bankName: 'بانک ملت',
    color: '#ef4444',
    icon: 'Building2',
    isFavorite: true,
  },
  {
    id: 'acc_cash',
    name: 'کیف پول نقد',
    type: 'cash',
    balance: 4200000,
    currency: 'TOMAN',
    color: '#10b981',
    icon: 'Wallet',
  },
  {
    id: 'acc_gold',
    name: 'صندوق طلای ۱۸ عیار',
    type: 'gold',
    balance: 85000000,
    currency: 'TOMAN',
    color: '#f59e0b',
    icon: 'Coins',
  },
  {
    id: 'acc_crypto',
    name: 'ولـت تتر و کریپتو (Nobitex)',
    type: 'crypto',
    balance: 62000000,
    currency: 'TOMAN',
    color: '#6366f1',
    icon: 'Bitcoin',
  },
];

// Initial Transactions
export const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_1',
    type: 'income',
    amount: 38000000,
    accountId: 'acc_mellat',
    categoryId: 'cat_salary',
    date: '2026-07-25',
    note: 'واریز حقوق تیرماه شرکت',
    tags: ['شرکت', 'حقوق'],
  },
  {
    id: 'tx_2',
    type: 'expense',
    amount: 3200000,
    accountId: 'acc_pasargad',
    categoryId: 'cat_groceries',
    date: '2026-07-26',
    note: 'خرید ماهانه هایپرمارکت',
    tags: ['خرید', 'هایپر'],
    location: { name: 'هایپراستار ارم' },
  },
  {
    id: 'tx_3',
    type: 'expense',
    amount: 1450000,
    accountId: 'acc_pasargad',
    categoryId: 'cat_restaurant',
    date: '2026-07-24',
    note: 'شام با دوستان در رستوران',
    tags: ['تفریح', 'رستوران'],
  },
  {
    id: 'tx_4',
    type: 'expense',
    amount: 650000,
    accountId: 'acc_pasargad',
    categoryId: 'cat_transport',
    date: '2026-07-23',
    note: 'بنزین و اسنپ هفتگی',
    tags: ['اسنپ', 'سوخت'],
  },
  {
    id: 'tx_5',
    type: 'transfer',
    amount: 5000000,
    accountId: 'acc_mellat',
    targetAccountId: 'acc_gold',
    categoryId: 'cat_investment_returns',
    date: '2026-07-20',
    note: 'انتقال برای خرید ۲ گرم طلای مستعمل',
    tags: ['طلا', 'سرمایه‌گذاری'],
  },
  {
    id: 'tx_6',
    type: 'expense',
    amount: 12000000,
    accountId: 'acc_mellat',
    categoryId: 'cat_housing',
    date: '2026-07-01',
    note: 'پرداخت اجاره‌بهای ماهانه خانه',
    tags: ['اجاره', 'مسکن'],
    isRecurring: true,
    recurringInterval: 'monthly',
  },
];

// Initial Budgets
export const DEFAULT_BUDGETS: Budget[] = [
  { id: 'b_groc', categoryId: 'cat_groceries', amount: 8000000, period: 'monthly', warningThresholdPercent: 80 },
  { id: 'b_rest', categoryId: 'cat_restaurant', amount: 4000000, period: 'monthly', warningThresholdPercent: 75 },
  { id: 'b_trans', categoryId: 'cat_transport', amount: 3000000, period: 'monthly', warningThresholdPercent: 85 },
  { id: 'b_house', categoryId: 'cat_housing', amount: 15000000, period: 'monthly', warningThresholdPercent: 90 },
];

// Initial Debts & Loans
export const DEFAULT_DEBTS: Debt[] = [
  {
    id: 'debt_1',
    personName: 'علی رضایی',
    type: 'debtor',
    totalAmount: 15000000,
    paidAmount: 5000000,
    dueDate: '2026-08-15',
    description: 'قرض جهت خرید لپ‌تاپ',
    status: 'active',
  },
  {
    id: 'debt_2',
    personName: 'مهندس احمدی (صاحبخانه)',
    type: 'creditor',
    totalAmount: 30000000,
    paidAmount: 10000000,
    dueDate: '2026-09-01',
    description: 'باقیمانده ودیعه مسکن',
    status: 'active',
  },
];

export const DEFAULT_LOANS: Loan[] = [
  {
    id: 'loan_1',
    title: 'وام مرابحه بانک پاسارگاد',
    bankOrLender: 'بانک پاسارگاد',
    totalAmount: 100000000,
    remainingAmount: 60000000,
    monthlyInstallment: 4100000,
    totalInstallments: 24,
    paidInstallments: 10,
    startDate: '2025-09-01',
    nextDueDate: '2026-08-05',
  },
];

export const DEFAULT_CHEQUES: Cheque[] = [
  {
    id: 'ch_1',
    chequeNumber: '928371',
    type: 'issued',
    amount: 18000000,
    bankName: 'پاسارگاد',
    payeeOrPayer: 'فروشگاه لوازم خانگی سام',
    issueDate: '2026-07-10',
    dueDate: '2026-08-20',
    status: 'pending',
    note: 'بابت قسط دوم خریدهای خرداد',
  },
];

export const DEFAULT_GOALS: FinancialGoal[] = [
  {
    id: 'goal_1',
    title: 'خرید خودروی شخصی',
    targetAmount: 450000000,
    currentAmount: 185000000,
    targetDate: '2027-03-20',
    category: 'purchase',
    icon: 'Car',
    color: '#3b82f6',
  },
  {
    id: 'goal_2',
    title: 'صندوق ذخیره اضطراری ۶ ماهه',
    targetAmount: 150000000,
    currentAmount: 95000000,
    targetDate: '2026-12-29',
    category: 'emergency',
    icon: 'ShieldCheck',
    color: '#10b981',
  },
];

export const DEFAULT_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub_1',
    name: 'اینترنت فیبر نوری شاتل',
    amount: 450000,
    billingCycle: 'monthly',
    nextBillingDate: '2026-08-05',
    category: 'خدمات شبکه',
    icon: 'Wifi',
    autoRenew: true,
    accountId: 'acc_pasargad',
  },
  {
    id: 'sub_2',
    name: 'اشتراک ۱ ساله فیلیمو و نماوا',
    amount: 890000,
    billingCycle: 'yearly',
    nextBillingDate: '2026-11-15',
    category: 'سرگرمی',
    icon: 'Tv',
    autoRenew: false,
    accountId: 'acc_pasargad',
  },
];

export const DEFAULT_INVESTMENTS: InvestmentAsset[] = [
  {
    id: 'inv_1',
    name: 'طلای ۱۸ عیار آبشده',
    symbol: 'GOLD18',
    type: 'gold',
    quantity: 18.5,
    buyPrice: 3800000,
    currentPrice: 4250000,
    purchaseDate: '2026-03-10',
    unit: 'گرم',
  },
  {
    id: 'inv_2',
    name: 'تتر (USDT)',
    symbol: 'USDT',
    type: 'crypto',
    quantity: 1000,
    buyPrice: 59500,
    currentPrice: 62000,
    purchaseDate: '2026-05-01',
    unit: 'تتر',
  },
  {
    id: 'inv_3',
    name: 'فولاد مبارکه اصفهان',
    symbol: 'فولاد',
    type: 'stock',
    quantity: 25000,
    buyPrice: 520,
    currentPrice: 580,
    purchaseDate: '2026-01-15',
    unit: 'سهم',
  },
];

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  currency: 'TOMAN',
  language: 'fa',
  dateFormat: 'jalali',
  isPinEnabled: false,
  isBiometricsEnabled: false,
  enableNotifications: true,
};

export const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'سررسید اقساط وام پاسارگاد',
    message: 'قسط ۴,۱۰۰,۰۰۰ تومانی بانک پاسارگاد تا ۵ روز دیگر سررسید می‌شود.',
    date: '2026-07-26',
    type: 'warning',
    read: false,
  },
  {
    id: 'notif_2',
    title: 'هشدار مصرف بودجه خوراکی',
    message: 'شما به ۷۵٪ سقف بودجه خوراکی این ماه نزدیک شده‌اید.',
    date: '2026-07-25',
    type: 'info',
    read: true,
  },
];

// Helper Storage API
export const StorageAPI = {
  getAccounts(): Account[] {
    const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    return data ? JSON.parse(data) : DEFAULT_ACCOUNTS;
  },
  saveAccounts(accounts: Account[]) {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  },

  getTransactions(): Transaction[] {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : DEFAULT_TRANSACTIONS;
  },
  saveTransactions(transactions: Transaction[]) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  },

  getCategories(): Category[] {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : DEFAULT_CATEGORIES;
  },
  saveCategories(categories: Category[]) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },

  getBudgets(): Budget[] {
    const data = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    return data ? JSON.parse(data) : DEFAULT_BUDGETS;
  },
  saveBudgets(budgets: Budget[]) {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  },

  getDebts(): Debt[] {
    const data = localStorage.getItem(STORAGE_KEYS.DEBTS);
    return data ? JSON.parse(data) : DEFAULT_DEBTS;
  },
  saveDebts(debts: Debt[]) {
    localStorage.setItem(STORAGE_KEYS.DEBTS, JSON.stringify(debts));
  },

  getLoans(): Loan[] {
    const data = localStorage.getItem(STORAGE_KEYS.LOANS);
    return data ? JSON.parse(data) : DEFAULT_LOANS;
  },
  saveLoans(loans: Loan[]) {
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));
  },

  getCheques(): Cheque[] {
    const data = localStorage.getItem(STORAGE_KEYS.CHEQUES);
    return data ? JSON.parse(data) : DEFAULT_CHEQUES;
  },
  saveCheques(cheques: Cheque[]) {
    localStorage.setItem(STORAGE_KEYS.CHEQUES, JSON.stringify(cheques));
  },

  getGoals(): FinancialGoal[] {
    const data = localStorage.getItem(STORAGE_KEYS.GOALS);
    return data ? JSON.parse(data) : DEFAULT_GOALS;
  },
  saveGoals(goals: FinancialGoal[]) {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  },

  getSubscriptions(): Subscription[] {
    const data = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
    return data ? JSON.parse(data) : DEFAULT_SUBSCRIPTIONS;
  },
  saveSubscriptions(subs: Subscription[]) {
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subs));
  },

  getInvestments(): InvestmentAsset[] {
    const data = localStorage.getItem(STORAGE_KEYS.INVESTMENTS);
    return data ? JSON.parse(data) : DEFAULT_INVESTMENTS;
  },
  saveInvestments(investments: InvestmentAsset[]) {
    localStorage.setItem(STORAGE_KEYS.INVESTMENTS, JSON.stringify(investments));
  },

  getSettings(): UserSettings {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  },
  saveSettings(settings: UserSettings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  getNotifications(): NotificationItem[] {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return data ? JSON.parse(data) : DEFAULT_NOTIFICATIONS;
  },
  saveNotifications(notifs: NotificationItem[]) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  },

  resetAllData() {
    localStorage.clear();
  },

  initializeDefaultsIfEmpty() {
    if (!localStorage.getItem(STORAGE_KEYS.ACCOUNTS)) {
      this.saveAccounts(DEFAULT_ACCOUNTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
      this.saveTransactions(DEFAULT_TRANSACTIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      this.saveCategories(DEFAULT_CATEGORIES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.BUDGETS)) {
      this.saveBudgets(DEFAULT_BUDGETS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.DEBTS)) {
      this.saveDebts(DEFAULT_DEBTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.LOANS)) {
      this.saveLoans(DEFAULT_LOANS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CHEQUES)) {
      this.saveCheques(DEFAULT_CHEQUES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.GOALS)) {
      this.saveGoals(DEFAULT_GOALS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS)) {
      this.saveSubscriptions(DEFAULT_SUBSCRIPTIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.INVESTMENTS)) {
      this.saveInvestments(DEFAULT_INVESTMENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      this.saveSettings(DEFAULT_SETTINGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      this.saveNotifications(DEFAULT_NOTIFICATIONS);
    }
  },

  addAccount(acc: Omit<Account, 'id'>): Account[] {
    const list = this.getAccounts();
    const newAcc: Account = { ...acc, id: `acc_${Date.now()}` };
    const updated = [newAcc, ...list];
    this.saveAccounts(updated);
    return updated;
  },
  updateAccount(acc: Account): Account[] {
    const list = this.getAccounts();
    const updated = list.map((a) => (a.id === acc.id ? acc : a));
    this.saveAccounts(updated);
    return updated;
  },
  deleteAccount(id: string): Account[] {
    const updated = this.getAccounts().filter((a) => a.id !== id);
    this.saveAccounts(updated);
    return updated;
  },

  addTransaction(tx: Omit<Transaction, 'id'>): Transaction[] {
    const list = this.getTransactions();
    const newTx: Transaction = { ...tx, id: `tx_${Date.now()}` };
    const updated = [newTx, ...list];
    this.saveTransactions(updated);

    // Update balance on account
    const accounts = this.getAccounts();
    const targetAccId = tx.toAccountId || tx.targetAccountId;
    const updatedAccounts = accounts.map((acc) => {
      if (acc.id === tx.accountId) {
        if (tx.type === 'expense') return { ...acc, balance: acc.balance - tx.amount };
        if (tx.type === 'income' || tx.type === 'refund') return { ...acc, balance: acc.balance + tx.amount };
        if (tx.type === 'transfer') return { ...acc, balance: acc.balance - tx.amount };
      }
      if (tx.type === 'transfer' && targetAccId && acc.id === targetAccId) {
        return { ...acc, balance: acc.balance + tx.amount };
      }
      return acc;
    });
    this.saveAccounts(updatedAccounts);

    return updated;
  },

  updateTransaction(tx: Transaction): Transaction[] {
    const list = this.getTransactions();
    const oldTx = list.find((t) => t.id === tx.id);
    if (!oldTx) return list;

    // First revert old transaction effect
    let accounts = this.getAccounts();
    const oldTargetAccId = oldTx.toAccountId || oldTx.targetAccountId;
    accounts = accounts.map((acc) => {
      if (acc.id === oldTx.accountId) {
        if (oldTx.type === 'expense') return { ...acc, balance: acc.balance + oldTx.amount };
        if (oldTx.type === 'income' || oldTx.type === 'refund') return { ...acc, balance: acc.balance - oldTx.amount };
        if (oldTx.type === 'transfer') return { ...acc, balance: acc.balance + oldTx.amount };
      }
      if (oldTx.type === 'transfer' && oldTargetAccId && acc.id === oldTargetAccId) {
        return { ...acc, balance: acc.balance - oldTx.amount };
      }
      return acc;
    });

    // Apply new transaction effect
    const newTargetAccId = tx.toAccountId || tx.targetAccountId;
    accounts = accounts.map((acc) => {
      if (acc.id === tx.accountId) {
        if (tx.type === 'expense') return { ...acc, balance: acc.balance - tx.amount };
        if (tx.type === 'income' || tx.type === 'refund') return { ...acc, balance: acc.balance + tx.amount };
        if (tx.type === 'transfer') return { ...acc, balance: acc.balance - tx.amount };
      }
      if (tx.type === 'transfer' && newTargetAccId && acc.id === newTargetAccId) {
        return { ...acc, balance: acc.balance + tx.amount };
      }
      return acc;
    });
    this.saveAccounts(accounts);

    const updated = list.map((t) => (t.id === tx.id ? tx : t));
    this.saveTransactions(updated);
    return updated;
  },

  deleteTransaction(id: string): Transaction[] {
    const list = this.getTransactions();
    const targetTx = list.find((t) => t.id === id);
    if (targetTx) {
      const accounts = this.getAccounts();
      const targetAccId = targetTx.toAccountId || targetTx.targetAccountId;
      const updatedAccounts = accounts.map((acc) => {
        if (acc.id === targetTx.accountId) {
          if (targetTx.type === 'expense') return { ...acc, balance: acc.balance + targetTx.amount };
          if (targetTx.type === 'income' || targetTx.type === 'refund') return { ...acc, balance: acc.balance - targetTx.amount };
          if (targetTx.type === 'transfer') return { ...acc, balance: acc.balance + targetTx.amount };
        }
        if (targetTx.type === 'transfer' && targetAccId && acc.id === targetAccId) {
          return { ...acc, balance: acc.balance - targetTx.amount };
        }
        return acc;
      });
      this.saveAccounts(updatedAccounts);
    }

    const updated = list.filter((t) => t.id !== id);
    this.saveTransactions(updated);
    return updated;
  },

  addBudget(b: Omit<Budget, 'id'>): Budget[] {
    const list = this.getBudgets();
    const newB: Budget = { ...b, id: `b_${Date.now()}` };
    const updated = [newB, ...list];
    this.saveBudgets(updated);
    return updated;
  },
  deleteBudget(id: string): Budget[] {
    const updated = this.getBudgets().filter((b) => b.id !== id);
    this.saveBudgets(updated);
    return updated;
  },

  addDebt(d: Omit<Debt, 'id'>): Debt[] {
    const list = this.getDebts();
    const newD: Debt = { ...d, id: `d_${Date.now()}` };
    const updated = [newD, ...list];
    this.saveDebts(updated);
    return updated;
  },
  updateDebt(d: Debt): Debt[] {
    const list = this.getDebts();
    const updated = list.map((item) => (item.id === d.id ? d : item));
    this.saveDebts(updated);
    return updated;
  },
  deleteDebt(id: string): Debt[] {
    const updated = this.getDebts().filter((d) => d.id !== id);
    this.saveDebts(updated);
    return updated;
  },

  addLoan(l: Omit<Loan, 'id'>): Loan[] {
    const list = this.getLoans();
    const newL: Loan = { ...l, id: `l_${Date.now()}` };
    const updated = [newL, ...list];
    this.saveLoans(updated);
    return updated;
  },
  updateLoan(l: Loan): Loan[] {
    const list = this.getLoans();
    const updated = list.map((item) => (item.id === l.id ? l : item));
    this.saveLoans(updated);
    return updated;
  },
  deleteLoan(id: string): Loan[] {
    const updated = this.getLoans().filter((l) => l.id !== id);
    this.saveLoans(updated);
    return updated;
  },

  addCheque(c: Omit<Cheque, 'id'>): Cheque[] {
    const list = this.getCheques();
    const newC: Cheque = { ...c, id: `c_${Date.now()}` };
    const updated = [newC, ...list];
    this.saveCheques(updated);
    return updated;
  },
  deleteCheque(id: string): Cheque[] {
    const updated = this.getCheques().filter((c) => c.id !== id);
    this.saveCheques(updated);
    return updated;
  },

  addGoal(g: Omit<FinancialGoal, 'id'>): FinancialGoal[] {
    const list = this.getGoals();
    const newG: FinancialGoal = { ...g, id: `g_${Date.now()}` };
    const updated = [newG, ...list];
    this.saveGoals(updated);
    return updated;
  },
  updateGoal(g: FinancialGoal): FinancialGoal[] {
    const list = this.getGoals();
    const updated = list.map((item) => (item.id === g.id ? g : item));
    this.saveGoals(updated);
    return updated;
  },
  deleteGoal(id: string): FinancialGoal[] {
    const updated = this.getGoals().filter((g) => g.id !== id);
    this.saveGoals(updated);
    return updated;
  },

  addSubscription(s: Omit<Subscription, 'id'>): Subscription[] {
    const list = this.getSubscriptions();
    const newS: Subscription = { ...s, id: `sub_${Date.now()}` };
    const updated = [newS, ...list];
    this.saveSubscriptions(updated);
    return updated;
  },
  deleteSubscription(id: string): Subscription[] {
    const updated = this.getSubscriptions().filter((s) => s.id !== id);
    this.saveSubscriptions(updated);
    return updated;
  },

  addInvestment(inv: Omit<InvestmentAsset, 'id'>): InvestmentAsset[] {
    const list = this.getInvestments();
    const newInv: InvestmentAsset = { ...inv, id: `inv_${Date.now()}` };
    const updated = [newInv, ...list];
    this.saveInvestments(updated);
    return updated;
  },
  deleteInvestment(id: string): InvestmentAsset[] {
    const updated = this.getInvestments().filter((inv) => inv.id !== id);
    this.saveInvestments(updated);
    return updated;
  },

  addCategory(cat: Omit<Category, 'id'>): Category[] {
    const list = this.getCategories();
    const newCat: Category = { ...cat, id: `cat_${Date.now()}` };
    const updated = [newCat, ...list];
    this.saveCategories(updated);
    return updated;
  },
  deleteCategory(id: string): Category[] {
    const updated = this.getCategories().filter((c) => c.id !== id);
    this.saveCategories(updated);
    return updated;
  },

  exportBackupJSON(): string {
    const data = {
      accounts: this.getAccounts(),
      transactions: this.getTransactions(),
      categories: this.getCategories(),
      budgets: this.getBudgets(),
      debts: this.getDebts(),
      loans: this.getLoans(),
      cheques: this.getCheques(),
      goals: this.getGoals(),
      subscriptions: this.getSubscriptions(),
      investments: this.getInvestments(),
      settings: this.getSettings(),
    };
    return JSON.stringify(data, null, 2);
  },

  importBackupJSON(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') return false;

      if (Array.isArray(parsed.accounts)) this.saveAccounts(parsed.accounts);
      if (Array.isArray(parsed.transactions)) this.saveTransactions(parsed.transactions);
      if (Array.isArray(parsed.categories)) this.saveCategories(parsed.categories);
      if (Array.isArray(parsed.budgets)) this.saveBudgets(parsed.budgets);
      if (Array.isArray(parsed.debts)) this.saveDebts(parsed.debts);
      if (Array.isArray(parsed.loans)) this.saveLoans(parsed.loans);
      if (Array.isArray(parsed.cheques)) this.saveCheques(parsed.cheques);
      if (Array.isArray(parsed.goals)) this.saveGoals(parsed.goals);
      if (Array.isArray(parsed.subscriptions)) this.saveSubscriptions(parsed.subscriptions);
      if (Array.isArray(parsed.investments)) this.saveInvestments(parsed.investments);
      if (parsed.settings && typeof parsed.settings === 'object') this.saveSettings(parsed.settings);
      return true;
    } catch (e) {
      return false;
    }
  },
};
