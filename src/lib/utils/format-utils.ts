
import { format } from 'date-fns';

/**
 * Formats a date according to the specified format string
 * 
 * @param {Date|string|number} date - The date to format
 * @param {string} [formatStr='PPP'] - Format string using date-fns syntax (defaults to 'PPP')
 * @returns {string} The formatted date string
 * 
 * @example
 * // Returns "January 1, 2023"
 * formatDate(new Date(2023, 0, 1))
 * 
 * @example
 * // Returns "01/01/2023"
 * formatDate(new Date(2023, 0, 1), 'MM/dd/yyyy')
 */
export const formatDate = (date: Date | string | number, formatStr: string = 'PPP'): string => {
  return format(new Date(date), formatStr);
};

/**
 * Formats a currency value
 * 
 * @param {number} amount - The amount to format
 * @param {string} [currency='USD'] - The currency code to use
 * @param {string} [locale='en-US'] - The locale to use for formatting
 * @returns {string} The formatted currency string
 * 
 * @example
 * // Returns "$1,234.56"
 * formatCurrency(1234.56)
 * 
 * @example
 * // Returns "€1.234,56"
 * formatCurrency(1234.56, 'EUR', 'de-DE')
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
 * 
 * @param {string} str - The string to truncate
 * @param {number} [maxLength=50] - Maximum length before truncation
 * @returns {string} The truncated string with ellipsis if needed
 * 
 * @example
 * // Returns "This is a long text..."
 * truncateString("This is a long text that needs truncation", 20)
 */
export const truncateString = (str: string, maxLength: number = 50): string => {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
};
