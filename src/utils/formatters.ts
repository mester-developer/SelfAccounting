import * as jalaali from 'jalaali-js';

// Convert Persian and Arabic digits to English digits for numeric input handling
export function toEnglishDigits(str: string | number): string {
  if (str === null || str === undefined) return '';
  const s = String(str);
  return s
    .replace(/[۰٠]/g, '0')
    .replace(/[۱١]/g, '1')
    .replace(/[۲٢]/g, '2')
    .replace(/[۳٣]/g, '3')
    .replace(/[۴٤]/g, '4')
    .replace(/[۵٥]/g, '5')
    .replace(/[۶٦]/g, '6')
    .replace(/[۷٧]/g, '7')
    .replace(/[۸٨]/g, '8')
    .replace(/[۹٩]/g, '9');
}

// Convert English numbers to Persian digits
export function toPersianDigits(str: string | number): string {
  if (str === null || str === undefined) return '';
  const englishToPersianMap: { [key: string]: string } = {
    '0': '۰',
    '1': '۱',
    '2': '۲',
    '3': '۳',
    '4': '۴',
    '5': '۵',
    '6': '۶',
    '7': '۷',
    '8': '۸',
    '9': '۹',
  };
  return str
    .toString()
    .replace(/[0-9]/g, (w) => englishToPersianMap[w] || w);
}

// Format numbers with thousand separators
export function formatNumber(
  amount: number,
  usePersianDigits: boolean = true
): string {
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return usePersianDigits ? toPersianDigits(formatted) : formatted;
}

// Format currency according to currency code
export function formatCurrency(
  amount: number,
  currencyCode: 'TOMAN' | 'IRR' | 'USD' | 'EUR' = 'TOMAN',
  usePersianDigits: boolean = true
): string {
  const absAmount = Math.abs(amount);
  let formattedValue = '';
  let symbol = '';

  switch (currencyCode) {
    case 'TOMAN':
      formattedValue = formatNumber(absAmount, usePersianDigits);
      symbol = usePersianDigits ? 'تومان' : 'Toman';
      break;
    case 'IRR':
      formattedValue = formatNumber(absAmount, usePersianDigits);
      symbol = usePersianDigits ? 'ریال' : 'IRR';
      break;
    case 'USD':
      formattedValue = formatNumber(absAmount, false);
      symbol = '$';
      return `${amount < 0 ? '-' : ''}${symbol}${formattedValue}`;
    case 'EUR':
      formattedValue = formatNumber(absAmount, false);
      symbol = '€';
      return `${amount < 0 ? '-' : ''}${symbol}${formattedValue}`;
  }

  const sign = amount < 0 ? '-' : '';
  return `${sign}${formattedValue} ${symbol}`;
}

// Convert Gregorian Date YYYY-MM-DD to Jalali Date YYYY/MM/DD
export function toJalaliDate(isoDateString: string): string {
  try {
    if (!isoDateString) return '';
    const dateParts = isoDateString.split('T')[0].split('-');
    if (dateParts.length < 3) return isoDateString;

    const gYear = parseInt(dateParts[0], 10);
    const gMonth = parseInt(dateParts[1], 10);
    const gDay = parseInt(dateParts[2], 10);

    const jDate = jalaali.toJalaali(gYear, gMonth, gDay);
    const mStr = jDate.jm < 10 ? `0${jDate.jm}` : `${jDate.jm}`;
    const dStr = jDate.jd < 10 ? `0${jDate.jd}` : `${jDate.jd}`;

    return `${jDate.jy}/${mStr}/${dStr}`;
  } catch (e) {
    return isoDateString;
  }
}

// Persian Month Names
export const JALALI_MONTH_NAMES = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

// Get Jalali Month Name from ISO date
export function getJalaliMonthName(isoDateString: string): string {
  try {
    if (!isoDateString || typeof isoDateString !== 'string') return '';
    const dateParts = isoDateString.split('T')[0].split('-');
    const gYear = parseInt(dateParts[0], 10);
    const gMonth = parseInt(dateParts[1], 10);
    const gDay = parseInt(dateParts[2], 10);
    const jDate = jalaali.toJalaali(gYear, gMonth, gDay);
    return JALALI_MONTH_NAMES[jDate.jm - 1] || '';
  } catch (e) {
    return '';
  }
}

// Format display date based on user settings
export function formatDate(
  isoDateString: string,
  format: 'jalali' | 'gregorian' = 'jalali',
  usePersianDigits: boolean = true
): string {
  if (!isoDateString || typeof isoDateString !== 'string') return '';
  if (format === 'jalali') {
    const jDate = toJalaliDate(isoDateString);
    return usePersianDigits ? toPersianDigits(jDate) : jDate;
  }
  const dateOnly = isoDateString.split('T')[0];
  return usePersianDigits ? toPersianDigits(dateOnly) : dateOnly;
}

// Today ISO String YYYY-MM-DD
export function getTodayIso(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Group balances by currency code
export function groupBalancesByCurrency(accounts: { balance: number; currency: string }[]): Record<string, number> {
  return (accounts || []).reduce((acc, a) => {
    if (!a || !a.currency) return acc;
    acc[a.currency] = (acc[a.currency] || 0) + (a.balance || 0);
    return acc;
  }, {} as Record<string, number>);
}
