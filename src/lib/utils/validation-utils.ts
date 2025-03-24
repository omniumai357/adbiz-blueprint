
/**
 * Validates an email address
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a URL
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
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  // This is a simple validation that checks for at least 10 digits
  const phoneRegex = /^\+?[\d\s()-]{10,}$/;
  return phoneRegex.test(phone);
};
