
import { toast } from "@/hooks/use-toast";

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
  const description = error instanceof Error ? error.message : 'An unexpected error occurred';
  
  toast({
    title,
    description,
    variant: "destructive",
    duration: 4000
  });
  
  // Log error for debugging
  console.error(`${title}:`, error);
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
