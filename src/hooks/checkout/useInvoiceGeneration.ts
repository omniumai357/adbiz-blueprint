
import { useState, useEffect } from "react";

interface UseInvoiceGenerationProps {
  isGeneratingInvoice: boolean;
}

/**
 * Hook for managing the invoice generation progress animation
 */
export function useInvoiceGeneration({ isGeneratingInvoice }: UseInvoiceGenerationProps) {
  const [invoiceProgress, setInvoiceProgress] = useState(0);
  
  useEffect(() => {
    if (isGeneratingInvoice) {
      // Reset progress when starting
      setInvoiceProgress(0);
      
      const timer = setInterval(() => {
        setInvoiceProgress(prev => {
          const nextProgress = prev + 5;
          if (nextProgress >= 95) {
            clearInterval(timer);
            return 95; // Wait for actual completion to go to 100%
          }
          return nextProgress;
        });
      }, 250);
      
      return () => clearInterval(timer);
    } else {
      setInvoiceProgress(100);
    }
  }, [isGeneratingInvoice]);
  
  return { invoiceProgress };
}
