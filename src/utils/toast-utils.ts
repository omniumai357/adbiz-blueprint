
import { toast } from "@/hooks/use-toast";

/**
 * Show a success toast with a standard format
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
 */
export const createToastEvent = (title: string, description?: string) => {
  return new CustomEvent('show-toast', {
    detail: { title, description }
  });
};
