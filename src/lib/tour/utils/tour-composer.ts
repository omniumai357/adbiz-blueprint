
import { TourPath, TourStep } from "@/contexts/tour/types";
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
 * Groups step groups by experience level
 * 
 * @param level The experience level to filter by
 * @returns Array of group IDs matching the experience level
 */
export function getStepGroupsByExperienceLevel(level: 'beginner' | 'intermediate' | 'advanced'): string[] {
  const allGroups = getAllStepGroups();
  
  return Object.values(allGroups)
    .filter(group => {
      return group.metadata?.experienceLevel === level;
    })
    .map(group => group.id);
}

/**
 * Creates a tour that includes all available onboarding step groups
 * 
 * @param userRoles Optional array of user roles for filtering steps
 * @param options Additional customization options
 * @returns A complete onboarding tour
 */
export function createOnboardingTour(
  userRoles?: string[],
  options?: {
    experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'all';
    includeFeatures?: string[];
  }
): TourPath {
  // Get all groups with 'introduction' or 'welcome' in their ID
  const welcomeGroups = getStepGroupsByTag('welcome');
  const introGroups = getStepGroupsByTag('introduction');
  
  // Filter by experience level if specified
  let onboardingGroups = [...new Set([...welcomeGroups, ...introGroups])];
  
  if (options?.experienceLevel && options.experienceLevel !== 'all') {
    const levelGroups = getStepGroupsByExperienceLevel(options.experienceLevel);
    onboardingGroups = onboardingGroups.filter(groupId => levelGroups.includes(groupId));
  }
  
  // Add specific feature groups if requested
  if (options?.includeFeatures && options.includeFeatures.length > 0) {
    const featureGroups: string[] = [];
    options.includeFeatures.forEach(feature => {
      featureGroups.push(...getStepGroupsByTag(feature));
    });
    onboardingGroups = [...new Set([...onboardingGroups, ...featureGroups])];
  }
  
  return createCustomTour(
    'complete-onboarding',
    'Complete Platform Onboarding',
    onboardingGroups,
    {
      allowSkip: true,
      showProgress: true,
      userRoles,
      experienceLevel: options?.experienceLevel || 'all',
      tags: options?.includeFeatures
    }
  );
}

/**
 * Creates a feature-specific tour by combining relevant step groups
 * 
 * @param featureName The name of the feature to create a tour for
 * @param userRoles Optional array of user roles for filtering steps
 * @param options Additional customization options
 * @returns A feature-specific tour
 */
export function createFeatureTour(
  featureName: string, 
  userRoles?: string[],
  options?: {
    experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'all';
  }
): TourPath {
  // Get all groups related to this feature
  const featureGroups = getStepGroupsByTag(featureName);
  
  // Filter by experience level if specified
  let filteredGroups = [...featureGroups];
  
  if (options?.experienceLevel && options.experienceLevel !== 'all') {
    const levelGroups = getStepGroupsByExperienceLevel(options.experienceLevel);
    filteredGroups = filteredGroups.filter(groupId => levelGroups.includes(groupId));
  }
  
  return createCustomTour(
    `${featureName}-tour`,
    `${featureName.charAt(0).toUpperCase() + featureName.slice(1)} Tour`,
    filteredGroups,
    {
      allowSkip: true,
      showProgress: true,
      userRoles,
      experienceLevel: options?.experienceLevel || 'all',
      tags: [featureName]
    }
  );
}
