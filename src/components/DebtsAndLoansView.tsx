import React, { useState } from 'react';
import { Debt, Loan, Cheque, UserSettings } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  HandCoins,
  Building2,
  FileCheck,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  UserCheck,
} from 'lucide-react';

interface DebtsAndLoansViewProps {
  debts: Debt[];
  loans: Loan[];
  cheques: Cheque[];
  settings: UserSettings;
  onAddDebt: (d: Omit<Debt, 'id'>) => void;
  onAddLoan: (l: Omit<Loan, 'id'>) => void;
  onAddCheque: (c: Omit<Cheque, 'id'>) => void;
  onUpdateDebt?: (d: Debt) => void;
  onUpdateLoan?: (l: Loan) => void;
  onDeleteDebt: (id: string) => void;
  onDeleteLoan: (id: string) => void;
  onDeleteCheque: (id: string) => void;
}

export const DebtsAndLoansView: React.FC<DebtsAndLoansViewProps> = ({
  debts,
  loans,
  cheques,
  settings,
  onAddDebt,
  onAddLoan,
  onAddCheque,
  onUpdateDebt,
  onUpdateLoan,
  onDeleteDebt,
  onDeleteLoan,
  onDeleteCheque,
}) => {
  const [activeTab, setActiveTab] = useState<'debts' | 'loans' | 'cheques'>(
    'debts'
  );

  // Modal States
  const [isDebtModalOpen, setIsDebtModalOpen] = useState(false);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [isChequeModalOpen, setIsChequeModalOpen] = useState(false);

  // Debt Form
  const [personName, setPersonName] = useState('');
  const [debtType, setDebtType] = useState<'debtor' | 'creditor'>('debtor');
  const [debtAmount, setDebtAmount] = useState('');
  const [debtDueDate, setDebtDueDate] = useState('');
  const [debtDesc, setDebtDesc] = useState('');

  // Loan Form
  const [loanTitle, setLoanTitle] = useState('');
  const [lender, setLender] = useState('بانک پاسارگاد');
  const [totalLoanAmount, setTotalLoanAmount] = useState('');
  const [monthlyInstallment, setMonthlyInstallment] = useState('');
  const [totalInstallments, setTotalInstallments] = useState('24');
  const [nextDueDate, setNextDueDate] = useState('');

  // Cheque Form
  const [chequeNum, setChequeNum] = useState('');
  const [chequeType, setChequeType] = useState<'issued' | 'received'>('issued');
  const [chequeAmount, setChequeAmount] = useState('');
  const [chequeBank, setChequeBank] = useState('');
  const [payeeOrPayer, setPayeeOrPayer] = useState('');
  const [chequeDueDate, setChequeDueDate] = useState('');

  const handleDebtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personName || !debtAmount) return;

    onAddDebt({
      personName,
      type: debtType,
      totalAmount: parseFloat(debtAmount),
      paidAmount: 0,
      dueDate: debtDueDate || '2026-12-30',
      description: debtDesc,
      status: 'active',
    });

    setIsDebtModalOpen(false);
    setPersonName('');
    setDebtAmount('');
  };

  const handleLoanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loanTitle || !totalLoanAmount) return;

    onAddLoan({
      title: loanTitle,
      bankOrLender: lender,
      totalAmount: parseFloat(totalLoanAmount),
      remainingAmount: parseFloat(totalLoanAmount),
      monthlyInstallment: parseFloat(monthlyInstallment) || 0,
      totalInstallments: parseInt(totalInstallments, 10) || 12,
      paidInstallments: 0,
      startDate: new Date().toISOString().split('T')[0],
      nextDueDate: nextDueDate || '2026-08-30',
    });

    setIsLoanModalOpen(false);
    setLoanTitle('');
    setTotalLoanAmount('');
  };

  const handleChequeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chequeNum || !chequeAmount) return;

    onAddCheque({
      chequeNumber: chequeNum,
      type: chequeType,
      amount: parseFloat(chequeAmount),
      bankName: chequeBank || 'پاسارگاد',
      payeeOrPayer,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: chequeDueDate || '2026-08-30',
      status: 'pending',
    });

    setIsChequeModalOpen(false);
    setChequeNum('');
    setChequeAmount('');
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header & Section Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl">
        <div>
          <h2 className="text-lg font-bold text-white">
            مدیریت بدهی‌ها، وام‌ها و چک‌ها
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            پیگیری اقساط، طلبکاران، بدهکاران و تاریخ سررسید چک‌ها
          </p>
        </div>

        {/* Tab Switcher Buttons */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/60 border border-white/10">
          <button
            onClick={() => setActiveTab('debts')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'debts'
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            طلب و بدهی
          </button>
          <button
            onClick={() => setActiveTab('loans')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'loans'
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            وام و اقساط
          </button>
          <button
            onClick={() => setActiveTab('cheques')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'cheques'
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            مدیریت چک‌ها
          </button>
        </div>
      </div>

      {/* Tab 1: Debts & Claims */}
      {activeTab === 'debts' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setIsDebtModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-medium shadow-lg shadow-indigo-500/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              ثبت بدهی / طلب جدید
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {debts.map((d) => (
              <div
                key={d.id}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 space-y-3 shadow-xl hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-2.5 rounded-xl font-bold ${
                        d.type === 'debtor'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">
                        {d.personName}
                      </h3>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {d.type === 'debtor'
                          ? 'طلبکار هستید (دیگران باید بپردازند)'
                          : 'بدهکار هستید (شما باید بپردازید)'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteDebt(d.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors border border-transparent hover:border-rose-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/40 border border-white/10 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">مبلغ کل:</span>
                    <span className="font-bold text-white">
                      {formatCurrency(d.totalAmount, settings.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">پرداخت شده:</span>
                    <span className="font-bold text-emerald-400">
                      {formatCurrency(d.paidAmount, settings.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">سررسید:</span>
                    <span className="font-bold text-amber-400">
                      {formatDate(d.dueDate, settings.dateFormat)}
                    </span>
                  </div>
                </div>

                {d.description && (
                  <p className="text-xs text-slate-400 italic">
                    «{d.description}»
                  </p>
                )}

                {onUpdateDebt && d.paidAmount < d.totalAmount && (
                  <button
                    onClick={() => {
                      const amountStr = prompt('مبلغ پرداختی جدید (تومان):', (d.totalAmount - d.paidAmount).toString());
                      if (amountStr) {
                        const amt = parseFloat(amountStr);
                        if (!isNaN(amt) && amt > 0) {
                          const newPaid = d.paidAmount + amt;
                          onUpdateDebt({
                            ...d,
                            paidAmount: newPaid,
                            status: newPaid >= d.totalAmount ? 'settled' : 'active',
                          });
                        }
                      }
                    }}
                    className="w-full py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 font-semibold text-xs border border-indigo-500/30 transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                    ثبت پرداخت / تسویه بدهی
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Loans */}
      {activeTab === 'loans' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setIsLoanModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-medium shadow-lg shadow-indigo-500/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              افزودن وام بانکی
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loans.map((l) => {
              const pct = Math.round(
                (l.paidInstallments / l.totalInstallments) * 100
              );
              return (
                <div
                  key={l.id}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 space-y-4 shadow-xl hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-white">
                        {l.title}
                      </h3>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {l.bankOrLender}
                      </span>
                    </div>

                    <button
                      onClick={() => onDeleteLoan(l.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors border border-transparent hover:border-rose-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">مبلغ کل وام:</span>
                      <span className="font-bold text-white">
                        {formatCurrency(l.totalAmount, settings.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">قسط ماهانه:</span>
                      <span className="font-bold text-rose-400">
                        {formatCurrency(l.monthlyInstallment, settings.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">سررسید بعدی:</span>
                      <span className="font-bold text-amber-400">
                        {formatDate(l.nextDueDate, settings.dateFormat)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="pt-2">
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400">
                          {l.paidInstallments} از {l.totalInstallments} قسط پرداخت
                          شده
                        </span>
                        <span className="font-bold text-emerald-400">{pct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-950/60 border border-white/10 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {onUpdateLoan && l.paidInstallments < l.totalInstallments && (
                      <button
                        onClick={() => {
                          const newPaid = l.paidInstallments + 1;
                          const newRem = Math.max(0, l.remainingAmount - l.monthlyInstallment);
                          onUpdateLoan({
                            ...l,
                            paidInstallments: newPaid,
                            remainingAmount: newRem,
                          });
                        }}
                        className="w-full py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold text-xs border border-emerald-500/30 transition-all flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        پرداخت یک قسط (+۱)
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Cheques */}
      {activeTab === 'cheques' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setIsChequeModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-medium shadow-lg shadow-indigo-500/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              ثبت چک جدید
            </button>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 space-y-3 shadow-xl">
            {cheques.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl font-bold ${
                      c.type === 'issued'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">
                      چک شماره {c.chequeNumber} ({c.bankName})
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      در وجه / از: {c.payeeOrPayer} • سررسید:{' '}
                      {formatDate(c.dueDate, settings.dateFormat)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-white text-sm">
                    {formatCurrency(c.amount, settings.currency)}
                  </span>
                  <button
                    onClick={() => onDeleteCheque(c.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors border border-transparent hover:border-rose-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Debt Modal */}
      {isDebtModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 w-full max-w-md text-slate-100 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-sm text-white">ثبت طلب یا بدهی جدید</h3>
              <button
                onClick={() => setIsDebtModalOpen(false)}
                className="p-1 rounded-xl bg-white/10 text-slate-400 hover:text-white border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDebtSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  نوع حساب
                </label>
                <select
                  value={debtType}
                  onChange={(e) =>
                    setDebtType(e.target.value as 'debtor' | 'creditor')
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-white focus:outline-none focus:border-indigo-400"
                >
                  <option value="debtor">طلبکار هستم (دیگران به من بدهکارند)</option>
                  <option value="creditor">بدهکار هستم (من باید بپردازم)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  نام طرف مقابل
                </label>
                <input
                  type="text"
                  placeholder="علی محمدی"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  مبلغ (تومان)
                </label>
                <input
                  type="number"
                  placeholder="۱۰,۰۰۰,۰۰۰"
                  value={debtAmount}
                  onChange={(e) => setDebtAmount(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  تاریخ سررسید
                </label>
                <input
                  type="date"
                  value={debtDueDate}
                  onChange={(e) => setDebtDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition-all shadow-lg shadow-indigo-500/25"
                >
                  ذخیره
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loan Modal */}
      {isLoanModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 w-full max-w-md text-slate-100 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-sm text-white">ثبت وام بانکی جدید</h3>
              <button
                onClick={() => setIsLoanModalOpen(false)}
                className="p-1 rounded-xl bg-white/10 text-slate-400 hover:text-white border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLoanSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  عنوان وام
                </label>
                <input
                  type="text"
                  placeholder="وام مرابحه خرید کالا"
                  value={loanTitle}
                  onChange={(e) => setLoanTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  مبلغ کل وام (تومان)
                </label>
                <input
                  type="number"
                  placeholder="۵۰,۰۰۰,۰۰۰"
                  value={totalLoanAmount}
                  onChange={(e) => setTotalLoanAmount(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    قسط ماهانه
                  </label>
                  <input
                    type="number"
                    placeholder="۲,۵۰۰,۰۰۰"
                    value={monthlyInstallment}
                    onChange={(e) => setMonthlyInstallment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    تعداد اقساط
                  </label>
                  <input
                    type="number"
                    value={totalInstallments}
                    onChange={(e) => setTotalInstallments(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition-all shadow-lg shadow-indigo-500/25"
                >
                  ذخیره وام
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cheque Modal */}
      {isChequeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 w-full max-w-md text-slate-100 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-sm text-white">ثبت برگه چک جدید</h3>
              <button
                onClick={() => setIsChequeModalOpen(false)}
                className="p-1 rounded-xl bg-white/10 text-slate-400 hover:text-white border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChequeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  نوع چک
                </label>
                <select
                  value={chequeType}
                  onChange={(e) =>
                    setChequeType(e.target.value as 'issued' | 'received')
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-white focus:outline-none focus:border-indigo-400"
                >
                  <option value="issued">صادره (شما کشیده‌اید)</option>
                  <option value="received">دریافتی (از دیگران گرفته‌اید)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  شماره صیادی / چک
                </label>
                <input
                  type="text"
                  placeholder="۸۹۲۷۱۶۲۳"
                  value={chequeNum}
                  onChange={(e) => setChequeNum(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  مبلغ چک (تومان)
                </label>
                <input
                  type="number"
                  placeholder="۱۵,۰۰۰,۰۰۰"
                  value={chequeAmount}
                  onChange={(e) => setChequeAmount(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition-all shadow-lg shadow-indigo-500/25"
                >
                  ذخیره چک
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
