import React, { useState } from 'react';
import {
  Bell,
  Lock,
  Plus,
  ScanLine,
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
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  settings,
  onOpenAddTransaction,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

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
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 bg-white/5 backdrop-blur-xl border-b border-white/10 text-slate-100 shadow-xl">
      {/* Title & App Branding */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500 text-white font-black shadow-lg shadow-indigo-500/30">
          WP
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            مدیریت مالی پلاس
            <span className="hidden sm:inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {TAB_TITLES[activeTab] || 'WealthPulse'}
            </span>
          </h1>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            سامانه مدیریت هوشمند دارایی‌ها و بودجه
          </p>
        </div>
      </div>

      {/* Quick Actions & Header Controls */}
      <div className="flex items-center gap-2.5">
        {/* Quick Add Transaction */}
        <button
          onClick={onOpenAddTransaction}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-medium shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">تراکنش جدید</span>
        </button>

        {/* AI Advisor Tab Toggle */}
        <button
          onClick={() => onTabChange('ai_advisor')}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-medium transition-all"
        >
          <ScanLine className="w-4 h-4 text-indigo-300" />
          <span className="hidden md:inline">مشاور هوشمند</span>
        </button>
      </div>
    </header>
  );
};
