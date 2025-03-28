
import { useEffect, useState, useCallback } from 'react';
import { CustomerInfo } from '@/types/checkout';
import { toast } from 'sonner';

interface UseFormAutoSaveProps {
  formId: string;
  data: Partial<CustomerInfo>;
  onRestore: (data: Partial<CustomerInfo>) => void;
  saveInterval?: number;
}

/**
 * Hook for automatically saving form data to localStorage
 * Provides recovery capabilities for abandoned checkout
 */
export function useFormAutoSave({
  formId,
  data,
  onRestore,
  saveInterval = 5000 // Save every 5 seconds by default
}: UseFormAutoSaveProps) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasRestoredData, setHasRestoredData] = useState(false);
  
  const storageKey = `checkout_form_${formId}`;
  
  // Function to save data to localStorage
  const saveFormData = useCallback(() => {
    if (Object.keys(data).length === 0) return;
    
    try {
      // Only save non-empty values
      const dataToSave = Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);
      
      // Only save if we have meaningful data
      if (Object.keys(dataToSave).length > 0) {
        const saveData = {
          timestamp: new Date().toISOString(),
          data: dataToSave
        };
        
        localStorage.setItem(storageKey, JSON.stringify(saveData));
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  }, [data, storageKey]);
  
  // Auto-save on interval
  useEffect(() => {
    const timer = setInterval(saveFormData, saveInterval);
    
    return () => clearInterval(timer);
  }, [saveFormData, saveInterval]);
  
  // Save on unmount
  useEffect(() => {
    return () => {
      saveFormData();
    };
  }, [saveFormData]);
  
  // Check for saved data on mount and offer to restore
  useEffect(() => {
    if (hasRestoredData) return;
    
    try {
      const savedDataString = localStorage.getItem(storageKey);
      
      if (savedDataString) {
        const savedData = JSON.parse(savedDataString);
        const timestamp = new Date(savedData.timestamp);
        const now = new Date();
        const hoursSinceLastSave = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60);
        
        // Only offer to restore if data is less than 24 hours old
        if (hoursSinceLastSave < 24 && Object.keys(savedData.data).length > 0) {
          // If there is meaningful saved data, offer to restore
          toast({
            title: "Resume your checkout?",
            description: "We found your previously entered information.",
            action: {
              label: "Restore",
              onClick: () => {
                onRestore(savedData.data);
                setHasRestoredData(true);
                toast.success("Checkout information restored");
              }
            },
            duration: 10000 // Show for 10 seconds
          });
        } else if (hoursSinceLastSave >= 24) {
          // Clear old data
          localStorage.removeItem(storageKey);
        }
      }
      
      setHasRestoredData(true);
    } catch (error) {
      console.error('Error checking for saved form data:', error);
    }
  }, [storageKey, onRestore, hasRestoredData]);
  
  // Function to manually clear saved data
  const clearSavedData = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      setLastSaved(null);
    } catch (error) {
      console.error('Error clearing saved form data:', error);
    }
  }, [storageKey]);
  
  return {
    lastSaved,
    saveFormData,
    clearSavedData
  };
}
