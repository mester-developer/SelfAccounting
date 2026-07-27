import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  PieChart,
  HandCoins,
  Target,
  TrendingUp,
  CalendarDays,
  Tags,
  Bot,
  Settings,
  Code,
  Repeat,
  BarChart3,
} from 'lucide-react';

export interface NavTabItem {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const NAV_ITEMS: NavTabItem[] = [
  { id: 'dashboard', title: 'داشبورد', icon: LayoutDashboard },
  { id: 'transactions', title: 'تراکنش‌ها', icon: Receipt },
  { id: 'accounts', title: 'حساب‌ها', icon: Wallet },
  { id: 'budgets', title: 'بودجه‌بندی', icon: PieChart },
  { id: 'debts', title: 'بدهی، وام و چک', icon: HandCoins },
  { id: 'goals', title: 'اهداف مالی', icon: Target },
  { id: 'investments', title: 'سرمایه‌گذاری', icon: TrendingUp },
  { id: 'subscriptions', title: 'قبوض و اشتراک‌ها', icon: Repeat },
  { id: 'calendar', title: 'تقویم مالی', icon: CalendarDays },
  { id: 'categories', title: 'دسته‌بندی‌ها', icon: Tags },
  { id: 'reports', title: 'گزارش‌ها و نمودارها', icon: BarChart3 },
  { id: 'ai_advisor', title: 'هوش مصنوعی', icon: Bot, badge: 'Gemini' },
  { id: 'settings', title: 'تنظیمات', icon: Settings },
  { id: 'architecture', title: 'معماری نرم‌افزار', icon: Code },
];

interface SidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white/5 backdrop-blur-xl border border-white/10 p-4 text-slate-300 select-none shrink-0 overflow-y-auto rounded-3xl shadow-2xl">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-3.5 py-3 mb-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-black flex items-center justify-center text-lg shadow-lg shadow-indigo-500/30">
          WP
        </div>
        <div>
          <h2 className="font-bold text-white text-sm tracking-tight">مدیریت مالی پلاس</h2>
          <p className="text-[11px] text-slate-400 font-light">WealthPulse Architect</p>
        </div>
      </div>

      {/* Nav List */}
      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-500/20 text-white font-bold border border-indigo-500/40 shadow-lg shadow-indigo-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <IconComponent
                  className={`w-4 h-4 ${
                    isActive ? 'text-indigo-400' : 'text-slate-400'
                  }`}
                />
                <span>{item.title}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Security Biometric / Info Banner */}
      <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
        <p className="text-xs text-indigo-300 font-medium uppercase tracking-wider mb-1">امنیت بیومتریک</p>
        <p className="text-[11px] text-slate-400 leading-relaxed">دسترسی با اثر انگشت و رمز پین فعال است</p>
      </div>

      {/* Footer Info */}
      <div className="mt-auto pt-4 border-t border-white/10 px-2 text-[11px] text-slate-500 text-center">
        <p>WealthPulse Finance v2.5</p>
      </div>
    </aside>
  );
};
