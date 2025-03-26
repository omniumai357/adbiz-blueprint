
import { TourStep, TourPath } from '@/contexts/tour/types';

/**
 * Creates a new tour path
 * 
 * @param id Unique identifier for the tour path
 * @param name Display name for the tour path
 * @param steps Array of tour steps
 * @param options Additional configuration options
 * @returns A tour path object
 */
export function createTourPath(
  id: string,
  name: string,
  steps: TourStep[],
  options?: {
    allowSkip?: boolean;
    showProgress?: boolean;
    route?: string;
    tags?: string[];
    userRoles?: string[];
    displayCondition?: () => boolean | Promise<boolean>;
  }
): TourPath {
  return {
    id,
    name,
    steps,
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
