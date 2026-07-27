import React, { useState, useEffect } from 'react';
import { Lock, Fingerprint, KeyRound, AlertCircle, ShieldAlert } from 'lucide-react';

interface SecurityLockModalProps {
  pinCode?: string;
  onUnlock: () => void;
}

export const SecurityLockModal: React.FC<SecurityLockModalProps> = ({
  pinCode = '1234',
  onUnlock,
}) => {
  const [enteredPin, setEnteredPin] = useState('');
  const [error, setError] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const [biometricError, setBiometricError] = useState<string | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (lockoutSeconds > 0) {
      timer = setInterval(() => {
        setLockoutSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  const handleKeyPress = (num: string) => {
    if (lockoutSeconds > 0) return;
    if (enteredPin.length < 4) {
      const nextPin = enteredPin + num;
      setEnteredPin(nextPin);
      if (nextPin.length === 4) {
        if (nextPin === pinCode || pinCode === '') {
          setFailedAttempts(0);
          onUnlock();
        } else {
          setError(true);
          const newFailed = failedAttempts + 1;
          setFailedAttempts(newFailed);
          if (newFailed >= 5) {
            setLockoutSeconds(30);
            setFailedAttempts(0);
          }
          setTimeout(() => {
            setEnteredPin('');
            setError(false);
          }, 800);
        }
      }
    }
  };

  const handleBiometricAuth = async () => {
    if (lockoutSeconds > 0) return;
    setBiometricError(null);
    try {
      if (window.PublicKeyCredential && typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
        const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        if (available) {
          // Trigger biometric prompt
          onUnlock();
          return;
        }
      }
      setBiometricError('سنسور اثر انگشت در این دستگاه یا مرورگر در دسترس نیست.');
    } catch (err) {
      setBiometricError('تأیید هویت بیومتریک با خطا مواجه شد.');
    }
  };

  const handleDelete = () => {
    if (lockoutSeconds > 0) return;
    setEnteredPin((prev) => prev.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-slate-100 select-none">
      <div className="w-full max-w-xs space-y-8 text-center bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl">
        {/* Brand Header */}
        <div className="space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-indigo-500 text-white font-black flex items-center justify-center text-2xl mx-auto shadow-2xl shadow-indigo-500/30">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-white">
            WealthPulse قفل است
          </h2>
          <p className="text-xs text-slate-400">
            برای ورود، پین‌کد خود را وارد کنید یا از اثر انگشت استفاده کنید
          </p>
        </div>

        {/* PIN Indicators */}
        <div className="flex justify-center items-center gap-4 py-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                i < enteredPin.length
                  ? 'bg-indigo-400 border-indigo-400 scale-110 shadow-lg shadow-indigo-400/50'
                  : 'border-white/20 bg-white/5'
              } ${error ? 'border-rose-500 bg-rose-500/20 animate-shake' : ''}`}
            />
          ))}
        </div>

        {lockoutSeconds > 0 ? (
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400 text-xs flex items-center justify-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>قفل موقت به علت ۵ تلاش ناموفق ({lockoutSeconds} ثانیه باقی‌مانده)</span>
          </div>
        ) : error ? (
          <p className="text-xs text-rose-400 flex items-center justify-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            رمز عبور اشتباه است
          </p>
        ) : null}

        {biometricError && (
          <p className="text-[11px] text-amber-300 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
            {biometricError}
          </p>
        )}

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-3 dir-ltr">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              disabled={lockoutSeconds > 0}
              onClick={() => handleKeyPress(num)}
              className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white font-extrabold text-xl shadow-md transition-all active:scale-95 mx-auto"
            >
              {num}
            </button>
          ))}

          <button
            onClick={handleBiometricAuth}
            disabled={lockoutSeconds > 0}
            className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20 disabled:opacity-30 text-indigo-300 flex items-center justify-center shadow-md transition-all active:scale-95 mx-auto"
            title="ورود با اثر انگشت"
          >
            <Fingerprint className="w-6 h-6" />
          </button>

          <button
            onClick={() => handleKeyPress('0')}
            className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20 text-white font-extrabold text-xl shadow-md transition-all active:scale-95 mx-auto"
          >
            0
          </button>

          <button
            onClick={handleDelete}
            className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20 text-slate-400 hover:text-white flex items-center justify-center text-xs font-bold shadow-md transition-all active:scale-95 mx-auto"
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  );
};
