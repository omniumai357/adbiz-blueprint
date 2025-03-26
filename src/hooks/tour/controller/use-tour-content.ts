
import { useState, useCallback } from 'react';
import { TourStep } from '@/contexts/tour-context';

/**
 * Hook for managing dynamic content in tours
 */
export function useTourContent(
  visibleSteps: TourStep[],
  setVisibleSteps: (steps: TourStep[]) => void
) {
  const [dynamicContent, setDynamicContent] = useState<Record<string, string>>({});

  // Update dynamic content for a specific step
  const updateDynamicContent = useCallback((stepId: string, content: string) => {
    setDynamicContent(prev => ({
      ...prev,
      [stepId]: content
    }));
    
    // Also update the step in visibleSteps if it exists
    setVisibleSteps(
      visibleSteps.map(step => 
        step.id === stepId 
          ? { ...step, content } 
          : step
      )
    );
  }, [visibleSteps, setVisibleSteps]);

  // Get content for the current step, either from dynamic content or step itself
  const getContentForStep = useCallback((stepData: TourStep | null) => {
    if (!stepData) return '';
    
    return dynamicContent[stepData.id] || stepData.content || '';
  }, [dynamicContent]);

  return {
    setDynamicContent: updateDynamicContent,
    getContentForStep
  };
}
