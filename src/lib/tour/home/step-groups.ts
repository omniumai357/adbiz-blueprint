
import { createStepGroup } from '../core/tourStepGroups';
import { createStep } from '../core/tourPathFactory';
import {
  animatedStep,
  mediaEnhancedStep,
  optionalStep,
  visuallyEnhancedStep,
  transitionStep,
  spotlightStep,
  positionStep
} from '../enhancers/visualEnhancers';

/**
 * Welcome step group for the home page
 */
export const homeWelcomeStepGroup = createStepGroup(
  'home-welcome',
  'Home Welcome',
  [
    createStep(
      'welcome',
      'hero-section',
      'Welcome to Our Site',
      'This tour will guide you through the main features of our homepage.',
      'bottom'
    ),
    createStep(
      'get-started',
      'cta-section',
      'Get Started',
      'Ready to begin? Click here to start your journey.',
      'top'
    )
  ],
  'Introduction to the homepage'
);

/**
 * Features step group for the home page
 */
export const homeFeaturesStepGroup = createStepGroup(
  'home-features',
  'Home Features',
  [
    createStep(
      'features',
      'features-section',
      'Our Features',
      'Explore the key features that make our product unique.',
      'bottom'
    ),
    createStep(
      'testimonials',
      'testimonials-section',
      'Customer Testimonials',
      'Read what our customers have to say about us.',
      'top'
    )
  ],
  'Key features and testimonials on the homepage'
);
