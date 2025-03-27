
import { TourStep, TourPath } from '../../types';

/**
 * Creates a tour path from an array of steps
 * 
 * @param steps Array of tour steps
 * @returns A tour path
 */
export const createTourPath = (steps: TourStep[]): TourPath => {
  return {
    id: `path-${Math.random().toString(36).substr(2, 9)}`,
    name: 'Generated Tour Path',
    steps,
    allowSkip: true,
    showProgress: true,
    config: {
      allowSkip: true,
      showProgress: true
    }
  };
};

/**
 * Creates a named tour path with configuration options
 *
 * @param id Path identifier
 * @param name Display name
 * @param steps Array of tour steps
 * @param options Configuration options
 * @returns A tour path
 */
export const createNamedTourPath = (
  id: string,
  name: string,
  steps: TourStep[],
  options?: {
    allowSkip?: boolean;
    showProgress?: boolean;
    route?: string;
    userRoles?: string[];
    displayCondition?: () => boolean;
  }
): TourPath => {
  return {
    id,
    name,
    steps,
    allowSkip: options?.allowSkip ?? true,
    showProgress: options?.showProgress ?? true,
    config: {
      allowSkip: options?.allowSkip,
      showProgress: options?.showProgress,
      metadata: {
        route: options?.route,
        userRoles: options?.userRoles || []
      }
    }
  };
};
