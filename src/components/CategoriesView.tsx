import React, { useState } from 'react';
import { Category } from '../types';
import { DynamicIcon } from './DynamicIcon';
import { Plus, Tags, Trash2, X } from 'lucide-react';

interface CategoriesViewProps {
  categories: Category[];
  onAddCategory: (cat: Omit<Category, 'id'>) => void;
  onDeleteCategory: (id: string) => void;
}

const AVAILABLE_ICONS = [
  'ShoppingBag',
  'Home',
  'Car',
  'Utensils',
  'HeartPulse',
  'Film',
  'Zap',
  'Shirt',
  'GraduationCap',
  'CreditCard',
  'Briefcase',
  'Award',
  'TrendingUp',
  'Coins',
  'Smartphone',
  'Plane',
  'Gift',
];

const PRESET_COLORS = [
  '#10b981',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#ef4444',
  '#f59e0b',
  '#14b8a6',
];

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  categories,
  onAddCategory,
  onDeleteCategory,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [icon, setIcon] = useState('ShoppingBag');
  const [color, setColor] = useState(PRESET_COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    onAddCategory({
      name,
      type,
      icon,
      color,
    });

    setIsModalOpen(false);
    setName('');
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Banner */}
      <div className="flex items-center justify-between bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Tags className="w-5 h-5 text-indigo-400" />
            دسته‌بندی‌های درآمد و هزینه
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            شخصی‌سازی نام، رنگ و آیکون دسته‌بندی‌های مالی
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-medium shadow-lg shadow-indigo-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          دسته‌بندی جدید
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between p-4 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl hover:bg-white/10 hover:border-white/20 transition-all"
          >
            <div className="flex items-center gap-3">
              <div
                className="p-3 rounded-2xl text-slate-950 font-bold shadow-md"
                style={{ backgroundColor: cat.color }}
              >
                <DynamicIcon name={cat.icon} className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">{cat.name}</h3>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  نوع: {cat.type === 'income' ? 'درآمد' : 'هزینه'}
                </span>
              </div>
            </div>

            {!cat.isDefault && (
              <button
                onClick={() => onDeleteCategory(cat.id)}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors border border-transparent hover:border-rose-500/20"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 w-full max-w-md text-slate-100 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-sm text-white">تعریف دسته‌بندی جدید</h3>
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
                  نوع دسته
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as 'expense' | 'income')}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-white focus:outline-none focus:border-indigo-400"
                >
                  <option value="expense">هزینه</option>
                  <option value="income">درآمد</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  نام دسته
                </label>
                <input
                  type="text"
                  placeholder="مثلا نگهداری خودرو"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                />
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  آیکون
                </label>
                <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto p-2 bg-slate-950/60 rounded-xl border border-white/10">
                  {AVAILABLE_ICONS.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setIcon(ic)}
                      className={`p-2 rounded-xl text-slate-200 transition-colors ${
                        icon === ic ? 'bg-indigo-500 text-white font-bold' : 'hover:bg-white/10'
                      }`}
                    >
                      <DynamicIcon name={ic} className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition-all shadow-lg shadow-indigo-500/25"
                >
                  ذخیره دسته‌بندی
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
