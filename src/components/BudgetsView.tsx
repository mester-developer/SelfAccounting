import React, { useState } from 'react';
import { Budget, Category, Transaction, UserSettings } from '../types';
import { formatCurrency, getTodayIso, toEnglishDigits } from '../utils/formatters';
import { DynamicIcon } from './DynamicIcon';
import { AmountInput } from './AmountInput';
import { Plus, AlertTriangle, PieChart, Trash2, Edit2, X } from 'lucide-react';

interface BudgetsViewProps {
  budgets: Budget[];
  categories: Category[];
  transactions: Transaction[];
  settings: UserSettings;
  onAddBudget: (b: Omit<Budget, 'id'>) => void;
  onUpdateBudget?: (b: Budget) => void;
  onDeleteBudget: (id: string) => void;
}

export const BudgetsView: React.FC<BudgetsViewProps> = ({
  budgets,
  categories,
  transactions,
  settings,
  onAddBudget,
  onUpdateBudget,
  onDeleteBudget,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [categoryId, setCategoryId] = useState(
    categories.find((c) => c.type === 'expense')?.id || ''
  );
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [warningThresholdPercent, setWarningThresholdPercent] = useState(80);

  const currentMonthPrefix = getTodayIso().substring(0, 7);

  const openAddModal = () => {
    setEditingBudget(null);
    setCategoryId(categories.find((c) => c.type === 'expense')?.id || '');
    setAmount('');
    setPeriod('monthly');
    setWarningThresholdPercent(80);
    setIsModalOpen(true);
  };

  const openEditModal = (b: Budget) => {
    setEditingBudget(b);
    setCategoryId(b.categoryId);
    setAmount(b.amount.toString());
    setPeriod(b.period);
    setWarningThresholdPercent(b.warningThresholdPercent || 80);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAmt = parseFloat(toEnglishDigits(amount));
    if (!cleanAmt || cleanAmt <= 0) return;

    if (editingBudget && onUpdateBudget) {
      onUpdateBudget({
        ...editingBudget,
        categoryId,
        amount: cleanAmt,
        period,
        warningThresholdPercent,
      });
    } else {
      onAddBudget({
        categoryId,
        amount: cleanAmt,
        period,
        warningThresholdPercent,
      });
    }

    setIsModalOpen(false);
    setAmount('');
    setEditingBudget(null);
  };

  const expenseCategories = categories.filter((c) => c.type === 'expense');

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl">
        <div>
          <h2 className="text-lg font-bold text-white">
            برنامه‌ریزی و بودجه‌بندی هوشمند
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            تعیین سقف هزینه برای دسته‌بندی‌ها و هشدار تجاوز از بودجه
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-medium shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          تعریف بودجه جدید
        </button>
      </div>

      {/* Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.map((b) => {
          const cat = categories.find((c) => c.id === b.categoryId) || {
            name: 'سایر',
            color: '#10b981',
            icon: 'Tag',
          };

          // Spent amount for this category in current month
          const spentAmount = transactions
            .filter(
              (t) =>
                t.categoryId === b.categoryId &&
                t.type === 'expense' &&
                t.date.startsWith(currentMonthPrefix)
            )
            .reduce((sum, t) => sum + t.amount, 0);

          const percent = Math.min(
            100,
            Math.round((spentAmount / b.amount) * 100)
          );
          const isWarning = percent >= b.warningThresholdPercent;
          const isExceeded = spentAmount > b.amount;

          return (
            <div
              key={b.id}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 space-y-4 shadow-xl hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="p-3 rounded-2xl text-slate-950 font-bold shadow-md"
                    style={{ backgroundColor: cat.color }}
                  >
                    <DynamicIcon name={cat.icon} className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">
                      {cat.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      دوره:{' '}
                      {b.period === 'monthly' ? 'ماهانه' : 'سالانه'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(b)}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition-colors"
                    title="ویرایش بودجه"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteBudget(b.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors"
                    title="حذف بودجه"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress & Amounts */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">مصرف‌شده:</span>
                  <span
                    className={`font-bold ${
                      isExceeded ? 'text-rose-400' : 'text-slate-200'
                    }`}
                  >
                    {formatCurrency(spentAmount, settings.currency)} از{' '}
                    {formatCurrency(b.amount, settings.currency)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden relative">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isExceeded
                        ? 'bg-rose-500'
                        : isWarning
                        ? 'bg-amber-400'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">
                    باقیمانده:{' '}
                    <strong className="text-emerald-400 font-bold">
                      {formatCurrency(
                        Math.max(0, b.amount - spentAmount),
                        settings.currency
                      )}
                    </strong>
                  </span>
                  <span
                    className={`font-bold ${
                      isExceeded
                        ? 'text-rose-400'
                        : isWarning
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {percent}% مصرف‌شده
                  </span>
                </div>
              </div>

              {/* Warning Alert Pill */}
              {isWarning && (
                <div
                  className={`p-2.5 rounded-xl text-xs flex items-center gap-2 font-bold ${
                    isExceeded
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>
                    {isExceeded
                      ? 'هشدار: سقف بودجه این دسته تجاوز کرده است!'
                      : `هشدار: شما از حد مجاز ${b.warningThresholdPercent}٪ عبور کرده‌اید.`}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 w-full max-w-md text-slate-100 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-sm text-white">
                {editingBudget ? 'ویرایش بودجه' : 'تعریف بودجه جدید'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-xl bg-white/10 text-slate-400 hover:text-white border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  دسته‌بندی هزینه
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white focus:outline-none focus:border-indigo-400"
                >
                  {expenseCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  سقف مبلغ بودجه ({settings.currency === 'IRR' ? 'ریال' : 'تومان'})
                </label>
                <AmountInput
                  value={amount}
                  onChange={setAmount}
                  placeholder="مثلا ۵,۰۰۰,۰۰۰"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    دوره
                  </label>
                  <select
                    value={period}
                    onChange={(e) =>
                      setPeriod(e.target.value as 'monthly' | 'yearly')
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-white focus:outline-none focus:border-indigo-400"
                  >
                    <option value="monthly">ماهانه</option>
                    <option value="yearly">سالانه</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    آستانه هشدار (٪)
                  </label>
                  <input
                    type="number"
                    value={warningThresholdPercent}
                    onChange={(e) =>
                      setWarningThresholdPercent(
                        parseInt(e.target.value, 10) || 80
                      )
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition-all shadow-lg shadow-indigo-500/25"
                >
                  ذخیره بودجه
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
