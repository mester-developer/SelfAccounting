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
  { id: 'cat_savings_deposit', name: 'واریز به پس‌انداز', type: 'expense', icon: 'PiggyBank', color: '#6366f1', isDefault: true },

  // Income
  { id: 'cat_salary', name: 'حقوق و دستمزد', type: 'income', icon: 'Briefcase', color: '#22c55e', isDefault: true },
  { id: 'cat_bonus', name: 'پاداش و کارانه', type: 'income', icon: 'Award', color: '#10b981', isDefault: true },
  { id: 'cat_investment_returns', name: 'سود سرمایه‌گذاری', type: 'income', icon: 'TrendingUp', color: '#3b82f6', isDefault: true },
  { id: 'cat_other_income', name: 'سایر درآمدها', type: 'income', icon: 'Coins', color: '#8b5cf6', isDefault: true },
];

// Initial Default Empty Lists for Clean Startup
export const DEFAULT_ACCOUNTS: Account[] = [
  {
    id: 'acc_main',
    name: 'حساب اصلی (بانک)',
    type: 'bank',
    balance: 0,
    currency: 'TOMAN',
    bankName: 'بانک اصلی',
    color: '#6366f1',
    icon: 'Building2',
    isFavorite: true,
  },
];

export const DEFAULT_TRANSACTIONS: Transaction[] = [];
export const DEFAULT_BUDGETS: Budget[] = [];
export const DEFAULT_DEBTS: Debt[] = [];
export const DEFAULT_LOANS: Loan[] = [];
export const DEFAULT_CHEQUES: Cheque[] = [];
export const DEFAULT_GOALS: FinancialGoal[] = [];
export const DEFAULT_SUBSCRIPTIONS: Subscription[] = [];
export const DEFAULT_INVESTMENTS: InvestmentAsset[] = [];
export const DEFAULT_NOTIFICATIONS: NotificationItem[] = [];

