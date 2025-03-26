
import { TourPath, TourStep } from "@/contexts/tour/types";
import { createTourPathFromGroups } from "@/lib/tour/core/tourPathFactory";

/**
 * Utility to create a custom tour from selected step groups
 * 
 * @param id Unique identifier for the custom tour
 * @param name Display name for the custom tour
 * @param groupIds Array of step group IDs to include
 * @param options Additional configuration options
 * @returns A custom tour path composed from the selected groups
 */
export function createCustomTour(
  id: string,
  name: string,
  groupIds: string[],
  options?: {
    allowSkip?: boolean;
    showProgress?: boolean;
    userRoles?: string[];
    filterSteps?: (step: TourStep) => boolean;
    tags?: string[];
    experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'all';
  }
): TourPath {
  const { userRoles, tags, experienceLevel, ...otherOptions } = options || {};
  
  // Default filter that respects user roles
  const roleFilter = (step: TourStep) => {
    // If step has role restrictions and user roles are provided
    if (step.userRoles && userRoles) {
      // Check if any of the user's roles match the step's allowed roles
      return step.userRoles.some(role => userRoles.includes(role));
    }
    // If step has no role restrictions or no user roles provided, show the step
    return true;
  };
  
  // Tag-based filtering
  const tagFilter = (step: TourStep) => {
    if (!tags || tags.length === 0) return true;
    
    // Check if step has tags in its metadata
    const stepTags = step.metadata?.tags as string[] | undefined;
    if (!stepTags) return false;
    
    // Check if any of the required tags match
    return tags.some(tag => stepTags.includes(tag));
  };
  
  // Experience level filtering
  const experienceLevelFilter = (step: TourStep) => {
    if (experienceLevel === 'all' || !experienceLevel) return true;
    
    const stepLevel = step.metadata?.experienceLevel as string | undefined;
    if (!stepLevel) return true; // Show steps without level by default
    
    return stepLevel === experienceLevel;
  };
  
  // Combine all filters
  const combinedFilter = (step: TourStep) => {
    const passesRoleFilter = roleFilter(step);
    const passesTagFilter = tagFilter(step);
    const passesLevelFilter = experienceLevelFilter(step);
    const passesCustomFilter = options?.filterSteps ? options.filterSteps(step) : true;
    
    return passesRoleFilter && passesTagFilter && passesLevelFilter && passesCustomFilter;
  };
  
  return createTourPathFromGroups(
    id,
    name,
    groupIds,
    {
      ...otherOptions,
      filterSteps: combinedFilter,
      metadata: {
        isCustomTour: true,
        includedGroups: groupIds,
        tags: tags || [],
        experienceLevel: experienceLevel || 'all'
      }
    }
  );
}
