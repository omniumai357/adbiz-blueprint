
/**
 * Checkout tour-specific condition functions
 */

// Function to check if user has payment methods saved
export const hasSavedPaymentMethods = (): boolean => {
  // In reality, this would check local storage or context/state
  // For demo purposes, we'll return false
  return false;
};

// Function to check if discount section should be shown
export const hasAvailableDiscounts = (): boolean => {
  // This would check user's discount eligibility
  return true;
};

// Function to check if user is returning customer
export const isReturningCustomer = (): boolean => {
  const completedTours = JSON.parse(localStorage.getItem('completedTours') || '[]');
  return completedTours.includes('checkout-tour');
};

// Function to check if user is on mobile
export const isMobileDevice = (): boolean => {
  return window.innerWidth < 768;
};
