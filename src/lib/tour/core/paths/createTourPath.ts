
import { TourPath, TourStep } from "@/contexts/tour/types";

/**
 * Helper function to create tour paths with conditional steps
 * 
 * @param id Unique identifier for the tour path
 * @param name Display name for the tour path
 * @param steps Array of tour steps
 * @param options Additional tour path configuration options
 * @returns A configured TourPath object
 */
export function createTourPath(
  id: string,
  name: string,
  steps: TourStep[],
  options?: {
    allowSkip?: boolean;
    showProgress?: boolean;
    autoStart?: boolean;
    requiredUserRoles?: string[];
    completionCallback?: () => void;
    metadata?: Record<string, any>;
    accessibility?: {
      announceSteps?: boolean;
      keyboardNavigation?: boolean;
      restoreFocus?: boolean;
      focusTrap?: boolean;
    };
  }
): TourPath {
  return {
    id,
    name,
    steps,
    ...options
  };
}
