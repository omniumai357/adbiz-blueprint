
import { TourPath } from "@/contexts/tour/types";
import { createCustomTour } from './createCustomTour';
import { getStepGroupsByTag, getStepGroupsByExperienceLevel } from './groupFilters';

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
