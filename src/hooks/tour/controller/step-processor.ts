
import { TourPath, TourStep } from '@/contexts/tour/types';

/**
 * Find a tour path by ID
 */
export function findTourPathById(
  tourPaths: TourPath[],
  pathId: string | null
): TourPath | undefined {
  if (!pathId) return undefined;
  return tourPaths.find(path => path.id === pathId);
}

/**
 * Get current step data
 */
export function getCurrentStepData(
  steps: TourStep[] | undefined, 
  currentStep: number
): TourStep | null {
  if (!steps || steps.length === 0) {
    return null;
  }
  
  return steps[currentStep] || null;
}

/**
 * Get visible steps based on conditions
 */
export function getVisibleSteps(steps: TourStep[], state: any = {}): TourStep[] {
  return steps.filter(step => {
    // Skip hidden steps
    if (step.isHidden) return false;
    
    // Evaluate condition if present
    if (step.condition && !step.condition(state)) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Sort by order if present
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    return 0;
  });
}
