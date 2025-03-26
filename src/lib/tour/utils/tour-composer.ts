
import { TourPath, TourStep } from "@/contexts/tour-context";
import { 
  createTourPathFromGroups, 
  getStepGroup,
  getAllStepGroups
} from "@/lib/tour/index";

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
  }
): TourPath {
  const { userRoles, ...otherOptions } = options || {};
  
  // Default filter that respects user roles
  const defaultFilter = (step: TourStep) => {
    // If step has role restrictions and user roles are provided
    if (step.userRoles && userRoles) {
      // Check if any of the user's roles match the step's allowed roles
      return step.userRoles.some(role => userRoles.includes(role));
    }
    // If step has no role restrictions or no user roles provided, show the step
    return true;
  };
  
  // Combine the default filter with any custom filter
  const combinedFilter = options?.filterSteps
    ? (step: TourStep) => defaultFilter(step) && options.filterSteps!(step)
    : defaultFilter;
  
  return createTourPathFromGroups(
    id,
    name,
    groupIds,
    {
      ...otherOptions,
      filterSteps: combinedFilter,
      metadata: {
        isCustomTour: true,
        includedGroups: groupIds
      }
    }
  );
}

/**
 * Filters step groups by their category or tag
 * 
 * @param tag The tag or category to filter by
 * @returns Array of group IDs matching the tag
 */
export function getStepGroupsByTag(tag: string): string[] {
  const allGroups = getAllStepGroups();
  
  return Object.values(allGroups)
    .filter(group => {
      // Match tag either in the group ID or in its metadata
      return group.id.includes(tag) || 
             (group.metadata && group.metadata.tags && 
              (group.metadata.tags as string[]).includes(tag));
    })
    .map(group => group.id);
}

/**
 * Creates a tour that includes all available onboarding step groups
 * 
 * @returns A complete onboarding tour
 */
export function createOnboardingTour(userRoles?: string[]): TourPath {
  // Get all groups with 'introduction' or 'welcome' in their ID
  const welcomeGroups = getStepGroupsByTag('welcome');
  const introGroups = getStepGroupsByTag('introduction');
  
  // Combine and deduplicate
  const onboardingGroups = [...new Set([...welcomeGroups, ...introGroups])];
  
  return createCustomTour(
    'complete-onboarding',
    'Complete Platform Onboarding',
    onboardingGroups,
    {
      allowSkip: true,
      showProgress: true,
      userRoles
    }
  );
}

/**
 * Creates a feature-specific tour by combining relevant step groups
 * 
 * @param featureName The name of the feature to create a tour for
 * @param userRoles Optional array of user roles for filtering steps
 * @returns A feature-specific tour
 */
export function createFeatureTour(featureName: string, userRoles?: string[]): TourPath {
  // Get all groups related to this feature
  const featureGroups = getStepGroupsByTag(featureName);
  
  return createCustomTour(
    `${featureName}-tour`,
    `${featureName.charAt(0).toUpperCase() + featureName.slice(1)} Tour`,
    featureGroups,
    {
      allowSkip: true,
      showProgress: true,
      userRoles
    }
  );
}
