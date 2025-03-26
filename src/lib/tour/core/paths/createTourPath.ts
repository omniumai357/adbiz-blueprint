
import { TourPath, TourStep } from "@/contexts/tour/types";

/**
 * Helper function to create tour paths with conditional steps
 * 
 * @param id Unique identifier for the tour path
 * @param steps Array of tour steps
 * @param options Additional tour path configuration options
 * @returns A configured TourPath object
 */
export function createTourPath(
  id: string,
  steps: TourStep[],
  options?: {
    name?: string;
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
    name: options?.name || id,
    steps,
    allowSkip: options?.allowSkip,
    showProgress: options?.showProgress,
    autoStart: options?.autoStart,
    config: options 
      ? {
          allowSkip: options.allowSkip,
          showProgress: options.showProgress,
          autoStart: options.autoStart,
          completionCallback: options.completionCallback,
          metadata: options.metadata,
          userRoles: options.requiredUserRoles,
          accessibility: options.accessibility
        }
      : undefined
  };
}
