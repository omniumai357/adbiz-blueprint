
import { TourPath, TourStep } from '@/contexts/tour/types';
import { createNamedTourPath } from './createTourPath';

// Define TourStepGroup interface if not already defined
interface TourStepGroup {
  id: string;
  name: string;
  steps: TourStep[];
}

/**
 * Creates a tour path from an array of step groups
 * 
 * @param id Path identifier
 * @param name Display name
 * @param stepGroups Array of step groups
 * @param options Configuration options
 * @returns A tour path
 */
export const createTourPathFromGroups = (
  id: string,
  name: string,
  stepGroups: TourStepGroup[],
  options?: {
    allowSkip?: boolean;
    showProgress?: boolean;
    route?: string;
    userRoles?: string[];
  }
): TourPath => {
  // Flatten all steps from the groups
  const allSteps = stepGroups.reduce((acc, group) => [...acc, ...group.steps], [] as TourStep[]);
  
  return createNamedTourPath(id, name, allSteps, options);
};
