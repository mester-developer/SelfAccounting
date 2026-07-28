import React, { useState } from 'react';
import { Subscription, Account, UserSettings } from '../types';
import { formatCurrency, formatDate, toEnglishDigits } from '../utils/formatters';
import { AmountInput } from './AmountInput';
import { Repeat, Plus, Trash2, Edit2, X, Wifi, Tv, Zap, RefreshCw } from 'lucide-react';

interface SubscriptionsViewProps {
  subscriptions: Subscription[];
  accounts: Account[];
  settings: UserSettings;
  onAddSubscription: (sub: Omit<Subscription, 'id'>) => void;
  onUpdateSubscription?: (sub: Subscription) => void;
  onDeleteSubscription: (id: string) => void;
}

export const SubscriptionsView: React.FC<SubscriptionsViewProps> = ({
  subscriptions,
  accounts,
  settings,
  onAddSubscription,
  onUpdateSubscription,
  onDeleteSubscription,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [nextBillingDate, setNextBillingDate] = useState('');
  const [category, setCategory] = useState('قبوض و اینترنت');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');

  const openAddModal = () => {
    setEditingSub(null);
    setName('');
    setAmount('');
    setBillingCycle('monthly');
    setNextBillingDate('');
    setCategory('قبوض و اینترنت');
    setAccountId(accounts[0]?.id || '');
    setIsModalOpen(true);
  };

  const openEditModal = (sub: Subscription) => {
    setEditingSub(sub);
    setName(sub.name);
    setAmount(sub.amount.toString());
    setBillingCycle(sub.billingCycle);
    setNextBillingDate(sub.nextBillingDate);
    setCategory(sub.category || 'قبوض و اینترنت');
    setAccountId(sub.accountId || accounts[0]?.id || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAmt = parseFloat(toEnglishDigits(amount));
    if (!name || !cleanAmt) return;

    if (editingSub && onUpdateSubscription) {
      onUpdateSubscription({
        ...editingSub,
        name,
        amount: cleanAmt,
        billingCycle,
        nextBillingDate: nextBillingDate || '2026-08-15',
        category,
        accountId,
      });
    } else {
      onAddSubscription({
        name,
        amount: cleanAmt,
        billingCycle,
        nextBillingDate: nextBillingDate || '2026-08-15',
        category,
        icon: 'Repeat',
        autoRenew: true,
        accountId,
      });
    }

    setIsModalOpen(false);
    setName('');
    setAmount('');
    setEditingSub(null);
  };

  const totalMonthlyCost = subscriptions.reduce((sum, s) => {
    return sum + (s.billingCycle === 'yearly' ? s.amount / 12 : s.amount);
  }, 0);

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-5">
        <div>
          <h2 className="text-lg font-bold text-slate-100">
            مدیریت اشتراک‌ها و قبوض دوره ای
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            هزینه ماهانه اشتراک‌های فعال:{' '}
            <strong className="text-emerald-400 font-extrabold text-sm">
              {formatCurrency(totalMonthlyCost, settings.currency)}
            </strong>
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg hover:bg-emerald-400 transition-all"
        >
          <Plus className="w-4 h-4" />
          افزودن اشتراک جدید
        </button>
      </div>

      {/* Subscriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subscriptions.map((sub) => {
          const acc = accounts.find((a) => a.id === sub.accountId);

          return (
            <div
              key={sub.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 font-bold">
                    <Repeat className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-100">{sub.name}</h3>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {sub.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(sub)}
                    className="p-1.5 text-slate-400 hover:text-white"
                    title="ویرایش اشتراک"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteSubscription(sub.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400"
                    title="حذف اشتراک"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">مبلغ اشتراک:</span>
                  <span className="font-bold text-slate-100">
                    {formatCurrency(sub.amount, settings.currency)} /{' '}
                    {sub.billingCycle === 'monthly' ? 'ماهانه' : 'سالانه'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">سررسید بعدی:</span>
                  <span className="font-bold text-amber-400">
                    {formatDate(sub.nextBillingDate, settings.dateFormat)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">پرداخت از:</span>
                  <span className="font-bold text-slate-300">
                    {acc?.name || 'حساب پیش‌فرض'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm">
                {editingSub ? 'ویرایش اشتراک / قبض' : 'ثبت اشتراک جدید'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  نام سرویس / قبض
                </label>
                <input
                  type="text"
                  placeholder="اینترنت فیبر، فیلیمو..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    مبلغ ({settings.currency === 'IRR' ? 'ریال' : 'تومان'})
                  </label>
                  <AmountInput
                    value={amount}
                    onChange={setAmount}
                    placeholder="۲۵۰,۰۰۰"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    دوره
                  </label>
                  <select
                    value={billingCycle}
                    onChange={(e) =>
                      setBillingCycle(e.target.value as 'monthly' | 'yearly')
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
                  >
                    <option value="monthly">ماهانه</option>
                    <option value="yearly">سالانه</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  تاریخ سررسید بعدی
                </label>
                <input
                  type="date"
                  value={nextBillingDate}
                  onChange={(e) => setNextBillingDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400"
                >
                  ذخیره اشتراک
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
