import React from 'react';
import {
  Account,
  Transaction,
  Category,
  Budget,
  FinancialGoal,
  Debt,
  Loan,
  UserSettings,
} from '../types';
import { formatCurrency, formatDate, getTodayIso } from '../utils/formatters';
import { DynamicIcon } from './DynamicIcon';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  ArrowLeftRight,
  ChevronLeft,
  PieChart,
  Bot,
  Sparkles,
  CreditCard,
  Target,
} from 'lucide-react';

interface DashboardProps {
  accounts: Account[];
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  goals: FinancialGoal[];
  debts?: Debt[];
  loans?: Loan[];
  settings: UserSettings;
  onNavigateTab: (tabId: string) => void;
  onOpenAddTxModal: (type?: 'income' | 'expense' | 'transfer') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  accounts = [],
  transactions = [],
  categories = [],
  budgets = [],
  goals = [],
  debts = [],
  loans = [],
  settings,
  onNavigateTab,
  onOpenAddTxModal,
}) => {
  const safeAccounts = accounts || [];
  const safeTransactions = transactions || [];
  const safeCategories = categories || [];
  const safeBudgets = budgets || [];
  const safeGoals = goals || [];
  const safeDebts = debts || [];
  const safeLoans = loans || [];

  const todayIso = getTodayIso();
  const currentMonthPrefix = (todayIso || '').substring(0, 7); // e.g. 2026-07

  // Liabilities and Net Worth
  const accountBalances = safeAccounts.reduce((acc, curr) => acc + (curr?.balance || 0), 0);
  const debtorClaims = safeDebts.filter((d) => d.type === 'debtor').reduce((sum, d) => sum + (d.totalAmount - d.paidAmount), 0);
  const creditorDebts = safeDebts.filter((d) => d.type === 'creditor').reduce((sum, d) => sum + (d.totalAmount - d.paidAmount), 0);
  const remainingLoans = safeLoans.reduce((sum, l) => sum + l.remainingAmount, 0);

  const totalNetWorth = accountBalances + debtorClaims - creditorDebts - remainingLoans;

  // Income & Expense Today
  const todayIncome = safeTransactions
    .filter((t) => t?.date === todayIso && t?.type === 'income')
    .reduce((sum, t) => sum + (t?.amount || 0), 0);

  const todayExpense = safeTransactions
    .filter((t) => t?.date === todayIso && t?.type === 'expense')
    .reduce((sum, t) => sum + (t?.amount || 0), 0);

  // Income & Expense This Month
  const monthlyIncome = safeTransactions
    .filter((t) => t?.date && t.date.startsWith(currentMonthPrefix) && t?.type === 'income')
    .reduce((sum, t) => sum + (t?.amount || 0), 0);

  const monthlyExpense = safeTransactions
    .filter((t) => t?.date && t.date.startsWith(currentMonthPrefix) && t?.type === 'expense')
    .reduce((sum, t) => sum + (t?.amount || 0), 0);

  // Total Monthly Budget vs Spent
  const totalMonthlyBudget = safeBudgets
    .filter((b) => b?.period === 'monthly')
    .reduce((sum, b) => sum + (b?.amount || 0), 0);

  const remainingBudget = totalMonthlyBudget - monthlyExpense;

  // Recent 6 Transactions
  const recentTransactions = [...safeTransactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  const getCategory = (catId: string) =>
    safeCategories.find((c) => c?.id === catId) || {
      name: 'سایر',
      icon: 'Tag',
      color: '#64748b',
    };

  const getAccount = (accId: string) =>
    safeAccounts.find((a) => a?.id === accId) || { name: 'حساب ناشناخته' };

  const isLight = settings?.theme === 'light';

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Net Worth & Main KPIs Banner */}
      <div className={`relative overflow-hidden rounded-3xl border p-6 shadow-xl transition-colors duration-200 ${
        isLight
          ? 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
          : 'bg-slate-900 border-white/10 text-slate-100 shadow-2xl'
      }`}>
        <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl -ml-20 -mt-20 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className={`flex items-center gap-2 text-xs font-semibold mb-1 ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}>
              <Wallet className="w-4 h-4 text-indigo-500" />
              موجودی کل دارایی‌ها (خالص دارایی)
            </div>
            <div className={`text-3xl md:text-4xl font-extrabold tracking-tight ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              {formatCurrency(totalNetWorth, settings.currency)}
            </div>
            <p className={`text-xs mt-2 font-light flex flex-wrap items-center gap-2 ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}>
              <span>مجموع حساب‌ها: {formatCurrency(accountBalances, settings.currency)}</span>
              {(creditorDebts > 0 || remainingLoans > 0) && (
                <span className="text-rose-500 font-medium">
                  | بدهی و وام: {formatCurrency(creditorDebts + remainingLoans, settings.currency)}-
                </span>
              )}
              {debtorClaims > 0 && (
                <span className="text-emerald-500 font-medium">
                  | طلب‌ها: {formatCurrency(debtorClaims, settings.currency)}+
                </span>
              )}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onOpenAddTxModal('income')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 text-xs font-medium transition-all active:scale-95"
            >
              <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
              افزایش درآمد
            </button>
            <button
              onClick={() => onOpenAddTxModal('expense')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 text-xs font-medium transition-all active:scale-95"
            >
              <ArrowUpRight className="w-4 h-4 text-rose-400" />
              ثبت هزینه
            </button>
            <button
              onClick={() => onOpenAddTxModal('transfer')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/30 hover:bg-sky-500/30 text-xs font-medium transition-all active:scale-95"
            >
              <ArrowLeftRight className="w-4 h-4 text-sky-400" />
              انتقال بین حساب
            </button>
          </div>
        </div>

        {/* Today & Month Metrics Grid */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t relative z-10 ${
          isLight ? 'border-slate-200' : 'border-white/10'
        }`}>
          <div className={`p-3.5 rounded-2xl border backdrop-blur-md ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'
          }`}>
            <span className={`text-[11px] block mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>درآمد امروز</span>
            <span className="text-sm md:text-base font-bold text-emerald-500 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {formatCurrency(todayIncome, settings.currency)}
            </span>
          </div>

          <div className={`p-3.5 rounded-2xl border backdrop-blur-md ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'
          }`}>
            <span className={`text-[11px] block mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>هزینه امروز</span>
            <span className="text-sm md:text-base font-bold text-rose-500 flex items-center gap-1">
              <TrendingDown className="w-4 h-4" />
              {formatCurrency(todayExpense, settings.currency)}
            </span>
          </div>

          <div className={`p-3.5 rounded-2xl border backdrop-blur-md ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'
          }`}>
            <span className={`text-[11px] block mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>درآمد این ماه</span>
            <span className="text-sm md:text-base font-bold text-emerald-500">
              {formatCurrency(monthlyIncome, settings.currency)}
            </span>
          </div>

          <div className={`p-3.5 rounded-2xl border backdrop-blur-md ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'
          }`}>
            <span className={`text-[11px] block mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>هزینه این ماه</span>
            <span className="text-sm md:text-base font-bold text-rose-500">
              {formatCurrency(monthlyExpense, settings.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* AI Smart Insight Callout Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/50 border border-indigo-500/30 backdrop-blur-xl flex items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Bot className="w-5 h-5 text-indigo-300" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-indigo-200 flex items-center gap-1.5">
              تحلیل هوش مصنوعی Architect
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              نمره سلامت مالی شما <strong className="text-emerald-400">۸۵٪</strong> است. پیشنهادات صرفه‌جویی جدید آماده است.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigateTab('ai_advisor')}
          className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-medium shrink-0 transition-colors shadow-lg shadow-indigo-500/25"
        >
          مشاهده تحلیل کامل
        </button>
      </div>

      {/* Accounts & Budget Quick Overview Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Accounts Cards List */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-400" />
              حساب‌ها و کارت‌ها
            </h3>
            <button
              onClick={() => onNavigateTab('accounts')}
              className="text-xs font-medium text-indigo-400 hover:underline flex items-center gap-1"
            >
              مدیریت حساب‌ها
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {safeAccounts.map((acc) => (
              <div
                key={acc.id}
                onClick={() => onNavigateTab('accounts')}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-500/40 cursor-pointer transition-all group backdrop-blur-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="p-2 rounded-xl text-slate-950 font-bold shadow-md"
                      style={{ backgroundColor: acc.color }}
                    >
                      <DynamicIcon name={acc.icon} className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {acc.name}
                      </h4>
                      {acc.cardNumber && (
                        <span className="text-[10px] text-slate-400 font-mono dir-ltr block">
                          {acc.cardNumber}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-left dir-ltr mt-3">
                  <span className="text-sm font-extrabold text-white">
                    {formatCurrency(acc.balance, acc.currency as any)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Status Widget */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-4 flex flex-col shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-indigo-400" />
              بودجه این ماه
            </h3>
            <button
              onClick={() => onNavigateTab('budgets')}
              className="text-xs font-medium text-indigo-400 hover:underline flex items-center gap-1"
            >
              جزییات
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <div
            onClick={() => onNavigateTab('budgets')}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-500/40 cursor-pointer transition-all space-y-3"
          >
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">سقف کل بودجه:</span>
              <span className="font-bold text-white">
                {formatCurrency(totalMonthlyBudget, settings.currency)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">باقیمانده تا پایان ماه:</span>
              <span
                className={`font-bold ${
                  remainingBudget < 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {formatCurrency(remainingBudget, settings.currency)}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  monthlyExpense > totalMonthlyBudget
                    ? 'bg-rose-500'
                    : 'bg-emerald-500'
                }`}
                style={{
                  width: `${Math.min(
                    100,
                    totalMonthlyBudget > 0
                      ? (monthlyExpense / totalMonthlyBudget) * 100
                      : 0
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Goals Quick Peek */}
          <div className="mt-auto pt-3 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-amber-400" />
                اهداف پس‌انداز
              </span>
              <button
                onClick={() => onNavigateTab('goals')}
                className="text-[11px] text-slate-400 hover:text-white"
              >
                همه اهداف
              </button>
            </div>
            {safeGoals.slice(0, 2).map((goal) => {
              const pct = Math.round(
                (goal.currentAmount / goal.targetAmount) * 100
              );
              return (
                <div
                  key={goal.id}
                  onClick={() => onNavigateTab('goals')}
                  className="text-xs space-y-1 mb-2 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between text-[11px] text-slate-300">
                    <span>{goal.title}</span>
                    <span className="font-bold text-emerald-400">{pct}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-white">آخرین تراکنش‌ها</h3>
          <button
            onClick={() => onNavigateTab('transactions')}
            className="text-xs font-medium text-indigo-400 hover:underline flex items-center gap-1"
          >
            مشاهده کامل
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5">
          {recentTransactions.map((tx) => {
            const cat = getCategory(tx.categoryId || '');
            const acc = getAccount(tx.accountId);
            const isIncome = tx.type === 'income';
            const isTransfer = tx.type === 'transfer';

            return (
              <div
                key={tx.id}
                onClick={() => onNavigateTab('transactions')}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-500/40 cursor-pointer transition-all backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="p-2.5 rounded-xl text-slate-950 font-bold shrink-0 shadow-md"
                    style={{ backgroundColor: cat.color }}
                  >
                    <DynamicIcon name={cat.icon} className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {tx.note || tx.description || cat.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {acc.name} • {formatDate(tx.date, settings.dateFormat)}
                    </p>
                  </div>
                </div>

                <div className="text-left">
                  <span
                    className={`text-xs font-bold block ${
                      isIncome
                        ? 'text-emerald-400'
                        : isTransfer
                        ? 'text-sky-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {isIncome ? '+' : isTransfer ? '↔' : '-'}
                    {formatCurrency(tx.amount, settings.currency)}
                  </span>
                  {tx.tags && tx.tags.length > 0 && (
                    <span className="inline-block mt-0.5 px-1.5 py-0.2 text-[9px] rounded bg-white/10 text-slate-300 border border-white/10">
                      #{tx.tags[0]}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
