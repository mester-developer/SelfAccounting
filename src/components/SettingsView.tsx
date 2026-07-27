import React, { useState } from 'react';
import { UserSettings } from '../types';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Lock,
  Download,
  Upload,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (s: UserSettings) => void;
  onExportBackup: () => void;
  onImportBackup: (jsonString: string) => void;
  onResetAllData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onExportBackup,
  onImportBackup,
  onResetAllData,
}) => {
  const [pinInput, setPinInput] = useState(settings.pinCode || '');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          onImportBackup(content);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-emerald-400" />
          تنظیمات عمومی و امنیت
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          شخصی‌سازی ظاهر، واحد پول، تاریخ، رمز عبور و پشتیبان‌گیری
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-200">
        {/* Appearance & Regional Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
          <h3 className="font-bold text-sm text-slate-100 border-b border-slate-800 pb-2">
            تنظیمات منطقه‌ای و ظاهر
          </h3>

          <div>
            <label className="block text-slate-400 mb-1">واحد پول پیش‌فرض</label>
            <select
              value={settings.currency}
              onChange={(e) =>
                onUpdateSettings({ ...settings, currency: e.target.value as any })
              }
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
            >
              <option value="TOMAN">تومان (Toman)</option>
              <option value="IRR">ریال (IRR)</option>
              <option value="USD">دلار ($ USD)</option>
              <option value="EUR">یورو (€ EUR)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">فرمت نمایش تاریخ</label>
            <select
              value={settings.dateFormat}
              onChange={(e) =>
                onUpdateSettings({ ...settings, dateFormat: e.target.value as any })
              }
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
            >
              <option value="jalali">تاریخ هجری شمسی (۱۴۰۵/۰۵/۰۴)</option>
              <option value="gregorian">تاریخ میلادی (2026-07-26)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">تم برنامه‌ کاربردی</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, theme: 'dark' })}
                className={`py-2 rounded-xl font-bold border transition-colors ${
                  settings.theme === 'dark'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                تیره (Dark)
              </button>
              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, theme: 'light' })}
                className={`py-2 rounded-xl font-bold border transition-colors ${
                  settings.theme === 'light'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                روشن (Light)
              </button>
            </div>
          </div>
        </div>

        {/* Security & PIN Lock */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
          <h3 className="font-bold text-sm text-slate-100 border-b border-slate-800 pb-2">
            امنیت و قفل نرم‌افزار
          </h3>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-700">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span className="font-semibold">فعال‌سازی رمز عبور (PIN)</span>
            </div>
            <input
              type="checkbox"
              checked={settings.isPinEnabled}
              onChange={(e) =>
                onUpdateSettings({ ...settings, isPinEnabled: e.target.checked })
              }
              className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-500"
            />
          </div>

          {settings.isPinEnabled && (
            <div>
              <label className="block text-slate-400 mb-1">کد ۴ رقمی PIN</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  maxLength={4}
                  placeholder="۱۲۳۴"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 font-mono text-center tracking-widest text-base"
                />
                <button
                  type="button"
                  onClick={() =>
                    onUpdateSettings({ ...settings, pinCode: pinInput })
                  }
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold"
                >
                  ذخیره PIN
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Backup & Data Sync */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
          <h3 className="font-bold text-sm text-slate-100 border-b border-slate-800 pb-2">
            پشتیبان‌گیری و همگام‌سازی اطلاعات
          </h3>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onExportBackup}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              دانلود خروجی پشتیبان (JSON)
            </button>

            <label className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700 cursor-pointer">
              <Upload className="w-4 h-4 text-sky-400" />
              بازیابی اطلاعات از فایل پشتیبان
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <button
              onClick={() => {
                if (
                  confirm(
                    'آیا مطمئن هستید که می‌خواهید تمام اطلاعات را به تنظیمات کارخانه ریست کنید؟'
                  )
                ) {
                  onResetAllData();
                }
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold border border-rose-500/30 mr-auto"
            >
              <RefreshCw className="w-4 h-4 text-rose-400" />
              بازنشانی به تنظیمات کارخانه
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
