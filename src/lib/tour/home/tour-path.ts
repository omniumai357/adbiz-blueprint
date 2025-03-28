
import { TourPath } from '@/contexts/tour/types';
import { createStep } from '@/lib/tour/core/tourPathFactory';

/**
 * Home welcome tour path
 */
export const homeWelcomeTourPath: TourPath = {
  id: 'home-welcome-tour',
  name: 'Welcome to Our Homepage',
  steps: [
    // Welcome step
    createStep(
      'home-welcome',
      'hero-section',
      'Welcome to Our Site',
      'This tour will guide you through the main features of our homepage.',
      'bottom'
    ),
    // Features step
    createStep(
      'home-features',
      'features-section',
      'Our Features',
      'Explore the key features that make our product unique.',
      'right' 
    )
  ],
  allowSkip: true,
  showProgress: true,
  route: '/',
  metadata: {
    route: '/'
  }
};

/**
 * Home features tour path
 */
export const homeFeaturesPath: TourPath = {
  id: 'home-features-tour',
  name: 'Homepage Features Tour',
  steps: [
    // Features overview step
    createStep(
      'features-overview',
      'features-section',
      'Feature Overview',
      'Discover all the powerful features we offer.',
      'bottom'
    ),
    // Get started step
    createStep(
      'get-started',
      'cta-section',
      'Get Started',
      'Ready to begin? Click here to start your journey.',
      'top'
    )
  ],
  allowSkip: true,
  showProgress: true,
  route: '/',
  metadata: {
    route: '/'
  }
};
