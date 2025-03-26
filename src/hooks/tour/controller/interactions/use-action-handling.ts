
import { useCallback } from "react";
import { TourStep } from "@/contexts/tour-context";

/**
 * Hook to handle custom actions defined in tour steps
 */
export function useActionHandling(currentStepData: TourStep | null) {
  // Execute custom action if defined in the step
  const executeStepAction = useCallback((actionType: 'next' | 'prev' | 'skip') => {
    if (!currentStepData?.actions?.[actionType]?.onClick) return;
    
    // Execute the custom action
    currentStepData.actions[actionType].onClick();
  }, [currentStepData]);

  return { executeStepAction };
}
