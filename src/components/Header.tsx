import React, { useState } from 'react';
import {
  Bell,
  Lock,
  Plus,
  Sparkles,
  Search,
  Moon,
  Sun,
  ShieldAlert,
  X,
  CheckCircle2,
} from 'lucide-react';
import { UserSettings, NotificationItem } from '../types';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  settings: UserSettings;
  onOpenAddTransaction: () => void;
  onUpdateSettings?: (s: UserSettings) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  settings,
  onOpenAddTransaction,
  onUpdateSettings,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const isLight = settings.theme === 'light';

  const TAB_TITLES: Record<string, string> = {
    dashboard: 'داشبورد',
    transactions: 'تراکنش‌ها',
    accounts: 'مدیریت حساب‌ها',
    budgets: 'بودجه‌بندی',
    debts: 'بدهی، وام و چک',
    goals: 'اهداف مالی',
    investments: 'سبد سرمایه‌گذاری',
    subscriptions: 'قبوض و اشتراک‌ها',
    calendar: 'تقویم مالی',
    categories: 'دسته‌بندی‌ها',
    reports: 'گزارش‌ها و نمودارها',
    ai_advisor: 'هوش مصنوعی Gemini',
    settings: 'تنظیمات',
    architecture: 'معماری سیستم',
  };

  return (
    <header className={`sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 backdrop-blur-xl border-b shadow-md transition-colors duration-200 ${
      isLight
        ? 'bg-white/90 border-slate-200 text-slate-800'
        : 'bg-slate-900/90 border-white/10 text-slate-100'
    }`}>
      {/* Title & App Branding */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white font-black shadow-lg shadow-indigo-500/30">
          WP
        </div>
        <div>
          <h1 className={`text-base sm:text-lg font-bold flex items-center gap-2 ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            مدیریت مالی پلاس
            <span className={`hidden sm:inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
              isLight
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
            }`}>
              {TAB_TITLES[activeTab] || 'WealthPulse'}
            </span>
          </h1>
          <p className={`text-[11px] hidden sm:block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            سامانه مدیریت هوشمند دارایی‌ها و بودجه
          </p>
        </div>
      </div>

      {/* Quick Actions & Header Controls */}
      <div className="flex items-center gap-2.5">
        {/* Theme Quick Toggle */}
        {onUpdateSettings && (
          <button
            onClick={() =>
              onUpdateSettings({ ...settings, theme: isLight ? 'dark' : 'light' })
            }
            className={`p-2.5 rounded-xl border transition-all ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                : 'bg-white/10 hover:bg-white/15 text-amber-300 border-white/10'
            }`}
            title={isLight ? 'تغییر به تم تیره' : 'تغییر به تم روشن'}
          >
            {isLight ? <Moon className="w-4 h-4 text-indigo-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
        )}

        {/* Quick Add Transaction */}
        <button
          onClick={onOpenAddTransaction}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">تراکنش جدید</span>
        </button>

        {/* AI Advisor Tab Toggle */}
        <button
          onClick={() => onTabChange('ai_advisor')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all ${
            isLight
              ? 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700'
              : 'bg-white/10 hover:bg-white/15 border-white/10 text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span className="hidden md:inline">مشاور هوشمند</span>
        </button>
      </div>
    </header>
  );
};
