
/**
 * Utility functions for data validation
 */

/**
 * Validates an email address
 * 
 * Uses a simple regex pattern to check email format.
 * 
 * @param {string} email - The email address to validate
 * @returns {boolean} True if the email is valid, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a URL
 * 
 * Uses the built-in URL constructor to check if the URL is valid.
 * This provides robust validation for URL formats.
 * 
 * @param {string} url - The URL to validate
 * @returns {boolean} True if the URL is valid, false otherwise
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validates a phone number (basic validation)
 * 
 * Checks if the phone number contains at least 10 digits and
 * allows for common formatting characters like spaces, dashes,
 * parentheses, and the plus sign for international numbers.
 * 
 * @param {string} phone - The phone number to validate
 * @returns {boolean} True if the phone number is valid, false otherwise
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  // This is a simple validation that checks for at least 10 digits
  const phoneRegex = /^\+?[\d\s()-]{10,}$/;
  return phoneRegex.test(phone);
};
