
import React, { createContext, useContext, ReactNode, useState, useCallback } from "react";
import { useToast } from "@/hooks/ui/use-toast";
import { 
  formatErrorMessage, 
  logError, 
  ValidationError 
} from "@/utils/error-handling";

interface ErrorContextType {
  // Track current global error
  error: Error | null;
  setError: (error: Error | null) => void;
  
  // Toast-based error notifications
  notifyError: (error: unknown, context?: string) => void;
  clearError: () => void;
  
  // Form validation errors
  setValidationErrors: (errors: Record<string, string>) => void;
  validationErrors: Record<string, string>;
  clearValidationErrors: () => void;
  
  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<Error | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const notifyError = useCallback((err: unknown, context?: string) => {
    logError(err, context);
    
    const message = formatErrorMessage(err);
    
    // Set the error state
    if (err instanceof Error) {
      setError(err);
    } else {
      setError(new Error(message));
    }
    
    // Show toast notification
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
      duration: 5000,
    });
    
    // Handle validation errors specially
    if (err instanceof ValidationError && err.fields) {
      setValidationErrors(err.fields);
    }
  }, [toast]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  const clearValidationErrors = useCallback(() => {
    setValidationErrors({});
  }, []);

  return (
    <ErrorContext.Provider
      value={{
        error,
        setError,
        notifyError,
        clearError,
        validationErrors,
        setValidationErrors,
        clearValidationErrors,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
};

export const useErrorContext = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error("useErrorContext must be used within an ErrorProvider");
  }
  return context;
};
