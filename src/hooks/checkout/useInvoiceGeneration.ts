
import { useState, useEffect, useCallback } from "react";

interface UseInvoiceGenerationProps {
  isGeneratingInvoice: boolean;
  startPercentage?: number;
  endPercentage?: number;
  stepSize?: number;
  stepInterval?: number;
  onComplete?: () => void;
}

/**
 * Enhanced hook for managing the invoice generation progress animation
 * with customizable progress parameters and completion callback
 */
export function useInvoiceGeneration({ 
  isGeneratingInvoice, 
  startPercentage = 0,
  endPercentage = 95,
  stepSize = 5,
  stepInterval = 250,
  onComplete
}: UseInvoiceGenerationProps) {
  const [invoiceProgress, setInvoiceProgress] = useState(startPercentage);
  
  const resetProgress = useCallback(() => {
    setInvoiceProgress(startPercentage);
  }, [startPercentage]);
  
  const completeProgress = useCallback(() => {
    setInvoiceProgress(100);
    onComplete?.();
  }, [onComplete]);
  
  useEffect(() => {
    if (isGeneratingInvoice) {
      // Reset progress when starting
      resetProgress();
      
      const timer = setInterval(() => {
        setInvoiceProgress(prev => {
          const nextProgress = prev + stepSize;
          if (nextProgress >= endPercentage) {
            clearInterval(timer);
            return endPercentage; // Wait for actual completion to go to 100%
          }
          return nextProgress;
        });
      }, stepInterval);
      
      return () => clearInterval(timer);
    } else {
      // Complete the progress animation
      completeProgress();
    }
  }, [isGeneratingInvoice, stepSize, endPercentage, stepInterval, resetProgress, completeProgress]);
  
  return { 
    invoiceProgress,
    resetProgress,
    completeProgress 
  };
}
