
import { TourPath } from '@/contexts/tour/types';
import { homeWelcomeStepGroup, homeFeaturesStepGroup } from './step-groups';

/**
 * Main tour path for the home page
 */
export const homeTourPath: TourPath = {
  id: 'home-tour',
  name: 'Home Page Tour',
  steps: [
    ...homeWelcomeStepGroup.steps,
    ...homeFeaturesStepGroup.steps
  ],
  allowSkip: true,
  showProgress: true,
  route: '/'
};

/**
 * Onboarding tour path for new users on the home page
 */
export const homeOnboardingTourPath: TourPath = {
  id: 'home-onboarding',
  name: 'New User Onboarding',
  steps: [
    ...homeWelcomeStepGroup.steps.slice(0, 1), // Just the welcome step
    // Add more onboarding-specific steps here
  ],
  allowSkip: false,
  showProgress: true,
  route: '/'
};
