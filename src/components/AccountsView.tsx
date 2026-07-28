import React, { useState } from 'react';
import { Account, AccountType, Transaction, UserSettings } from '../types';
import { formatCurrency, toEnglishDigits, groupBalancesByCurrency } from '../utils/formatters';
import { AmountInput } from './AmountInput';
import {
  Plus,
  CreditCard,
  Building2,
  Wallet,
  Coins,
  Bitcoin,
  Trash2,
  Edit2,
  Star,
  X,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

interface AccountsViewProps {
  accounts: Account[];
  transactions?: Transaction[];
  settings: UserSettings;
  onAddAccount: (acc: Omit<Account, 'id'>) => void;
  onUpdateAccount: (acc: Account) => void;
  onDeleteAccount: (id: string) => void;
}

const ACCOUNT_TYPES: { type: AccountType; label: string; icon: string }[] = [
  { type: 'card', label: 'کارت بانکی', icon: 'CreditCard' },
  { type: 'bank', label: 'حساب بانکی', icon: 'Building2' },
  { type: 'cash', label: 'پول نقد', icon: 'Wallet' },
  { type: 'wallet', label: 'کیف پول الکترونیک', icon: 'Smartphone' },
  { type: 'crypto', label: 'ارز دیجیتال (کریپتو)', icon: 'Bitcoin' },
  { type: 'gold', label: 'طلا و سکه', icon: 'Coins' },
  { type: 'investment', label: 'سرمایه‌گذاری/بورس', icon: 'TrendingUp' },
  { type: 'custom', label: 'حساب سفارشی', icon: 'Boxes' },
];

const PRESET_COLORS = [
  '#10b981',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#ef4444',
  '#f59e0b',
  '#eab308',
  '#14b8a6',
];

const getAccountIcon = (iconName: string, type: string) => {
  if (type === 'crypto' || iconName === 'Bitcoin') return <Bitcoin className="w-5 h-5" />;
  if (type === 'cash' || iconName === 'Coins') return <Coins className="w-5 h-5" />;
  if (type === 'wallet' || iconName === 'Wallet') return <Wallet className="w-5 h-5" />;
  if (type === 'bank' || iconName === 'Building2') return <Building2 className="w-5 h-5" />;
  return <CreditCard className="w-5 h-5" />;
};

export const AccountsView: React.FC<AccountsViewProps> = ({
  accounts,
  transactions = [],
  settings,
  onAddAccount,
  onUpdateAccount,
  onDeleteAccount,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);

  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('card');
  const [balance, setBalance] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [icon, setIcon] = useState('CreditCard');

  const openAddModal = () => {
    setEditingAccount(null);
    setName('');
    setType('card');
    setBalance('');
    setCardNumber('');
    setAccountNumber('');
    setBankName('');
    setColor(PRESET_COLORS[0]);
    setIcon('CreditCard');
    setIsModalOpen(true);
  };

  const openEditModal = (acc: Account) => {
    setEditingAccount(acc);
    setName(acc.name);
    setType(acc.type);
    setBalance(acc.balance.toString());
    setCardNumber(acc.cardNumber || '');
    setAccountNumber(acc.accountNumber || '');
    setBankName(acc.bankName || '');
    setColor(acc.color);
    setIcon(acc.icon);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const cleanBal = parseFloat(toEnglishDigits(balance)) || 0;

    if (editingAccount) {
      onUpdateAccount({
        ...editingAccount,
        name,
        type,
        balance: cleanBal,
        cardNumber,
        accountNumber,
        bankName,
        color,
        icon,
      });
    } else {
      onAddAccount({
        name,
        type,
        balance: cleanBal,
        currency: settings.currency,
        cardNumber,
        accountNumber,
        bankName,
        color,
        icon,
      });
    }

    setIsModalOpen(false);
  };

  const primaryAccounts = accounts.filter(
    (a) => a.currency === settings.currency || (!a.currency && settings.currency === 'TOMAN')
  );
  const totalBalance = primaryAccounts.reduce((acc, curr) => acc + curr.balance, 0);

  const currencyGroups = groupBalancesByCurrency(accounts);
  const otherCurrencies = Object.entries(currencyGroups).filter(
    ([curr]) => curr !== settings.currency
  );

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl">
        <div>
          <h2 className="text-lg font-bold text-white">مدیریت حساب‌ها و دارایی‌ها</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            مجموع موجودی اصلی ({settings.currency === 'IRR' ? 'ریال' : 'تومان'}):{' '}
            <strong className="text-emerald-400 font-extrabold text-sm">
              {formatCurrency(totalBalance, settings.currency)}
            </strong>
            {otherCurrencies.length > 0 && (
              <span className="block text-[11px] text-slate-400 mt-0.5">
                سایر ارزها:{' '}
                {otherCurrencies
                  .map(([curr, val]) => formatCurrency(val, curr as any))
                  .join(' | ')}
              </span>
            )}
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-medium shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          افزودن حساب جدید
        </button>
      </div>

      {/* Accounts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 p-5 space-y-4 shadow-xl hover:bg-white/10 hover:border-white/20 transition-all group"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="p-3 rounded-2xl text-slate-950 font-bold shadow-md"
                  style={{ backgroundColor: acc.color }}
                >
                  {getAccountIcon(acc.icon, acc.type)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">
                    {acc.name}
                  </h3>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {ACCOUNT_TYPES.find((t) => t.type === acc.type)?.label ||
                      acc.type}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(acc)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition-colors"
                  title="ویرایش حساب"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setAccountToDelete(acc)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors"
                  title="حذف حساب"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Card Numbers & Bank Info */}
            {(acc.cardNumber || acc.accountNumber) && (
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 font-mono text-xs text-slate-300 dir-ltr text-center">
                {acc.cardNumber || acc.accountNumber}
              </div>
            )}

            {/* Balance */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400">موجودی فعلی:</span>
              <span className="text-base font-extrabold text-emerald-400">
                {formatCurrency(acc.balance, acc.currency as any)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Account Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 w-full max-w-lg shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-sm text-white">
                {editingAccount ? 'ویرایش حساب' : 'تعریف حساب مالی جدید'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-xl bg-white/10 text-slate-400 hover:text-white border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Account Type Picker */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  نوع حساب
                </label>
                <select
                  value={type}
                  onChange={(e) => {
                    const selected = e.target.value as AccountType;
                    setType(selected);
                    const defaultIcon =
                      ACCOUNT_TYPES.find((t) => t.type === selected)?.icon ||
                      'CreditCard';
                    setIcon(defaultIcon);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white focus:outline-none focus:border-indigo-400"
                >
                  {ACCOUNT_TYPES.map((t) => (
                    <option key={t.type} value={t.type}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name & Initial Balance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    نام حساب / بانک
                  </label>
                  <input
                    type="text"
                    placeholder="مثلا کارت بانک ملی"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    موجودی ({settings.currency === 'IRR' ? 'ریال' : 'تومان'})
                  </label>
                  <AmountInput
                    value={balance}
                    onChange={setBalance}
                    placeholder="۰"
                  />
                </div>
              </div>

              {/* Card Number / Account Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    شماره کارت (اختیاری)
                  </label>
                  <input
                    type="text"
                    placeholder="۶۰۳۷-۹۹..."
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 dir-ltr text-center font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    نام موسسه/بانک
                  </label>
                  <input
                    type="text"
                    placeholder="بانک پاسارگاد، نوبیتکس..."
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  رنگ تم حساب
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full transition-transform ${
                        color === c
                          ? 'scale-125 ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-900'
                          : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition-all shadow-lg shadow-indigo-500/25"
                >
                  {editingAccount ? 'بروزرسانی حساب' : 'ایجاد حساب'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {accountToDelete && (() => {
        const linkedTxsCount = transactions.filter(
          (t) => t.accountId === accountToDelete.id || t.toAccountId === accountToDelete.id || t.targetAccountId === accountToDelete.id
        ).length;

        return (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 w-full max-w-sm text-slate-100 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                  حذف حساب
                </h3>
                <button
                  onClick={() => setAccountToDelete(null)}
                  className="p-1 rounded-xl bg-white/10 text-slate-400 hover:text-white border border-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                <p>
                  آیا از حذف حساب <strong className="text-white">{accountToDelete.name}</strong> اطمینان دارید؟
                </p>
                {linkedTxsCount > 0 && (
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                    <span>
                      این حساب دارای <strong>{linkedTxsCount}</strong> تراکنش ثبت‌شده است. حذف حساب باعث حذف تاریخچه حساب متصل به این تراکنش‌ها می‌شود.
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setAccountToDelete(null)}
                  className="w-1/2 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs border border-white/10 transition-all"
                >
                  انصراف
                </button>
                <button
                  onClick={() => {
                    onDeleteAccount(accountToDelete.id);
                    setAccountToDelete(null);
                  }}
                  className="w-1/2 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-500/25 transition-all"
                >
                  حذف قطعی
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
