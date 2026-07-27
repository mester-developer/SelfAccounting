import React, { useState } from 'react';
import { Transaction, Loan, Cheque, Subscription, UserSettings } from '../types';
import { formatCurrency, formatDate, toJalaliDate } from '../utils/formatters';
import { Calendar as CalendarIcon, ChevronRight, ChevronLeft } from 'lucide-react';

interface CalendarViewProps {
  transactions: Transaction[];
  loans: Loan[];
  cheques: Cheque[];
  subscriptions: Subscription[];
  settings: UserSettings;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  transactions,
  loans,
  cheques,
  subscriptions,
  settings,
}) => {
  const todayIso = new Date().toISOString().substring(0, 7);
  const [currentMonth, setCurrentMonth] = useState(todayIso);

  const handlePrevMonth = () => {
    const [y, m] = currentMonth.split('-').map(Number);
    const prevDate = new Date(y, m - 2, 1);
    const py = prevDate.getFullYear();
    const pm = String(prevDate.getMonth() + 1).padStart(2, '0');
    setCurrentMonth(`${py}-${pm}`);
  };

  const handleNextMonth = () => {
    const [y, m] = currentMonth.split('-').map(Number);
    const nextDate = new Date(y, m, 1);
    const ny = nextDate.getFullYear();
    const nm = String(nextDate.getMonth() + 1).padStart(2, '0');
    setCurrentMonth(`${ny}-${nm}`);
  };

  // Calculate actual days in selected month
  const [yearNum, monthNum] = currentMonth.split('-').map(Number);
  const numDaysInMonth = new Date(yearNum, monthNum, 0).getDate();

  const daysInMonth = Array.from({ length: numDaysInMonth }, (_, i) => {
    const day = i + 1;
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    return `${currentMonth}-${dayStr}`;
  });

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-400" />
            تقویم رویدادهای مالی
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            بررسی روزانه درآمدها، هزینه‌ها و سررسید اقساط و چک‌ها
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10 active:scale-95"
            title="ماه قبل"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-100 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
            {toJalaliDate(`${currentMonth}-01`)}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10 active:scale-95"
            title="ماه بعد"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
        {daysInMonth.map((dateIso) => {
          const dayNum = dateIso.split('-')[2];
          const dayTx = transactions.filter((t) => t.date === dateIso);
          const dayIncome = dayTx
            .filter((t) => t.type === 'income')
            .reduce((s, t) => s + t.amount, 0);
          const dayExpense = dayTx
            .filter((t) => t.type === 'expense')
            .reduce((s, t) => s + t.amount, 0);

          const hasLoans = loans.some((l) => l.nextDueDate === dateIso);
          const hasCheques = cheques.some((c) => c.dueDate === dateIso);

          return (
            <div
              key={dateIso}
              className={`p-3 rounded-2xl border text-xs min-h-[90px] flex flex-col justify-between transition-all backdrop-blur-md ${
                dayTx.length > 0 || hasLoans || hasCheques
                  ? 'bg-white/10 border-white/20 shadow-lg'
                  : 'bg-white/5 border-white/10 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-white">{dayNum}</span>
                {hasCheques && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" title="سررسید چک" />
                )}
              </div>

              <div className="space-y-0.5 text-[10px] dir-rtl font-semibold">
                {dayIncome > 0 && (
                  <span className="block text-emerald-400">
                    +{formatCurrency(dayIncome, settings.currency)}
                  </span>
                )}
                {dayExpense > 0 && (
                  <span className="block text-rose-400">
                    -{formatCurrency(dayExpense, settings.currency)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
