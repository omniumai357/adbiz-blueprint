
import { toast } from "@/hooks/ui/use-toast";
import { formatErrorMessage, logError } from "@/utils/error-handling";

/**
 * Show a success toast with a standard format
 * 
 * @param title - The main message to display
 * @param description - Optional additional details
 * 
 * @example
 * // Show a simple success message
 * showSuccessToast("Operation completed");
 * 
 * // Show a success message with additional details
 * showSuccessToast("Profile updated", "Your profile has been successfully updated");
 */
export const showSuccessToast = (title: string, description?: string) => {
  toast({
    title,
    description,
    duration: 3000
  });
};

/**
 * Show an error toast with a standard format
 * 
 * @param title - The main error message
 * @param error - The error object or message
 * @remarks Also logs the error to the console for debugging
 * 
 * @example
 * try {
 *   // Some operation that might fail
 * } catch (error) {
 *   showErrorToast("Failed to update profile", error);
 * }
 */
export const showErrorToast = (title: string, error: any) => {
  // Use our standardized error formatter
  const description = formatErrorMessage(error);
  
  toast({
    title,
    description,
    variant: "destructive",
    duration: 4000
  });
  
  // Log error for debugging
  logError(error, title);
};

/**
 * Show an info toast with a standard format
 * 
 * @param title - The main message to display
 * @param description - Optional additional details
 * 
 * @example
 * // Show an informational message
 * showInfoToast("New feature available", "Try our new dashboard layout");
 */
export const showInfoToast = (title: string, description?: string) => {
  toast({
    title,
    description,
    duration: 5000
  });
};

/**
 * Show a warning toast with a standard format
 * 
 * @param title - The main warning message
 * @param description - Optional additional details
 * 
 * @example
 * // Show a warning message
 * showWarningToast("Session expiring", "Your session will expire in 5 minutes");
 */
export const showWarningToast = (title: string, description?: string) => {
  toast({
    title,
    description,
    duration: 6000,
    variant: "destructive",
    className: "bg-amber-500"
  });
};

/**
 * Create a toast event that can be dispatched
 * 
 * Useful for components that need to trigger toasts outside
 * the React component tree or from within workers/APIs
 * 
 * @param title - The main message to display
 * @param description - Optional additional details
 * @returns A CustomEvent that can be dispatched
 * 
 * @example
 * // Create and dispatch a toast event
 * const toastEvent = createToastEvent('File uploaded', 'Your file was uploaded successfully');
 * document.dispatchEvent(toastEvent);
 */
export const createToastEvent = (title: string, description?: string) => {
  return new CustomEvent('show-toast', {
    detail: { title, description }
  });
};
