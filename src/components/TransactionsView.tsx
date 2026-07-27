import React, { useState } from 'react';
import {
  Transaction,
  Account,
  Category,
  UserSettings,
  TransactionType,
} from '../types';
import { formatCurrency, formatDate, getTodayIso } from '../utils/formatters';
import { DynamicIcon } from './DynamicIcon';
import {
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  Trash2,
  Image as ImageIcon,
  ScanLine,
  Download,
  Calendar,
  X,
  Tag,
  MapPin,
  Repeat,
} from 'lucide-react';

interface TransactionsViewProps {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  settings: UserSettings;
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
  onDeleteTransaction: (id: string) => void;
  onOpenReceiptScanner: () => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions = [],
  accounts = [],
  categories = [],
  settings,
  onAddTransaction,
  onDeleteTransaction,
  onOpenReceiptScanner,
}) => {
  const safeTransactions = transactions || [];
  const safeAccounts = accounts || [];
  const safeCategories = categories || [];

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterAccount, setFilterAccount] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Add Transaction Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<string>('');
  const [accountId, setAccountId] = useState<string>(safeAccounts[0]?.id || '');
  const [targetAccountId, setTargetAccountId] = useState<string>(
    safeAccounts[1]?.id || ''
  );
  const [categoryId, setCategoryId] = useState<string>(safeCategories[0]?.id || '');
  const [date, setDate] = useState<string>(getTodayIso());
  const [note, setNote] = useState<string>('');
  const [tagInput, setTagInput] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [recurringInterval, setRecurringInterval] = useState<
    'daily' | 'weekly' | 'monthly' | 'yearly'
  >('monthly');
  const [receiptImage, setReceiptImage] = useState<string | undefined>(undefined);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    onAddTransaction({
      type,
      amount: parseFloat(amount),
      accountId,
      targetAccountId: type === 'transfer' ? targetAccountId : undefined,
      categoryId,
      date,
      note,
      tags,
      isRecurring,
      recurringInterval: isRecurring ? recurringInterval : undefined,
      receiptImage,
    });

    // Reset Form
    setAmount('');
    setNote('');
    setTags([]);
    setIsModalOpen(false);
  };

  // Filter Logic
  const filteredTransactions = safeTransactions.filter((tx) => {
    if (filterType !== 'all' && tx.type !== filterType) return false;
    if (filterAccount !== 'all' && tx.accountId !== filterAccount) return false;
    if (filterCategory !== 'all' && tx.categoryId !== filterCategory) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchNote = tx.note?.toLowerCase().includes(term);
      const matchTag = tx.tags?.some((t) => t.toLowerCase().includes(term));
      const matchAmount = tx.amount.toString().includes(term);
      if (!matchNote && !matchTag && !matchAmount) return false;
    }
    return true;
  });

  const getCategory = (catId: string) =>
    safeCategories.find((c) => c.id === catId) || {
      name: 'سایر',
      icon: 'Tag',
      color: '#64748b',
    };

  const getAccount = (accId: string) =>
    safeAccounts.find((a) => a.id === accId) || { name: 'حساب ناشناخته' };

  // Export CSV helper
  const handleExportCSV = () => {
    const headers = ['شناسه', 'نوع', 'مبلغ', 'حساب', 'دسته‌بندی', 'تاریخ', 'یادداشت'];
    const rows = filteredTransactions.map((tx) => [
      tx.id,
      tx.type,
      tx.amount,
      getAccount(tx.accountId).name,
      getCategory(tx.categoryId).name,
      tx.date,
      tx.note || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `wealthpulse_transactions_${getTodayIso()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl">
        <div>
          <h2 className="text-lg font-bold text-white">دفتر تراکنش‌ها</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            ثبت، ویرایش، فیلتر و خروجی تمام تراکنش‌های مالی
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenReceiptScanner}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 text-xs font-medium transition-all"
          >
            <ScanLine className="w-4 h-4 text-indigo-300" />
            اسکن AI فاکتور
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-medium shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            تراکنش جدید
          </button>

          <button
            onClick={handleExportCSV}
            className="p-2.5 rounded-xl bg-white/10 text-slate-300 hover:text-white hover:bg-white/15 border border-white/10 transition-colors"
            title="خروجی فایل اکسل / CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 space-y-3 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            <input
              type="text"
              placeholder="جستجو در یادداشت یا برچسب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-9 pl-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-400"
          >
            <option value="all">همه انواع تراکنش</option>
            <option value="income">درآمد (+)</option>
            <option value="expense">هزینه (-)</option>
            <option value="transfer">انتقال (↔)</option>
          </select>

          {/* Account Filter */}
          <select
            value={filterAccount}
            onChange={(e) => setFilterAccount(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-400"
          >
            <option value="all">همه حساب‌ها</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-400"
          >
            <option value="all">همه دسته‌بندی‌ها</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Transactions Table/List */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-3 shadow-xl">
        <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-white/10">
          <span>نمایش {filteredTransactions.length} تراکنش</span>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            تراکنشی مطابق با فیلترهای انتخابی پیدا نشد.
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredTransactions.map((tx) => {
              const cat = getCategory(tx.categoryId || '');
              const acc = getAccount(tx.accountId);
              const targetAcc = tx.targetAccountId
                ? getAccount(tx.targetAccountId)
                : null;
              const isIncome = tx.type === 'income';
              const isTransfer = tx.type === 'transfer';

              return (
                <div
                  key={tx.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all gap-3 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className="p-3 rounded-2xl text-slate-950 font-bold shrink-0"
                      style={{ backgroundColor: cat.color }}
                    >
                      <DynamicIcon name={cat.icon} className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-200">
                          {tx.note || cat.name}
                        </h4>
                        {tx.isRecurring && (
                          <span
                            className="p-1 rounded bg-slate-700 text-amber-400"
                            title="تراکنش تکرارشونده"
                          >
                            <Repeat className="w-3 h-3" />
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-400 mt-1">
                        {acc.name}{' '}
                        {targetAcc ? `← ${targetAcc.name}` : ''} •{' '}
                        {formatDate(tx.date, settings.dateFormat)}
                      </p>

                      {tx.tags && tx.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-1.5">
                          {tx.tags.map((tg, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 text-[10px] rounded-md bg-slate-700/60 text-slate-300 border border-slate-600/40"
                            >
                              #{tg}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <span
                        className={`text-sm font-extrabold block ${
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
                    </div>

                    <button
                      onClick={() => onDeleteTransaction(tx.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="حذف تراکنش"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 w-full max-w-lg shadow-2xl text-slate-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-sm text-white">ثبت تراکنش جدید</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-xl bg-white/10 text-slate-400 hover:text-white border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Type Switcher */}
              <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`py-2 rounded-xl font-bold transition-all ${
                    type === 'expense'
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  هزینه (-)
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`py-2 rounded-xl font-bold transition-all ${
                    type === 'income'
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  درآمد (+)
                </button>
                <button
                  type="button"
                  onClick={() => setType('transfer')}
                  className={`py-2 rounded-xl font-bold transition-all ${
                    type === 'transfer'
                      ? 'bg-sky-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  انتقال (↔)
                </button>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  مبلغ (تومان / واحد)
                </label>
                <input
                  type="number"
                  placeholder="مثلا ۱,۵۰۰,۰۰۰"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-sm font-extrabold text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                />
              </div>

              {/* Account selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {type === 'transfer' ? 'از حساب' : 'حساب مالی'}
                  </label>
                  <select
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-white focus:outline-none focus:border-indigo-400"
                  >
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name}
                      </option>
                    ))}
                  </select>
                </div>

                {type === 'transfer' ? (
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      به حساب
                    </label>
                    <select
                      value={targetAccountId}
                      onChange={(e) => setTargetAccountId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-white focus:outline-none focus:border-indigo-400"
                    >
                      {accounts.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                          {acc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      دسته‌بندی
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-white focus:outline-none focus:border-indigo-400"
                    >
                      {categories
                        .filter(
                          (c) =>
                            c.type ===
                            (type === 'income' ? 'income' : 'expense')
                        )
                        .map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Date & Note */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    تاریخ
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    توضیح / یادداشت
                  </label>
                  <input
                    type="text"
                    placeholder="بابت چه چیزی؟"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  برچسب‌ها (تگ)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="افزودن برچسب (مثلاً #سفر)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium border border-white/10"
                  >
                    افزودن
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tg) => (
                    <span
                      key={tg}
                      className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1"
                    >
                      #{tg}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tg)}
                        className="hover:text-rose-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Recurring Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2">
                  <Repeat className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold text-slate-200">
                    تراکنش تکرارشونده خودکار
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-white/20 text-indigo-500 focus:ring-0"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/25 transition-all"
                >
                  ذخیره تراکنش
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
