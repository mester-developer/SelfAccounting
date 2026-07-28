import React, { useState } from 'react';
import { Account, Category, Transaction, UserSettings } from '../types';
import { getTodayIso, toEnglishDigits } from '../utils/formatters';
import { AmountInput } from './AmountInput';
import { X, Plus, ArrowRightLeft, ArrowDownRight, ArrowUpRight, Edit3 } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  categories: Category[];
  settings: UserSettings;
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
  onUpdateTransaction?: (tx: Transaction) => void;
  initialType?: 'expense' | 'income' | 'transfer';
  editTransaction?: Transaction | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  accounts,
  categories,
  settings,
  onAddTransaction,
  onUpdateTransaction,
  initialType = 'expense',
  editTransaction = null,
}) => {
  const [type, setType] = useState<'expense' | 'income' | 'transfer'>(initialType);
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [toAccountId, setToAccountId] = useState(accounts[1]?.id || accounts[0]?.id || '');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [date, setDate] = useState(getTodayIso());
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      if (editTransaction) {
        setType(editTransaction.type === 'refund' ? 'income' : editTransaction.type);
        setAmount(String(editTransaction.amount));
        setAccountId(editTransaction.accountId);
        setToAccountId(editTransaction.toAccountId || editTransaction.targetAccountId || accounts[1]?.id || accounts[0]?.id || '');
        setCategoryId(editTransaction.categoryId || categories[0]?.id || '');
        setDate(editTransaction.date);
        setDescription(editTransaction.description || editTransaction.note || '');
        setTagsInput((editTransaction.tags || []).join(', '));
      } else {
        setType(initialType);
        setAmount('');
        setAccountId(accounts[0]?.id || '');
        setToAccountId(accounts[1]?.id || accounts[0]?.id || '');
        setCategoryId(categories[0]?.id || '');
        setDate(getTodayIso());
        setDescription('');
        setTagsInput('');
      }
    }
  }, [isOpen, initialType, editTransaction, accounts, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAmt = parseFloat(toEnglishDigits(amount));
    if (!cleanAmt || cleanAmt <= 0) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (editTransaction && onUpdateTransaction) {
      onUpdateTransaction({
        ...editTransaction,
        type,
        amount: cleanAmt,
        accountId,
        toAccountId: type === 'transfer' ? toAccountId : undefined,
        categoryId: type === 'transfer' ? undefined : categoryId,
        date,
        description,
        tags,
      });
    } else {
      onAddTransaction({
        type,
        amount: cleanAmt,
        accountId,
        toAccountId: type === 'transfer' ? toAccountId : undefined,
        categoryId: type === 'transfer' ? undefined : categoryId,
        date,
        description,
        tags,
      });
    }

    setAmount('');
    setDescription('');
    setTagsInput('');
    onClose();
  };

  const filteredCategories = categories.filter((c) => c.type === type);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 w-full max-w-lg text-slate-100 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            {editTransaction ? (
              <>
                <Edit3 className="w-4 h-4 text-amber-400" />
                ویرایش تراکنش
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-indigo-400" />
                ثبت تراکنش جدید
              </>
            )}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 text-slate-400 hover:text-white border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Transaction Type Buttons */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-950/60 rounded-2xl border border-white/10">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              type === 'expense'
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            هزینه
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              type === 'income'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowDownRight className="w-4 h-4" />
            درآمد
          </button>
          <button
            type="button"
            onClick={() => setType('transfer')}
            className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              type === 'transfer'
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            انتقال
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Amount with Comma Formatter */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              مبلغ ({settings.currency === 'IRR' ? 'ریال' : 'تومان'})
            </label>
            <AmountInput
              value={amount}
              onChange={setAmount}
              placeholder="مثلا ۵۰۰,۰۰۰"
              autoFocus
            />
          </div>

          {/* Account Selection */}
          {type === 'transfer' ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  از حساب (مبداء)
                </label>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white focus:outline-none focus:border-indigo-400"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  به حساب (مقصد)
                </label>
                <select
                  value={toAccountId}
                  onChange={(e) => setToAccountId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white focus:outline-none focus:border-indigo-400"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  حساب
                </label>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white focus:outline-none focus:border-indigo-400"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  دسته‌بندی
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white focus:outline-none focus:border-indigo-400"
                >
                  {filteredCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Date & Note */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                تاریخ
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white focus:outline-none focus:border-indigo-400"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                برچسب‌ها (جدا شده با کاما)
              </label>
              <input
                type="text"
                placeholder="خرید_ماهانه, آنلاین"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              یادداشت / بابت
            </label>
            <input
              type="text"
              placeholder="توضیحات اختیاری..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition-all shadow-lg shadow-indigo-500/25"
            >
              {editTransaction ? 'بروزرسانی تراکنش' : 'ثبت تراکنش'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

