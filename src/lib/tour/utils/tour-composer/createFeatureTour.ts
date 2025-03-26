
import { TourPath } from "@/contexts/tour/types";
import { createCustomTour } from './createCustomTour';
import { getStepGroupsByTag, getStepGroupsByExperienceLevel } from './groupFilters';

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
