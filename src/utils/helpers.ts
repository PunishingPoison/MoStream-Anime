import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

export const isEmpty = <T>(value: T): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (value instanceof Map || value instanceof Set) return value.size === 0;
  if (value !== null && typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

export function formatNumber(
  num: number,
  options: { decimals?: number; forceDecimals?: boolean; uppercase?: boolean } = {},
): string {
  const { decimals = 1, forceDecimals = false, uppercase = false } = options;
  const isNegative = num < 0;
  const absNum = Math.abs(num);
  const abbreviations = [
    { threshold: 1e12, suffix: 't' },
    { threshold: 1e9, suffix: 'b' },
    { threshold: 1e6, suffix: 'm' },
    { threshold: 1e3, suffix: 'k' },
  ];
  for (const { threshold, suffix } of abbreviations) {
    if (absNum >= threshold) {
      const abbreviated = absNum / threshold;
      let result: string;
      if (forceDecimals || abbreviated % 1 !== 0) {
        result = abbreviated.toFixed(decimals);
        if (!forceDecimals) result = result.replace(/\.?0+$/, '');
      } else {
        result = abbreviated.toFixed(0);
      }
      const formattedSuffix = uppercase ? suffix.toUpperCase() : suffix;
      return (isNegative ? '-' : '') + result + formattedSuffix;
    }
  }
  return num.toString();
}

export const formatDate = (
  date: string | Date,
  locale = 'id-ID',
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' },
): string => {
  if (!date) return '';
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(parsedDate.getTime())) throw new Error('Invalid date input');
  return new Intl.DateTimeFormat(locale, options).format(parsedDate);
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }
  return shuffled;
};

export const diff = (a: number, b: number): number => Math.abs(Math.round(a) - Math.round(b));
