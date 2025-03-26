import { TourStep, TourPath } from '@/contexts/tour-context';
import { DynamicContentProvider } from '@/hooks/tour/analytics/types';

/**
 * Filters tour steps based on conditions
 * @param tourPath The tour path to filter steps for
 * @returns Array of visible steps after filtering
 */
export const getVisibleSteps = (tourPath: TourPath | undefined): TourStep[] => {
  if (!tourPath) return [];
  
  return tourPath.steps.filter(step => {
    // If the step has a condition function, evaluate it
    if (step.condition && typeof step.condition === 'function') {
      return step.condition();
    }
    // If no condition is specified, always show the step
    return true;
  });
};

/**
 * Gets the current step data
 * @param visibleSteps Array of visible steps
 * @param currentStep Current step index
 * @returns The current step data or null
 */
export const getCurrentStepData = (
  visibleSteps: TourStep[],
  currentStep: number
): TourStep | null => {
  return visibleSteps[currentStep] || null;
};

/**
 * Finds a tour path by ID
 * @param tourPaths Available tour paths
 * @param pathId The tour path ID to find
 * @returns The found tour path or undefined
 */
export const findTourPathById = (
  tourPaths: TourPath[],
  pathId: string | null
): TourPath | undefined => {
  if (!pathId) return undefined;
  return tourPaths.find((path) => path.id === pathId);
};

/**
 * Processes dynamic content for a step
 * @param step The step to process
 * @returns Promise that resolves to the step with processed content
 */
export const processDynamicContent = async (step: TourStep): Promise<TourStep> => {
  // Check if step has a dynamic content provider
  if (step.metadata?.dynamicContentProvider) {
    try {
      const contentProvider = step.metadata.dynamicContentProvider as DynamicContentProvider;
      const dynamicContent = await Promise.resolve(contentProvider());
      
      return {
        ...step,
        content: dynamicContent || step.metadata.originalContent || step.content
      };
    } catch (error) {
      console.error('Error loading dynamic content for step:', step.id, error);
      // Fall back to original content
      return {
        ...step,
        content: step.metadata.originalContent || step.content
      };
    }
  }
  
  // Return step unchanged if it has no dynamic content
  return step;
};

/**
 * Updates a step's content
 * @param steps Array of steps
 * @param stepId ID of step to update
 * @param content New content
 * @returns Updated array of steps
 */
export const updateStepContent = (
  steps: TourStep[],
  stepId: string,
  content: string
): TourStep[] => {
  return steps.map(step => {
    if (step.id === stepId) {
      return {
        ...step,
        content
      };
    }
    return step;
  });
};
