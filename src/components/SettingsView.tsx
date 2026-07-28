import React, { useState } from 'react';
import { UserSettings } from '../types';
import { hashPin, generateSalt } from '../utils/crypto';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Lock,
  Download,
  Upload,
  RefreshCw,
  ShieldCheck,
  Fingerprint,
} from 'lucide-react';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (s: UserSettings) => void;
  onExportBackup: () => void;
  onImportBackup: (jsonString: string) => void;
  onResetAllData: () => void;
  onLoadDemoData?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onExportBackup,
  onImportBackup,
  onResetAllData,
  onLoadDemoData,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [pinStatus, setPinStatus] = useState<string | null>(null);
  const [isSavingPin, setIsSavingPin] = useState(false);
  const isLight = settings.theme === 'light';

  const handleSavePin = async () => {
    if (pinInput.length !== 4 || !/^\d{4}$/.test(pinInput)) {
      setPinStatus('لطفاً یک کد ۴ رقمی عددی وارد کنید.');
      return;
    }
    setIsSavingPin(true);
    setPinStatus(null);
    try {
      const salt = generateSalt();
      const hash = await hashPin(pinInput, salt);
      onUpdateSettings({
        ...settings,
        pinHash: hash,
        pinSalt: salt,
        pinCode: undefined, // Clear legacy plaintext PIN
        isPinEnabled: true,
      });
      setPinInput('');
      setPinStatus('رمز عبور امن (هش‌شده) با موفقیت ذخیره شد.');
    } catch (err) {
      setPinStatus('خطا در رمزنگاری و ذخیره PIN.');
    } finally {
      setIsSavingPin(false);
    }
  };

  const handleToggleBiometrics = async (enabled: boolean) => {
    if (enabled) {
      try {
        if (
          window.PublicKeyCredential &&
          typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function'
        ) {
          const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          if (available) {
            // Register WebAuthn credential locally if navigator.credentials.create is available
            const challenge = new Uint8Array(32);
            crypto.getRandomValues(challenge);
            const userId = new Uint8Array(16);
            crypto.getRandomValues(userId);

            const credential = (await navigator.credentials.create({
              publicKey: {
                challenge,
                rp: { name: 'WealthPulse' },
                user: {
                  id: userId,
                  name: 'user@wealthpulse.local',
                  displayName: 'کاربر WealthPulse',
                },
                pubKeyCredParams: [{ alg: -7, type: 'public-key' }, { alg: -257, type: 'public-key' }],
                authenticatorSelection: {
                  authenticatorAttachment: 'platform',
                  userVerification: 'required',
                },
                timeout: 60000,
              },
            })) as PublicKeyCredential | null;

            if (credential) {
              localStorage.setItem('wealthpulse_webauthn_credential_id', credential.id);
            }
          }
        }
      } catch (err) {
        console.warn('WebAuthn registration skipped or cancelled:', err);
      }
    }
    onUpdateSettings({ ...settings, isBiometricsEnabled: enabled });
  };

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
      <div className={`border rounded-3xl p-5 ${
        isLight ? 'bg-white border-slate-200 text-slate-900 shadow-sm' : 'bg-slate-900 border-slate-800 text-slate-100'
      }`}>
        <h2 className="text-lg font-bold flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-emerald-500" />
          تنظیمات عمومی و امنیت
        </h2>
        <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          شخصی‌سازی ظاهر، واحد پول، تاریخ، رمز عبور و پشتیبان‌گیری
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Appearance & Regional Settings */}
        <div className={`border rounded-3xl p-5 space-y-4 ${
          isLight ? 'bg-white border-slate-200 text-slate-800 shadow-sm' : 'bg-slate-900 border-slate-800 text-slate-200'
        }`}>
          <h3 className={`font-bold text-sm border-b pb-2 ${
            isLight ? 'text-slate-900 border-slate-200' : 'text-slate-100 border-slate-800'
          }`}>
            تنظیمات منطقه‌ای و ظاهر
          </h3>

          <div>
            <label className={`block mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>واحد پول پیش‌فرض</label>
            <select
              value={settings.currency}
              onChange={(e) =>
                onUpdateSettings({ ...settings, currency: e.target.value as any })
              }
              className={`w-full px-3 py-2.5 rounded-xl border ${
                isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-800 border-slate-700 text-slate-100'
              }`}
            >
              <option value="TOMAN">تومان (Toman)</option>
              <option value="IRR">ریال (IRR)</option>
              <option value="USD">دلار ($ USD)</option>
              <option value="EUR">یورو (€ EUR)</option>
            </select>
          </div>

          <div>
            <label className={`block mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>فرمت نمایش تاریخ</label>
            <select
              value={settings.dateFormat}
              onChange={(e) =>
                onUpdateSettings({ ...settings, dateFormat: e.target.value as any })
              }
              className={`w-full px-3 py-2.5 rounded-xl border ${
                isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-800 border-slate-700 text-slate-100'
              }`}
            >
              <option value="jalali">تاریخ هجری شمسی (۱۴۰۵/۰۵/۰۴)</option>
              <option value="gregorian">تاریخ میلادی (2026-07-26)</option>
            </select>
          </div>

          <div>
            <label className={`block mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>تم برنامه‌ کاربردی</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, theme: 'dark' })}
                className={`py-2.5 px-3 rounded-xl font-bold border flex items-center justify-center gap-2 transition-all ${
                  settings.theme === 'dark'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                    : isLight ? 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <Moon className="w-4 h-4" />
                تیره (Dark)
              </button>
              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, theme: 'light' })}
                className={`py-2.5 px-3 rounded-xl font-bold border flex items-center justify-center gap-2 transition-all ${
                  settings.theme === 'light'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                    : isLight ? 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                روشن (Light)
              </button>
            </div>
          </div>
        </div>

          {/* Security & PIN Lock */}
          <div className={`border rounded-3xl p-5 space-y-4 ${
            isLight ? 'bg-white border-slate-200 text-slate-800 shadow-sm' : 'bg-slate-900 border-slate-800 text-slate-200'
          }`}>
            <h3 className={`font-bold text-sm border-b pb-2 ${
              isLight ? 'text-slate-900 border-slate-200' : 'text-slate-100 border-slate-800'
            }`}>
              امنیت و قفل نرم‌افزار
            </h3>

            <div className={`flex items-center justify-between p-3 rounded-2xl border ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/60 border-slate-700'
            }`}>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-500" />
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
              <div className="space-y-2">
                <label className={`block text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {settings.pinHash ? 'تغییر کد ۴ رقمی PIN' : 'تعیین کد ۴ رقمی PIN'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="۱۲۳۴"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    className={`flex-1 px-3 py-2 rounded-xl border font-mono text-center tracking-widest text-base ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-800 border-slate-700 text-slate-100'
                    }`}
                  />
                  <button
                    type="button"
                    disabled={isSavingPin}
                    onClick={handleSavePin}
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 disabled:opacity-50 transition-all"
                  >
                    {isSavingPin ? 'در حال ذخیره...' : 'ذخیره PIN'}
                  </button>
                </div>
                {pinStatus && (
                  <p className={`text-xs ${pinStatus.includes('موفقیت') ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {pinStatus}
                  </p>
                )}
              </div>
            )}

            <div className={`flex items-center justify-between p-3 rounded-2xl border ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/60 border-slate-700'
            }`}>
              <div className="flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold">ورود با اثر انگشت / بیومتریک</span>
              </div>
              <input
                type="checkbox"
                checked={settings.isBiometricsEnabled}
                onChange={(e) => handleToggleBiometrics(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-500"
              />
            </div>
          </div>

        {/* Backup & Data Sync */}
        <div className={`md:col-span-2 border rounded-3xl p-5 space-y-4 ${
          isLight ? 'bg-white border-slate-200 text-slate-800 shadow-sm' : 'bg-slate-900 border-slate-800 text-slate-200'
        }`}>
          <h3 className={`font-bold text-sm border-b pb-2 ${
            isLight ? 'text-slate-900 border-slate-200' : 'text-slate-100 border-slate-800'
          }`}>
            پشتیبان‌گیری و همگام‌سازی اطلاعات
          </h3>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onExportBackup}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold border transition-all ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <Download className="w-4 h-4 text-emerald-500" />
              دانلود خروجی پشتیبان (JSON)
            </button>

            <label className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold border cursor-pointer transition-all ${
              isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}>
              <Upload className="w-4 h-4 text-sky-500" />
              بازیابی اطلاعات از فایل پشتیبان
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {onLoadDemoData && (
              <button
                onClick={onLoadDemoData}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 font-bold border border-indigo-500/30 transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                بارگذاری داده‌های نمونه (Demo)
              </button>
            )}

            <button
              onClick={() => {
                if (
                  confirm(
                    'آیا مطمئن هستید که می‌خواهید تمام اطلاعات را پاکسازی کرده و برنامه‌ را به صفر بازنشانی کنید؟'
                  )
                ) {
                  onResetAllData();
                }
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold border border-rose-500/30 mr-auto transition-all"
            >
              <RefreshCw className="w-4 h-4 text-rose-500" />
              پاکسازی همه داده‌ها (شروع با ۰)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
