import React, { useState, useEffect } from 'react';
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
} from './types';
import { StorageAPI } from './utils/storage';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { Dashboard } from './components/Dashboard';
import { TransactionsView } from './components/TransactionsView';
import { AccountsView } from './components/AccountsView';
import { BudgetsView } from './components/BudgetsView';
import { DebtsAndLoansView } from './components/DebtsAndLoansView';
import { GoalsView } from './components/GoalsView';
import { InvestmentsView } from './components/InvestmentsView';
import { SubscriptionsView } from './components/SubscriptionsView';
import { CalendarView } from './components/CalendarView';
import { CategoriesView } from './components/CategoriesView';
import { ReportsView } from './components/ReportsView';
import { AiAdvisorView } from './components/AiAdvisorView';
import { SettingsView } from './components/SettingsView';
import { ArchitectureDocView } from './components/ArchitectureDocView';
import { SecurityLockModal } from './components/SecurityLockModal';
import { ReceiptScannerModal } from './components/ReceiptScannerModal';
import { TransactionModal } from './components/TransactionModal';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // App State Data
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [cheques, setCheques] = useState<Cheque[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [investments, setInvestments] = useState<InvestmentAsset[]>([]);
  const [settings, setSettings] = useState<UserSettings>(StorageAPI.getSettings());

  // Security Lock
  const [isLocked, setIsLocked] = useState<boolean>(settings.isPinEnabled);

  // Global Modals
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [addTxInitialType, setAddTxInitialType] = useState<'expense' | 'income' | 'transfer'>('expense');
  const [isReceiptScannerOpen, setIsReceiptScannerOpen] = useState(false);

  // Load Data on Mount
  useEffect(() => {
    StorageAPI.initializeDefaultsIfEmpty();
    setAccounts(StorageAPI.getAccounts());
    setTransactions(StorageAPI.getTransactions());
    setCategories(StorageAPI.getCategories());
    setBudgets(StorageAPI.getBudgets());
    setDebts(StorageAPI.getDebts());
    setLoans(StorageAPI.getLoans());
    setCheques(StorageAPI.getCheques());
    setGoals(StorageAPI.getGoals());
    setSubscriptions(StorageAPI.getSubscriptions());
    setInvestments(StorageAPI.getInvestments());
    const savedSettings = StorageAPI.getSettings();
    setSettings(savedSettings);
    if (savedSettings.isPinEnabled) {
      setIsLocked(true);
    }
  }, []);

  // Sync Theme Class on Document Element
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
  }, [settings.theme]);

  // Account Handlers
  const handleAddAccount = (acc: Omit<Account, 'id'>) => {
    const updated = StorageAPI.addAccount(acc);
    setAccounts(updated);
  };
  const handleUpdateAccount = (acc: Account) => {
    const updated = StorageAPI.updateAccount(acc);
    setAccounts(updated);
  };
  const handleDeleteAccount = (id: string) => {
    const updated = StorageAPI.deleteAccount(id);
    setAccounts(updated);
  };

  // Transaction Handlers
  const handleAddTransaction = (tx: Omit<Transaction, 'id'>) => {
    const updated = StorageAPI.addTransaction(tx);
    setTransactions(updated);
    setAccounts(StorageAPI.getAccounts());
  };
  const handleDeleteTransaction = (id: string) => {
    const updated = StorageAPI.deleteTransaction(id);
    setTransactions(updated);
    setAccounts(StorageAPI.getAccounts());
  };

  // Budget Handlers
  const handleAddBudget = (b: Omit<Budget, 'id'>) => {
    const updated = StorageAPI.addBudget(b);
    setBudgets(updated);
  };
  const handleDeleteBudget = (id: string) => {
    const updated = StorageAPI.deleteBudget(id);
    setBudgets(updated);
  };

  // Debt Handlers
  const handleAddDebt = (d: Omit<Debt, 'id'>) => {
    const updated = StorageAPI.addDebt(d);
    setDebts(updated);
  };
  const handleUpdateDebt = (d: Debt) => {
    const updated = StorageAPI.updateDebt(d);
    setDebts(updated);
  };
  const handleDeleteDebt = (id: string) => {
    const updated = StorageAPI.deleteDebt(id);
    setDebts(updated);
  };

  // Loan Handlers
  const handleAddLoan = (l: Omit<Loan, 'id'>) => {
    const updated = StorageAPI.addLoan(l);
    setLoans(updated);
  };
  const handleUpdateLoan = (l: Loan) => {
    const updated = StorageAPI.updateLoan(l);
    setLoans(updated);
  };
  const handleDeleteLoan = (id: string) => {
    const updated = StorageAPI.deleteLoan(id);
    setLoans(updated);
  };

  // Cheque Handlers
  const handleAddCheque = (c: Omit<Cheque, 'id'>) => {
    const updated = StorageAPI.addCheque(c);
    setCheques(updated);
  };
  const handleDeleteCheque = (id: string) => {
    const updated = StorageAPI.deleteCheque(id);
    setCheques(updated);
  };

  // Goal Handlers
  const handleAddGoal = (g: Omit<FinancialGoal, 'id'>) => {
    const updated = StorageAPI.addGoal(g);
    setGoals(updated);
  };
  const handleUpdateGoal = (g: FinancialGoal) => {
    const updated = StorageAPI.updateGoal(g);
    setGoals(updated);
  };
  const handleDeleteGoal = (id: string) => {
    const updated = StorageAPI.deleteGoal(id);
    setGoals(updated);
  };

  // Subscription Handlers
  const handleAddSubscription = (s: Omit<Subscription, 'id'>) => {
    const updated = StorageAPI.addSubscription(s);
    setSubscriptions(updated);
  };
  const handleUpdateSubscription = (s: Subscription) => {
    const updated = StorageAPI.updateSubscription(s);
    setSubscriptions(updated);
  };
  const handleDeleteSubscription = (id: string) => {
    const updated = StorageAPI.deleteSubscription(id);
    setSubscriptions(updated);
  };

  // Investment Handlers
  const handleAddInvestment = (inv: Omit<InvestmentAsset, 'id'>) => {
    const updated = StorageAPI.addInvestment(inv);
    setInvestments(updated);
  };
  const handleUpdateInvestment = (inv: InvestmentAsset) => {
    const updated = StorageAPI.updateInvestment(inv);
    setInvestments(updated);
  };
  const handleDeleteInvestment = (id: string) => {
    const updated = StorageAPI.deleteInvestment(id);
    setInvestments(updated);
  };

  // Category Handlers
  const handleAddCategory = (c: Omit<Category, 'id'>) => {
    const updated = StorageAPI.addCategory(c);
    setCategories(updated);
  };
  const handleDeleteCategory = (id: string) => {
    const updated = StorageAPI.deleteCategory(id);
    setCategories(updated);
  };

  // Settings Handlers
  const handleUpdateSettings = (newSettings: UserSettings) => {
    StorageAPI.saveSettings(newSettings);
    setSettings(newSettings);
  };

  const handleExportBackup = () => {
    const jsonStr = StorageAPI.exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `WealthPulse_Backup_${new Date().toISOString().substring(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (jsonStr: string) => {
    const success = StorageAPI.importBackupJSON(jsonStr);
    if (success) {
      alert('اطلاعات با موفقیت بازیابی شد.');
      window.location.reload();
    } else {
      alert('خطا در فایل پشتیبان. فرمت نامعتبر است.');
    }
  };

  const handleResetAllData = () => {
    StorageAPI.resetAllData();
    setAccounts(StorageAPI.getAccounts());
    setTransactions(StorageAPI.getTransactions());
    setCategories(StorageAPI.getCategories());
    setBudgets(StorageAPI.getBudgets());
    setDebts(StorageAPI.getDebts());
    setLoans(StorageAPI.getLoans());
    setCheques(StorageAPI.getCheques());
    setGoals(StorageAPI.getGoals());
    setSubscriptions(StorageAPI.getSubscriptions());
    setInvestments(StorageAPI.getInvestments());
  };

  const handleLoadDemoData = () => {
    StorageAPI.loadDemoData();
    setAccounts(StorageAPI.getAccounts());
    setTransactions(StorageAPI.getTransactions());
    setCategories(StorageAPI.getCategories());
    setBudgets(StorageAPI.getBudgets());
    setDebts(StorageAPI.getDebts());
    setLoans(StorageAPI.getLoans());
    setCheques(StorageAPI.getCheques());
    setGoals(StorageAPI.getGoals());
    setSubscriptions(StorageAPI.getSubscriptions());
    setInvestments(StorageAPI.getInvestments());
  };

  if (isLocked) {
    return (
      <SecurityLockModal
        pinCode={settings.pinCode}
        onUnlock={() => setIsLocked(false)}
      />
    );
  }

  const isLight = settings.theme === 'light';

  return (
    <div className={`min-h-screen font-sans flex flex-col antialiased relative overflow-x-hidden transition-colors duration-300 ${
      isLight 
        ? 'bg-slate-100 text-slate-900 selection:bg-indigo-500 selection:text-white' 
        : 'bg-slate-950 text-slate-100 dark selection:bg-indigo-500 selection:text-white'
    }`}>
      {/* Ambient Blur Circles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className={`absolute top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full blur-[140px] ${
          isLight ? 'bg-indigo-300/30' : 'bg-indigo-600/20'
        }`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] ${
          isLight ? 'bg-emerald-300/30' : 'bg-emerald-600/20'
        }`} />
        <div className={`absolute top-[35%] left-[40%] w-[35%] h-[35%] rounded-full blur-[150px] ${
          isLight ? 'bg-purple-300/20' : 'bg-purple-600/15'
        }`} />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top App Header */}
        <Header
          activeTab={activeTab}
          onTabChange={setActiveTab}
          settings={settings}
          onOpenAddTransaction={() => setIsAddTransactionModalOpen(true)}
          onUpdateSettings={handleUpdateSettings}
        />

        {/* Main Container */}
        <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
          {/* Sidebar Navigation */}
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} settings={settings} />

          {/* Dynamic View Router */}
          <main className="flex-1 min-w-0">
          {activeTab === 'dashboard' && (
            <Dashboard
              accounts={accounts}
              transactions={transactions}
              categories={categories}
              budgets={budgets}
              goals={goals}
              debts={debts}
              loans={loans}
              settings={settings}
              onNavigateTab={setActiveTab}
              onOpenAddTxModal={(type) => {
                setAddTxInitialType(type || 'expense');
                setIsAddTransactionModalOpen(true);
              }}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionsView
              transactions={transactions}
              accounts={accounts}
              categories={categories}
              settings={settings}
              onAddTransaction={handleAddTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              onOpenReceiptScanner={() => setIsReceiptScannerOpen(true)}
            />
          )}

          {activeTab === 'accounts' && (
            <AccountsView
              accounts={accounts}
              settings={settings}
              onAddAccount={handleAddAccount}
              onUpdateAccount={handleUpdateAccount}
              onDeleteAccount={handleDeleteAccount}
            />
          )}

          {activeTab === 'budgets' && (
            <BudgetsView
              budgets={budgets}
              categories={categories}
              transactions={transactions}
              settings={settings}
              onAddBudget={handleAddBudget}
              onDeleteBudget={handleDeleteBudget}
            />
          )}

          {activeTab === 'debts' && (
            <DebtsAndLoansView
              debts={debts}
              loans={loans}
              cheques={cheques}
              settings={settings}
              onAddDebt={handleAddDebt}
              onAddLoan={handleAddLoan}
              onAddCheque={handleAddCheque}
              onUpdateDebt={handleUpdateDebt}
              onUpdateLoan={handleUpdateLoan}
              onDeleteDebt={handleDeleteDebt}
              onDeleteLoan={handleDeleteLoan}
              onDeleteCheque={handleDeleteCheque}
            />
          )}

          {activeTab === 'goals' && (
            <GoalsView
              goals={goals}
              accounts={accounts}
              settings={settings}
              onAddGoal={handleAddGoal}
              onUpdateGoal={handleUpdateGoal}
              onDeleteGoal={handleDeleteGoal}
              onAddTransaction={handleAddTransaction}
            />
          )}

          {activeTab === 'investments' && (
            <InvestmentsView
              investments={investments}
              settings={settings}
              onAddInvestment={handleAddInvestment}
              onUpdateInvestment={handleUpdateInvestment}
              onDeleteInvestment={handleDeleteInvestment}
            />
          )}

          {activeTab === 'subscriptions' && (
            <SubscriptionsView
              subscriptions={subscriptions}
              accounts={accounts}
              settings={settings}
              onAddSubscription={handleAddSubscription}
              onUpdateSubscription={handleUpdateSubscription}
              onDeleteSubscription={handleDeleteSubscription}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView
              transactions={transactions}
              loans={loans}
              cheques={cheques}
              subscriptions={subscriptions}
              settings={settings}
            />
          )}

          {activeTab === 'categories' && (
            <CategoriesView
              categories={categories}
              onAddCategory={handleAddCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              transactions={transactions}
              categories={categories}
              accounts={accounts}
              settings={settings}
            />
          )}

          {activeTab === 'ai_advisor' && (
            <AiAdvisorView
              accounts={accounts}
              transactions={transactions}
              budgets={budgets}
              goals={goals}
              settings={settings}
              onOpenReceiptScanner={() => setIsReceiptScannerOpen(true)}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onExportBackup={handleExportBackup}
              onImportBackup={handleImportBackup}
              onResetAllData={handleResetAllData}
              onLoadDemoData={handleLoadDemoData}
            />
          )}

          {activeTab === 'architecture' && <ArchitectureDocView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAddTransaction={() => setIsAddTransactionModalOpen(true)}
      />

      {/* Global Transaction Modal */}
      <TransactionModal
        isOpen={isAddTransactionModalOpen}
        onClose={() => setIsAddTransactionModalOpen(false)}
        accounts={accounts}
        categories={categories}
        settings={settings}
        initialType={addTxInitialType}
        onAddTransaction={handleAddTransaction}
      />

      {/* AI Receipt Scanner Modal */}
      <ReceiptScannerModal
        isOpen={isReceiptScannerOpen}
        onClose={() => setIsReceiptScannerOpen(false)}
        categories={categories}
        accounts={accounts}
        settings={settings}
        onScanComplete={(scanned) => {
          handleAddTransaction({
            type: 'expense',
            amount: scanned.amount,
            categoryId: scanned.categoryId,
            accountId: scanned.accountId,
            date: scanned.date,
            description: scanned.description,
            tags: ['فاکتور_اسکن_شده'],
          });
        }}
      />
      </div>
    </div>
  );
}

export default App;
