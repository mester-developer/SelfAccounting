import React, { useState } from 'react';
import { Transaction, Category, Account, UserSettings } from '../types';
import { formatCurrency, formatDate, getTodayIso } from '../utils/formatters';
import { DynamicIcon } from './DynamicIcon';
import { PieChart, BarChart3, TrendingUp, Download, Printer } from 'lucide-react';

interface ReportsViewProps {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  settings: UserSettings;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  transactions,
  categories,
  accounts,
  settings,
}) => {
  const [timeframe, setTimeframe] = useState<'monthly' | 'yearly'>('monthly');

  // Expenses grouped by Category
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');
  const totalExpenses = expenseTransactions.reduce((s, t) => s + t.amount, 0);

  const categoryBreakdown = categories
    .filter((c) => c.type === 'expense')
    .map((cat) => {
      const amount = expenseTransactions
        .filter((t) => t.categoryId === cat.id)
        .reduce((s, t) => s + t.amount, 0);
      const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
      return {
        ...cat,
        amount,
        percentage: Math.round(percentage),
      };
    })
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <PieChart className="w-5 h-5 text-indigo-400" />
            گزارش‌های تحلیلی و نمودارها
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            تحلیل تصویری سهم دسته‌بندی‌ها، روند درآمدهای خالص و هزینه‌ها
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-all border border-white/10 shadow-md"
          >
            <Printer className="w-4 h-4" />
            چاپ / خروجی PDF
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
          <span className="text-xs text-slate-400 block mb-1">کل ورودی (درآمدها)</span>
          <span className="text-xl font-extrabold text-emerald-400">
            {formatCurrency(totalIncome, settings.currency)}
          </span>
        </div>
        <div className="p-5 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
          <span className="text-xs text-slate-400 block mb-1">کل خروجی (هزینه‌ها)</span>
          <span className="text-xl font-extrabold text-rose-400">
            {formatCurrency(totalExpenses, settings.currency)}
          </span>
        </div>
        <div className="p-5 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
          <span className="text-xs text-slate-400 block mb-1">پس‌انداز خالص</span>
          <span
            className={`text-xl font-extrabold ${
              totalIncome - totalExpenses >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {formatCurrency(totalIncome - totalExpenses, settings.currency)}
          </span>
        </div>
      </div>

      {/* Category Breakdown Bar Chart Representation */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-indigo-400" />
          سهم هر دسته‌بندی از کل هزینه‌ها
        </h3>

        <div className="space-y-3 pt-2">
          {categoryBreakdown.map((cat) => (
            <div key={cat.id} className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center text-slate-200">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="font-bold text-white">{cat.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">{cat.percentage}٪</span>
                  <span className="font-extrabold text-white">
                    {formatCurrency(cat.amount, settings.currency)}
                  </span>
                </div>
              </div>

              <div className="w-full h-2.5 rounded-full bg-slate-950/60 border border-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{
                    width: `${cat.percentage}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
