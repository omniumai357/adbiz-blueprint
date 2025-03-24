
import { format } from 'date-fns';

/**
 * Formats a date according to the specified format string
 */
export const formatDate = (date: Date | string | number, formatStr: string = 'PPP'): string => {
  return format(new Date(date), formatStr);
};

/**
 * Formats a currency value
 */
export const formatCurrency = (
  amount: number, 
  currency: string = 'USD', 
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Truncates a string to the specified length
 */
export const truncateString = (str: string, maxLength: number = 50): string => {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
};
