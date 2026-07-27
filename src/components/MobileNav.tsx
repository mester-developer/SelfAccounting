import React, { useState } from 'react';
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  PieChart,
  Bot,
  Menu,
  X,
  Plus,
} from 'lucide-react';
import { NAV_ITEMS } from './Sidebar';

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onOpenAddTransaction: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onTabChange,
  onOpenAddTransaction,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const mainTabs = [
    { id: 'dashboard', title: 'داشبورد', icon: LayoutDashboard },
    { id: 'transactions', title: 'تراکنش‌ها', icon: Receipt },
    { id: 'accounts', title: 'حساب‌ها', icon: Wallet },
    { id: 'ai_advisor', title: 'هوش مصنوعی', icon: Bot },
  ];

  return (
    <>
      {/* Drawer Overlay for Mobile Extra Menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 lg:hidden flex flex-col justify-end"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="bg-slate-900/90 backdrop-blur-2xl border-t border-white/10 rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto text-slate-200 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                منوی منوی کامل برنامه‌ریزی مالی
              </h3>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 text-slate-400 hover:text-slate-100 border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center gap-2.5 p-3 rounded-2xl text-xs font-semibold border text-right transition-all ${
                      isActive
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                        : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-xl border-t border-white/10 z-40 lg:hidden px-2 py-1.5 flex items-center justify-around text-slate-400">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                isActive ? 'text-indigo-400 font-bold' : 'hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{tab.title}</span>
            </button>
          );
        })}

        {/* Center Quick Add Floating Button */}
        <button
          onClick={onOpenAddTransaction}
          className="-mt-5 w-11 h-11 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 font-bold active:scale-90 transition-transform"
          title="ثبت تراکنش جدید"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </button>

        {/* More Menu Toggle */}
        <button
          onClick={() => setIsMenuOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            isMenuOpen ? 'text-indigo-400 font-bold' : 'hover:text-slate-200'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">بیشتر</span>
        </button>
      </div>
    </>
  );
};
