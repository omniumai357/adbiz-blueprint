
import { TourPath, TourStep } from "@/contexts/tour/types";
import { composeStepGroups } from "../tourStepGroups";
import { createTourPath } from "./createTourPath";

/**
 * Creates a tour path by composing steps from predefined step groups
 * 
 * @param id Unique identifier for the tour path
 * @param name Display name for the tour path
 * @param groupIds Array of step group IDs to include
 * @param options Additional tour path configuration options
 * @returns A configured TourPath object with steps from the specified groups
 */
export function createTourPathFromGroups(
  id: string,
  name: string,
  groupIds: string[],
  options?: {
    allowSkip?: boolean;
    showProgress?: boolean;
    autoStart?: boolean;
    requiredUserRoles?: string[];
    completionCallback?: () => void;
    metadata?: Record<string, any>;
    filterSteps?: (step: TourStep) => boolean;
    transformStep?: (step: TourStep) => TourStep;
  }
): TourPath {
  const { filterSteps, transformStep, ...pathOptions } = options || {};
  
  // Compose steps from the specified groups
  const composedSteps = composeStepGroups(groupIds, { filterSteps, transformStep });
  
  // Create the tour path with the composed steps
  return createTourPath(id, composedSteps, pathOptions);
}
