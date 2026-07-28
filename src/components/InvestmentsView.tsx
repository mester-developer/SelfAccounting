import React, { useState } from 'react';
import { InvestmentAsset, UserSettings } from '../types';
import { formatCurrency, formatNumber, toEnglishDigits } from '../utils/formatters';
import { AmountInput } from './AmountInput';
import { TrendingUp, Coins, Bitcoin, Building, Plus, Trash2, Edit2, X } from 'lucide-react';

interface InvestmentsViewProps {
  investments: InvestmentAsset[];
  settings: UserSettings;
  onAddInvestment: (inv: Omit<InvestmentAsset, 'id'>) => void;
  onUpdateInvestment?: (inv: InvestmentAsset) => void;
  onDeleteInvestment: (id: string) => void;
}

export const InvestmentsView: React.FC<InvestmentsViewProps> = ({
  investments,
  settings,
  onAddInvestment,
  onUpdateInvestment,
  onDeleteInvestment,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInv, setEditingInv] = useState<InvestmentAsset | null>(null);
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [type, setType] = useState<'gold' | 'crypto' | 'stock' | 'fund'>('gold');
  const [quantity, setQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [unit, setUnit] = useState('گرم');

  const openAddModal = () => {
    setEditingInv(null);
    setName('');
    setSymbol('');
    setType('gold');
    setQuantity('');
    setBuyPrice('');
    setCurrentPrice('');
    setUnit('گرم');
    setIsModalOpen(true);
  };

  const openEditModal = (inv: InvestmentAsset) => {
    setEditingInv(inv);
    setName(inv.name);
    setSymbol(inv.symbol || inv.name);
    setType(inv.type);
    setQuantity(inv.quantity.toString());
    setBuyPrice(inv.buyPrice.toString());
    setCurrentPrice(inv.currentPrice.toString());
    setUnit(inv.unit || 'گرم');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQty = parseFloat(toEnglishDigits(quantity));
    const cleanBuyPrice = parseFloat(toEnglishDigits(buyPrice));
    const cleanCurrentPrice = parseFloat(toEnglishDigits(currentPrice)) || cleanBuyPrice;

    if (!name || !cleanQty || !cleanBuyPrice) return;

    if (editingInv && onUpdateInvestment) {
      onUpdateInvestment({
        ...editingInv,
        name,
        symbol: symbol || name,
        type,
        quantity: cleanQty,
        buyPrice: cleanBuyPrice,
        currentPrice: cleanCurrentPrice,
        unit,
      });
    } else {
      onAddInvestment({
        name,
        symbol: symbol || name,
        type,
        quantity: cleanQty,
        buyPrice: cleanBuyPrice,
        currentPrice: cleanCurrentPrice,
        purchaseDate: new Date().toISOString().split('T')[0],
        unit,
      });
    }

    setIsModalOpen(false);
    setName('');
    setQuantity('');
    setBuyPrice('');
    setEditingInv(null);
  };

  // Portfolio Totals
  const totalCost = investments.reduce(
    (sum, inv) => sum + inv.quantity * inv.buyPrice,
    0
  );
  const totalValue = investments.reduce(
    (sum, inv) => sum + inv.quantity * inv.currentPrice,
    0
  );
  const totalProfit = totalValue - totalCost;
  const totalProfitPct = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Portfolio Overview Banner */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl text-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-lg font-bold text-white">سبد سرمایه‌گذاری و دارایی‌ها</h2>
            <p className="text-xs text-slate-400 mt-1">
              مدیریت طلا، سکه، ارزهای دیجیتال، سهام بورس و صندوق‌ها
            </p>

            <div className="flex flex-wrap items-center gap-6 mt-4">
              <div>
                <span className="text-[11px] text-slate-400 block">ارزش کل سبد:</span>
                <span className="text-2xl font-extrabold text-emerald-400">
                  {formatCurrency(totalValue, settings.currency)}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block">سود / زیان کل:</span>
                <span
                  className={`text-lg font-extrabold flex items-center gap-1 ${
                    totalProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  {formatCurrency(totalProfit, settings.currency)} (
                  {totalProfitPct.toFixed(1)}٪)
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium text-xs shadow-lg shadow-indigo-500/25 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            افزودن دارایی جدید
          </button>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {investments.map((inv) => {
          const cost = inv.quantity * inv.buyPrice;
          const val = inv.quantity * inv.currentPrice;
          const pnl = val - cost;
          const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;

          return (
            <div
              key={inv.id}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 space-y-3 shadow-xl hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                    {inv.type === 'crypto' ? (
                      <Bitcoin className="w-5 h-5" />
                    ) : inv.type === 'gold' ? (
                      <Coins className="w-5 h-5" />
                    ) : (
                      <Building className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{inv.name}</h3>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {inv.symbol}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(inv)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors border border-transparent hover:border-white/10"
                    title="ویرایش دارایی"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteInvestment(inv.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors border border-transparent hover:border-rose-500/20"
                    title="حذف دارایی"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/40 border border-white/10 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">حجم دارایی:</span>
                  <span className="font-bold text-white">
                    {formatNumber(inv.quantity)} {inv.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">قیمت خرید:</span>
                  <span className="font-bold text-slate-300">
                    {formatCurrency(inv.buyPrice, settings.currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">قیمت روز:</span>
                  <span className="font-bold text-white">
                    {formatCurrency(inv.currentPrice, settings.currency)}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400">سود/زیان:</span>
                <span
                  className={`font-bold ${
                    pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {formatCurrency(pnl, settings.currency)} ({pnlPct.toFixed(1)}٪)
                </span>
              </div>
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
                {editingInv ? 'ویرایش دارایی' : 'افزودن دارایی جدید به سبد'}
              </h3>
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
                  نوع دارایی
                </label>
                <select
                  value={type}
                  onChange={(e) => {
                    const selected = e.target.value as any;
                    setType(selected);
                    setUnit(
                      selected === 'gold'
                        ? 'گرم'
                        : selected === 'crypto'
                        ? 'عدد'
                        : 'سهم'
                    );
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-white focus:outline-none focus:border-indigo-400"
                >
                  <option value="gold">طلا و سکه</option>
                  <option value="crypto">ارز دیجیتال (تتر / بیت‌کوین)</option>
                  <option value="stock">سهام بورس</option>
                  <option value="fund">صندوق سرمایه‌گذاری</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  نام دارایی
                </label>
                <input
                  type="text"
                  placeholder="مثلا طلای ۱۸ عیار یا بیت‌کوین"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    مقدار / تعداد
                  </label>
                  <input
                    type="number"
                    placeholder="۱۰"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    واحد
                  </label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    قیمت خرید ({settings.currency === 'IRR' ? 'ریال' : 'تومان'})
                  </label>
                  <AmountInput
                    value={buyPrice}
                    onChange={setBuyPrice}
                    placeholder="۳,۵۰۰,۰۰۰"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    قیمت روز ({settings.currency === 'IRR' ? 'ریال' : 'تومان'})
                  </label>
                  <AmountInput
                    value={currentPrice}
                    onChange={setCurrentPrice}
                    placeholder="۴,۲۰۰,۰۰۰"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition-all shadow-lg shadow-indigo-500/25"
                >
                  ذخیره دارایی
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
