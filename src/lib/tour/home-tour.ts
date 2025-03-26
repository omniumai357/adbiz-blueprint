
import { 
  createTourPathFromGroups,
} from './index';

// Import step groups
import {
  introductionStepGroup,
  featureHighlightsStepGroup,
  advancedFeaturesStepGroup,
  adminFeaturesStepGroup
} from './home/step-groups';

// Create the home tour by composing step groups
export const homeTourPath = createTourPathFromGroups(
  "home-tour",
  "Home Page Tour",
  [
    'home-introduction',   // Basic intro for all users
    'home-features',       // Feature highlights for all users
    'home-advanced',       // Advanced features for registered users
    'home-admin'           // Admin features only for admins
  ],
  {
    allowSkip: true,
    showProgress: true,
    // Filter out steps that don't have elements on the page
    filterSteps: (step) => {
      return !!document.getElementById(step.elementId);
    },
    metadata: {
      category: 'onboarding',
      importance: 'high'
    }
  }
);
