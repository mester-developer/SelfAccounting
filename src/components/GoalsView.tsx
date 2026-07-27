import React, { useState } from 'react';
import { FinancialGoal, UserSettings } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Plus, Target, Trash2, X, PlusCircle } from 'lucide-react';

interface GoalsViewProps {
  goals: FinancialGoal[];
  settings: UserSettings;
  onAddGoal: (g: Omit<FinancialGoal, 'id'>) => void;
  onUpdateGoal: (g: FinancialGoal) => void;
  onDeleteGoal: (id: string) => void;
}

export const GoalsView: React.FC<GoalsViewProps> = ({
  goals = [],
  settings,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
}) => {
  const safeGoals = goals || [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [depositModalGoal, setDepositModalGoal] = useState<FinancialGoal | null>(
    null
  );
  const [depositAmount, setDepositAmount] = useState('');

  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetAmount) return;

    onAddGoal({
      title,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount) || 0,
      targetDate: targetDate || '2027-03-20',
      category: 'purchase',
      icon: 'Target',
      color: '#10b981',
    });

    setIsModalOpen(false);
    setTitle('');
    setTargetAmount('');
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositModalGoal || !depositAmount) return;

    const amt = parseFloat(depositAmount);
    onUpdateGoal({
      ...depositModalGoal,
      currentAmount: depositModalGoal.currentAmount + amt,
    });

    setDepositModalGoal(null);
    setDepositAmount('');
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl">
        <div>
          <h2 className="text-lg font-bold text-white">اهداف پس‌انداز و سرمایه‌گذاری</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            تعریف اهداف مالی بلندمدت و کوتاه‌مدت با پیگیری پیشرفت درصد تکمیل
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-medium shadow-lg shadow-indigo-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          هدف مالی جدید
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {safeGoals.map((g) => {
          const pct = Math.min(
            100,
            Math.round((g.currentAmount / g.targetAmount) * 100)
          );
          const remaining = Math.max(0, g.targetAmount - g.currentAmount);

          return (
            <div
              key={g.id}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 space-y-4 shadow-xl hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{g.title}</h3>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      هدف تا {formatDate(g.targetDate, settings.dateFormat)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteGoal(g.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors border border-transparent hover:border-rose-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">پس‌انداز شده:</span>
                  <span className="font-bold text-emerald-400">
                    {formatCurrency(g.currentAmount, settings.currency)} از{' '}
                    {formatCurrency(g.targetAmount, settings.currency)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] pt-1">
                  <span className="text-slate-400">
                    باقیمانده:{' '}
                    <strong className="text-slate-200 font-bold">
                      {formatCurrency(remaining, settings.currency)}
                    </strong>
                  </span>
                  <span className="font-bold text-emerald-400">{pct}% تکمیل</span>
                </div>
              </div>

              <button
                onClick={() => setDepositModalGoal(g)}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-medium text-indigo-300 hover:text-white flex items-center justify-center gap-2 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                واریز و واریز به پس‌انداز
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 w-full max-w-md text-slate-100 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-sm text-white">تعریف هدف پس‌انداز جدید</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-xl bg-white/10 text-slate-400 hover:text-white border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  عنوان هدف
                </label>
                <input
                  type="text"
                  placeholder="مثلا خرید خانه یا سفر"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    مبلغ هدف (تومان)
                  </label>
                  <input
                    type="number"
                    placeholder="۲۰۰,۰۰۰,۰۰۰"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    موجود اولیه
                  </label>
                  <input
                    type="number"
                    placeholder="۰"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  تاریخ هدف
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition-all shadow-lg shadow-indigo-500/25"
                >
                  ذخیره هدف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {depositModalGoal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 w-full max-w-sm text-slate-100 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-sm text-white">
                واریز به «{depositModalGoal.title}»
              </h3>
              <button
                onClick={() => setDepositModalGoal(null)}
                className="p-1 rounded-xl bg-white/10 text-slate-400 hover:text-white border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDeposit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  مبلغ واریزی (تومان)
                </label>
                <input
                  type="number"
                  placeholder="۵,۰۰۰,۰۰۰"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white font-bold placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition-all shadow-lg shadow-indigo-500/25"
                >
                  ثبت پس‌انداز
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
