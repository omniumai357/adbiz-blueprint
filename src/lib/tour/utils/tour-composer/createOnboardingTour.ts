
import { TourPath } from "@/contexts/tour/types";
import { createCustomTour } from './createCustomTour';

/**
 * Creates an onboarding tour from specified step groups
 * 
 * @param appName Name of the application for tour title
 * @param stepGroups Array of step group IDs to include
 * @param userRoles Optional array of user roles for filtering steps
 * @param options Additional customization options
 * @returns An onboarding tour path
 */
export function createOnboardingTour(
  appName: string,
  stepGroups: string[],
  userRoles?: string[],
  options?: {
    autoStart?: boolean;
    showWelcomeDialog?: boolean;
    showProgressBar?: boolean;
    allowSkip?: boolean;
    experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  }
): TourPath {
  const tourPath = createCustomTour(
    `${appName.toLowerCase().replace(/\s+/g, '-')}-onboarding-tour`,
    `${appName} Onboarding Tour`,
    stepGroups,
    {
      allowSkip: options?.allowSkip !== false,
      showProgress: options?.showProgressBar !== false,
      tags: ['onboarding', appName.toLowerCase()],
      experienceLevel: options?.experienceLevel || 'beginner'
    }
  );
  
  // Apply user roles manually since they're not in the config options
  if (userRoles && userRoles.length > 0) {
    // @ts-ignore - we handle this property
    tourPath.userRoles = userRoles;
  }
  
  // Apply additional configuration
  if (options?.autoStart) {
    tourPath.autoStart = true;
  }
  
  return tourPath;
}
