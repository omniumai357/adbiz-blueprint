
import { TourPath, TourStep } from "@/contexts/tour/types";
import { getAllStepGroups } from '../../core/tourStepGroups';

/**
 * Creates a custom tour from step groups
 * 
 * @param id Unique ID for the tour
 * @param name Display name for the tour
 * @param stepGroupIds Array of step group IDs to include
 * @param config Tour configuration options
 * @returns A custom tour path
 */
export function createCustomTour(
  id: string, 
  name: string,
  stepGroupIds: string[],
  config?: {
    allowSkip?: boolean;
    showProgress?: boolean;
    filterSteps?: (step: TourStep) => boolean;
    tags?: string[];
    experienceLevel?: "beginner" | "intermediate" | "advanced" | "all";
  }
): TourPath {
  // Get all step groups
  const allGroups = getAllStepGroups();
  
  // Filter steps based on groups and optionally filter function
  let steps: TourStep[] = [];
  stepGroupIds.forEach(groupId => {
    const group = allGroups[groupId];
    if (group && group.steps) {
      let groupSteps = [...group.steps];
      
      // Apply additional filtering if provided
      if (config?.filterSteps) {
        groupSteps = groupSteps.filter(config.filterSteps);
      }
      
      steps = [...steps, ...groupSteps];
    }
  });
  
  // Create the tour path
  return {
    id,
    name,
    steps,
    allowSkip: config?.allowSkip,
    showProgress: config?.showProgress,
    config: {
      allowSkip: config?.allowSkip,
      showProgress: config?.showProgress,
      metadata: {
        tags: config?.tags || [],
        experienceLevel: config?.experienceLevel || 'all'
      }
    }
  };
}
