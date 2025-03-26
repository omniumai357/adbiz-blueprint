
import { TourStep, TourPath } from '@/contexts/tour/types';
import { getAllStepGroups } from '../tourStepGroups';

/**
 * Creates a tour path by combining multiple step groups
 * 
 * @param id Unique identifier for the tour path
 * @param name Display name for the tour path
 * @param groupIds Array of step group IDs to include
 * @param options Additional configuration options
 * @returns A tour path object with steps from the specified groups
 */
export function createTourPathFromGroups(
  id: string,
  name: string,
  groupIds: string[],
  options?: {
    allowSkip?: boolean;
    showProgress?: boolean;
    route?: string;
    tags?: string[];
    userRoles?: string[];
    displayCondition?: () => boolean | Promise<boolean>;
  }
): TourPath {
  // Get all registered step groups
  const allGroups = getAllStepGroups();
  
  // Collect steps from the specified groups
  let allSteps: TourStep[] = [];
  
  groupIds.forEach(groupId => {
    const group = allGroups[groupId];
    if (group && group.steps) {
      allSteps = [...allSteps, ...group.steps];
    }
  });
  
  // Create and return the tour path
  return {
    id,
    name,
    steps: allSteps,
    allowSkip: options?.allowSkip ?? true,
    showProgress: options?.showProgress ?? true,
    route: options?.route,
    config: {
      allowSkip: options?.allowSkip,
      showProgress: options?.showProgress,
      metadata: {
        tags: options?.tags || [],
        userRoles: options?.userRoles || []
      }
    }
  };
}
