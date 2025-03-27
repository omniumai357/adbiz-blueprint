
import { useCallback } from 'react';
import { TourStep, TourPath } from '@/contexts/tour-context';

/**
 * Updates step content and returns an updated steps array
 * @param steps Array of tour steps
 * @param stepId ID of the step to update
 * @param content New content for the step
 * @returns Updated steps array
 */
export function updateStepContent(steps: TourStep[], stepId: string, content: string): TourStep[] {
  return steps.map(step => 
    step.id === stepId ? { ...step, content } : step
  );
}

/**
 * Process dynamic content for a step
 * @param step Tour step to process
 * @returns Processed step with updated content
 */
export async function processDynamicContent(step: TourStep): Promise<TourStep> {
  // This would typically involve making API calls or processing data
  // For now, we just return the original step
  return step;
}

/**
 * Hook to handle dynamic content in tour steps
 */
export function useDynamicContent(
  visibleSteps: TourStep[],
  setVisibleSteps: React.Dispatch<React.SetStateAction<TourStep[]>>,
  setTourPaths: React.Dispatch<React.SetStateAction<TourPath[]>>
) {
  // Process dynamic content for steps
  const processStepDynamicContent = useCallback(async (steps: TourStep[]): Promise<TourStep[]> => {
    return Promise.all(
      steps.map(async (step) => {
        return await processDynamicContent(step);
      })
    );
  }, []);

  // Set dynamic content for a specific step
  const setDynamicContent = useCallback((stepId: string, content: string) => {
    setVisibleSteps(prev => updateStepContent(prev, stepId, content));
    
    // Also update the original tour path to persist changes
    setTourPaths(prev => prev.map(path => {
      return {
        ...path,
        steps: updateStepContent(path.steps, stepId, content)
      };
    }));
  }, [setVisibleSteps, setTourPaths]);

  return {
    processStepDynamicContent,
    setDynamicContent
  };
}
