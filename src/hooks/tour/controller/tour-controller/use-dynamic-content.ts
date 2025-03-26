
import { useCallback } from 'react';
import { TourStep } from '@/contexts/tour-context';
import { processDynamicContent, updateStepContent } from '../step-processor';

/**
 * Hook to handle dynamic content in tour steps
 */
export function useDynamicContent(
  visibleSteps: TourStep[],
  setVisibleSteps: (steps: TourStep[]) => void,
  setTourPaths: (paths: TourPath[]) => void
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
        steps: path.steps.map(step => {
          if (step.id === stepId) {
            return {
              ...step,
              content
            };
          }
          return step;
        })
      };
    }));
  }, [setVisibleSteps, setTourPaths]);

  return {
    processStepDynamicContent,
    setDynamicContent
  };
}