// Sample Demo Data (Loadable via Settings)
export const DEMO_ACCOUNTS: Account[] = [
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

export const DEMO_TRANSACTIONS: Transaction[] = [
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
];

export const DEMO_BUDGETS: Budget[] = [
  { id: 'b_groc', categoryId: 'cat_groceries', amount: 8000000, period: 'monthly', warningThresholdPercent: 80 },
  { id: 'b_rest', categoryId: 'cat_restaurant', amount: 4000000, period: 'monthly', warningThresholdPercent: 75 },
];

export const DEMO_DEBTS: Debt[] = [
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
];

export const DEMO_LOANS: Loan[] = [
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

export const DEMO_CHEQUES: Cheque[] = [
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

export const DEMO_GOALS: FinancialGoal[] = [
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
];

export const DEMO_SUBSCRIPTIONS: Subscription[] = [
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
];

export const DEMO_INVESTMENTS: InvestmentAsset[] = [
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

export const DEMO_NOTIFICATIONS: NotificationItem[] = [
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
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      if (!data) return DEFAULT_ACCOUNTS;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : DEFAULT_ACCOUNTS;
    } catch (e) {
      console.error('[StorageAPI] Failed to parse accounts, falling back to defaults.', e);
      return DEFAULT_ACCOUNTS;
    }
  },
  saveAccounts(accounts: Account[]) {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  },

  getTransactions(): Transaction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (!data) return DEFAULT_TRANSACTIONS;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : DEFAULT_TRANSACTIONS;
    } catch (e) {
      console.error('[StorageAPI] Failed to parse transactions, falling back to defaults.', e);
      return DEFAULT_TRANSACTIONS;
    }
  },
  saveTransactions(transactions: Transaction[]) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  },

  getCategories(): Category[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (!data) return DEFAULT_CATEGORIES;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : DEFAULT_CATEGORIES;
    } catch (e) {
      console.error('[StorageAPI] Failed to parse categories, falling back to defaults.', e);
      return DEFAULT_CATEGORIES;
    }
  },
  saveCategories(categories: Category[]) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },

  getBudgets(): Budget[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BUDGETS);
      if (!data) return DEFAULT_BUDGETS;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : DEFAULT_BUDGETS;
    } catch (e) {
      console.error('[StorageAPI] Failed to parse budgets, falling back to defaults.', e);
      return DEFAULT_BUDGETS;
    }
  },
  saveBudgets(budgets: Budget[]) {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  },

  getDebts(): Debt[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DEBTS);
      if (!data) return DEFAULT_DEBTS;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : DEFAULT_DEBTS;
    } catch (e) {
      console.error('[StorageAPI] Failed to parse debts, falling back to defaults.', e);
      return DEFAULT_DEBTS;
    }
  },
  saveDebts(debts: Debt[]) {
    localStorage.setItem(STORAGE_KEYS.DEBTS, JSON.stringify(debts));
  },

  getLoans(): Loan[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LOANS);
      if (!data) return DEFAULT_LOANS;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : DEFAULT_LOANS;
    } catch (e) {
      console.error('[StorageAPI] Failed to parse loans, falling back to defaults.', e);
      return DEFAULT_LOANS;
    }
  },
  saveLoans(loans: Loan[]) {
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));
  },

  getCheques(): Cheque[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHEQUES);
      if (!data) return DEFAULT_CHEQUES;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : DEFAULT_CHEQUES;
    } catch (e) {
      console.error('[StorageAPI] Failed to parse cheques, falling back to defaults.', e);
      return DEFAULT_CHEQUES;
    }
  },
  saveCheques(cheques: Cheque[]) {
    localStorage.setItem(STORAGE_KEYS.CHEQUES, JSON.stringify(cheques));
  },

  getGoals(): FinancialGoal[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GOALS);
      if (!data) return DEFAULT_GOALS;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : DEFAULT_GOALS;
    } catch (e) {
      console.error('[StorageAPI] Failed to parse goals, falling back to defaults.', e);
      return DEFAULT_GOALS;
    }
  },
  saveGoals(goals: FinancialGoal[]) {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  },

  getSubscriptions(): Subscription[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
      if (!data) return DEFAULT_SUBSCRIPTIONS;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : DEFAULT_SUBSCRIPTIONS;
    } catch (e) {
      console.error('[StorageAPI] Failed to parse subscriptions, falling back to defaults.', e);
      return DEFAULT_SUBSCRIPTIONS;
    }
  },
  saveSubscriptions(subs: Subscription[]) {
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subs));
  },

  getInvestments(): InvestmentAsset[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INVESTMENTS);
      if (!data) return DEFAULT_INVESTMENTS;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : DEFAULT_INVESTMENTS;
    } catch (e) {
      console.error('[StorageAPI] Failed to parse investments, falling back to defaults.', e);
      return DEFAULT_INVESTMENTS;
    }
  },
  saveInvestments(investments: InvestmentAsset[]) {
    localStorage.setItem(STORAGE_KEYS.INVESTMENTS, JSON.stringify(investments));
  },

  getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) return DEFAULT_SETTINGS;
      const parsed = JSON.parse(data);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
        ? { ...DEFAULT_SETTINGS, ...parsed }
        : DEFAULT_SETTINGS;
    } catch (e) {
      console.error('[StorageAPI] Failed to parse settings, falling back to defaults.', e);
      return DEFAULT_SETTINGS;
    }
  },
  saveSettings(settings: UserSettings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  getNotifications(): NotificationItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (!data) return DEFAULT_NOTIFICATIONS;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : DEFAULT_NOTIFICATIONS;
    } catch (e) {
      console.error('[StorageAPI] Failed to parse notifications, falling back to defaults.', e);
      return DEFAULT_NOTIFICATIONS;
    }
  },
  saveNotifications(notifs: NotificationItem[]) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  },

  resetAllData() {
    localStorage.clear();
    this.saveAccounts(DEFAULT_ACCOUNTS);
    this.saveTransactions(DEFAULT_TRANSACTIONS);
    this.saveCategories(DEFAULT_CATEGORIES);
    this.saveBudgets(DEFAULT_BUDGETS);
    this.saveDebts(DEFAULT_DEBTS);
    this.saveLoans(DEFAULT_LOANS);
    this.saveCheques(DEFAULT_CHEQUES);
    this.saveGoals(DEFAULT_GOALS);
    this.saveSubscriptions(DEFAULT_SUBSCRIPTIONS);
    this.saveInvestments(DEFAULT_INVESTMENTS);
    this.saveSettings(DEFAULT_SETTINGS);
    this.saveNotifications(DEFAULT_NOTIFICATIONS);
  },

  loadDemoData() {
    this.saveAccounts(DEMO_ACCOUNTS);
    this.saveTransactions(DEMO_TRANSACTIONS);
    this.saveCategories(DEFAULT_CATEGORIES);
    this.saveBudgets(DEMO_BUDGETS);
    this.saveDebts(DEMO_DEBTS);
    this.saveLoans(DEMO_LOANS);
    this.saveCheques(DEMO_CHEQUES);
    this.saveGoals(DEMO_GOALS);
    this.saveSubscriptions(DEMO_SUBSCRIPTIONS);
    this.saveInvestments(DEMO_INVESTMENTS);
    this.saveNotifications(DEMO_NOTIFICATIONS);
  },

  initializeDefaultsIfEmpty() {
    // Migration check: Clean old initial demo data if user was on previous pre-populated version
    if (!localStorage.getItem('wealthpulse_clean_init_v2')) {
      const existingLoans = this.getLoans();
      if (existingLoans.some((l) => l.id === 'loan_1')) {
        this.saveLoans(DEFAULT_LOANS);
      }
      const existingDebts = this.getDebts();
      if (existingDebts.some((d) => d.id === 'debt_1' || d.id === 'debt_2')) {
        this.saveDebts(DEFAULT_DEBTS);
      }
      const existingAccs = this.getAccounts();
      if (existingAccs.some((a) => a.id === 'acc_pasargad' || a.id === 'acc_mellat')) {
        this.saveAccounts(DEFAULT_ACCOUNTS);
      }
      const existingTxs = this.getTransactions();
      if (existingTxs.some((t) => t.id === 'tx_1' || t.id === 'tx_6')) {
        this.saveTransactions(DEFAULT_TRANSACTIONS);
      }
      const existingBudgets = this.getBudgets();
      if (existingBudgets.some((b) => b.id === 'b_groc')) {
        this.saveBudgets(DEFAULT_BUDGETS);
      }
      const existingGoals = this.getGoals();
      if (existingGoals.some((g) => g.id === 'goal_1' || g.id === 'goal_2')) {
        this.saveGoals(DEFAULT_GOALS);
      }
      const existingSubs = this.getSubscriptions();
      if (existingSubs.some((s) => s.id === 'sub_1' || s.id === 'sub_2')) {
        this.saveSubscriptions(DEFAULT_SUBSCRIPTIONS);
      }
      const existingInvs = this.getInvestments();
      if (existingInvs.some((i) => i.id === 'inv_1' || i.id === 'inv_2')) {
        this.saveInvestments(DEFAULT_INVESTMENTS);
      }
      localStorage.setItem('wealthpulse_clean_init_v2', 'true');
    }

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
  updateBudget(b: Budget): Budget[] {
    const list = this.getBudgets();
    const updated = list.map((item) => (item.id === b.id ? b : item));
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
  updateSubscription(s: Subscription): Subscription[] {
    const list = this.getSubscriptions();
    const updated = list.map((item) => (item.id === s.id ? s : item));
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
  updateInvestment(inv: InvestmentAsset): InvestmentAsset[] {
    const list = this.getInvestments();
    const updated = list.map((item) => (item.id === inv.id ? inv : item));
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
  updateCategory(cat: Category): Category[] {
    const list = this.getCategories();
    const updated = list.map((item) => (item.id === cat.id ? cat : item));
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

  importBackupJSON(jsonString: string): { success: boolean; skippedCount: number } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') return { success: false, skippedCount: 0 };

      let skippedCount = 0;

      const isValidAccount = (a: any): a is Account =>
        a &&
        typeof a === 'object' &&
        typeof a.id === 'string' &&
        typeof a.name === 'string' &&
        typeof a.balance === 'number' &&
        isFinite(a.balance);

      const isValidTransaction = (t: any): t is Transaction =>
        t &&
        typeof t === 'object' &&
        typeof t.id === 'string' &&
        typeof t.amount === 'number' &&
        isFinite(t.amount) &&
        typeof t.accountId === 'string' &&
        typeof t.date === 'string' &&
        ['income', 'expense', 'transfer', 'refund'].includes(t.type);

      if (Array.isArray(parsed.accounts)) {
        const validAccounts = parsed.accounts.filter(isValidAccount);
        skippedCount += parsed.accounts.length - validAccounts.length;
        this.saveAccounts(validAccounts);
      }
      if (Array.isArray(parsed.transactions)) {
        const validTransactions = parsed.transactions.filter(isValidTransaction);
        skippedCount += parsed.transactions.length - validTransactions.length;
        this.saveTransactions(validTransactions);
      }
      if (Array.isArray(parsed.categories)) this.saveCategories(parsed.categories);
      if (Array.isArray(parsed.budgets)) this.saveBudgets(parsed.budgets);
      if (Array.isArray(parsed.debts)) this.saveDebts(parsed.debts);
      if (Array.isArray(parsed.loans)) this.saveLoans(parsed.loans);
      if (Array.isArray(parsed.cheques)) this.saveCheques(parsed.cheques);
      if (Array.isArray(parsed.goals)) this.saveGoals(parsed.goals);
      if (Array.isArray(parsed.subscriptions)) this.saveSubscriptions(parsed.subscriptions);
      if (Array.isArray(parsed.investments)) this.saveInvestments(parsed.investments);
      if (parsed.settings && typeof parsed.settings === 'object') this.saveSettings(parsed.settings);

      return { success: true, skippedCount };
    } catch (e) {
      return { success: false, skippedCount: 0 };
    }
  },
};
