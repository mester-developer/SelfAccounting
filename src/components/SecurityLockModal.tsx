import React, { useState, useEffect } from 'react';
import { UserSettings } from '../types';
import { hashPin, generateSalt } from '../utils/crypto';
import { getLockState, saveLockState, clearLockState } from '../utils/lockState';
import { Lock, Fingerprint, AlertCircle, ShieldAlert, Loader2 } from 'lucide-react';

interface SecurityLockModalProps {
  settings: UserSettings;
  onUpdateSettings?: (s: UserSettings) => void;
  onUnlock: () => void;
}

export const SecurityLockModal: React.FC<SecurityLockModalProps> = ({
  settings,
  onUpdateSettings,
  onUnlock,
}) => {
  const [enteredPin, setEnteredPin] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const [biometricError, setBiometricError] = useState<string | null>(null);

  // Load lockout state on mount
  useEffect(() => {
    const state = getLockState();
    setFailedAttempts(state.failedAttempts);

    if (state.lockoutUntil && state.lockoutUntil > Date.now()) {
      const remaining = Math.ceil((state.lockoutUntil - Date.now()) / 1000);
      setLockoutSeconds(remaining);
    }
  }, []);

  // Lockout Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (lockoutSeconds > 0) {
      timer = setInterval(() => {
        const state = getLockState();
        if (state.lockoutUntil && state.lockoutUntil > Date.now()) {
          const remaining = Math.ceil((state.lockoutUntil - Date.now()) / 1000);
          setLockoutSeconds(remaining);
        } else {
          setLockoutSeconds(0);
          saveLockState({ failedAttempts: 0, lockoutUntil: null });
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  const handleKeyPress = async (num: string) => {
    if (lockoutSeconds > 0 || isVerifying) return;
    if (enteredPin.length < 4) {
      const nextPin = enteredPin + num;
      setEnteredPin(nextPin);

      if (nextPin.length === 4) {
        setIsVerifying(true);
        setError(false);
        setErrorMessage(null);

        try {
          let isMatch = false;

          if (settings.pinHash && settings.pinSalt) {
            const hash = await hashPin(nextPin, settings.pinSalt);
            isMatch = hash === settings.pinHash;
          } else if (settings.pinCode && settings.pinCode.trim() !== '') {
            // Auto-migration path for legacy plaintext pinCode
            if (nextPin === settings.pinCode) {
              isMatch = true;
              const salt = generateSalt();
              const hash = await hashPin(nextPin, salt);
              if (onUpdateSettings) {
                onUpdateSettings({
                  ...settings,
                  pinHash: hash,
                  pinSalt: salt,
                  pinCode: undefined, // Clear plaintext
                });
              }
            }
          } else {
            // Fail-closed: PIN is enabled but no pinHash or pinCode set!
            setErrorMessage('کد PIN در تنظیمات ثبت نشده است.');
            setIsVerifying(false);
            setEnteredPin('');
            return;
          }

          if (isMatch) {
            clearLockState();
            setFailedAttempts(0);
            onUnlock();
          } else {
            setError(true);
            const newFailed = failedAttempts + 1;
            setFailedAttempts(newFailed);

            if (newFailed >= 5) {
              const lockoutUntil = Date.now() + 30000;
              saveLockState({ failedAttempts: 0, lockoutUntil });
              setLockoutSeconds(30);
              setFailedAttempts(0);
            } else {
              saveLockState({ failedAttempts: newFailed, lockoutUntil: null });
            }

            setTimeout(() => {
              setEnteredPin('');
              setError(false);
            }, 800);
          }
        } catch (err) {
          setErrorMessage('خطا در بررسی رمز عبور.');
        } finally {
          setIsVerifying(false);
        }
      }
    }
  };

  const handleBiometricAuth = async () => {
    if (lockoutSeconds > 0 || isVerifying) return;
    setBiometricError(null);

    try {
      if (
        window.PublicKeyCredential &&
        typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function'
      ) {
        const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        if (available && navigator.credentials && navigator.credentials.get) {
          const challenge = new Uint8Array(32);
          crypto.getRandomValues(challenge);

          const assertion = await navigator.credentials.get({
            publicKey: {
              challenge,
              userVerification: 'required',
              timeout: 60000,
            },
          });

          if (assertion) {
            clearLockState();
            onUnlock();
            return;
          }
        }
      }
      setBiometricError('سنسور بیومتریک در این دستگاه یا مرورگر در دسترس نیست.');
    } catch (err) {
      console.warn('Biometric auth failed or cancelled:', err);
      setBiometricError('تأیید هویت بیومتریک لغو شد یا با خطا مواجه گردید.');
    }
  };

  const handleDelete = () => {
    if (lockoutSeconds > 0 || isVerifying) return;
    setEnteredPin((prev) => prev.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-slate-100 select-none">
      <div className="w-full max-w-xs space-y-8 text-center bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl">
        {/* Brand Header */}
        <div className="space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-indigo-500 text-white font-black flex items-center justify-center text-2xl mx-auto shadow-2xl shadow-indigo-500/30">
            {isVerifying ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <Lock className="w-8 h-8" />
            )}
          </div>
          <h2 className="text-xl font-extrabold text-white">WealthPulse قفل است</h2>
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
        ) : errorMessage ? (
          <p className="text-xs text-amber-400 flex items-center justify-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errorMessage}
          </p>
        ) : error ? (
          <p className="text-xs text-rose-400 flex items-center justify-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
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
              disabled={lockoutSeconds > 0 || isVerifying}
              onClick={() => handleKeyPress(num)}
              className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white font-extrabold text-xl shadow-md transition-all active:scale-95 mx-auto flex items-center justify-center"
            >
              {num}
            </button>
          ))}

          <button
            onClick={handleBiometricAuth}
            disabled={lockoutSeconds > 0 || isVerifying || !settings.isBiometricsEnabled}
            className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20 disabled:opacity-30 text-indigo-300 flex items-center justify-center shadow-md transition-all active:scale-95 mx-auto"
            title="ورود با اثر انگشت"
          >
            <Fingerprint className="w-6 h-6" />
          </button>

          <button
            onClick={() => handleKeyPress('0')}
            disabled={lockoutSeconds > 0 || isVerifying}
            className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-extrabold text-xl shadow-md transition-all active:scale-95 mx-auto flex items-center justify-center"
          >
            0
          </button>

          <button
            onClick={handleDelete}
            disabled={lockoutSeconds > 0 || isVerifying}
            className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20 disabled:opacity-30 text-slate-400 hover:text-white flex items-center justify-center text-xs font-bold shadow-md transition-all active:scale-95 mx-auto"
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  );
};
