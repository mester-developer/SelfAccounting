import React from 'react';
import { toEnglishDigits, toPersianDigits } from '../utils/formatters';

interface AmountInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string | number;
  onChange: (value: string) => void;
  currencySymbol?: string;
}

export const formatWithCommas = (val: string | number): string => {
  if (val === null || val === undefined || val === '') return '';
  const clean = toEnglishDigits(val).replace(/[^0-9.]/g, '');
  if (!clean) return '';
  const parts = clean.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

export const parseRawAmount = (formattedVal: string): string => {
  const english = toEnglishDigits(formattedVal);
  return english.replace(/,/g, '').replace(/[^0-9.]/g, '');
};

export const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChange,
  currencySymbol = 'تومان',
  className = '',
  placeholder = '۰',
  ...props
}) => {
  const displayValue = formatWithCommas(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseRawAmount(e.target.value);
    onChange(raw);
  };

  return (
    <div className="relative flex items-center w-full">
      <input
        {...props}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full pl-12 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white font-mono font-bold text-left focus:outline-none focus:border-indigo-500/80 transition-all ${className}`}
        dir="ltr"
      />
      {currencySymbol && (
        <span className="absolute left-3 text-xs font-semibold text-slate-400 pointer-events-none select-none">
          {currencySymbol}
        </span>
      )}
    </div>
  );
};
