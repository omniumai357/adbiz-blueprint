
import { TourPath, TourStep } from '@/contexts/tour/types';

/**
 * Mock database of tour paths
 * In a real application, these would likely be loaded from a server
 */
const tourPathsDatabase: Record<string, TourPath> = {
  'demo-tour': {
    id: 'demo-tour',
    name: 'Demo Tour',
    description: 'A demonstration tour of the application',
    route: '/',
    steps: [
      {
        id: 'step-1',
        target: 'header',
        title: 'Welcome to the App',
        content: 'This tour will guide you through the main features.',
        position: 'bottom'
      },
      {
        id: 'step-2',
        target: 'services-section',
        title: 'Our Services',
        content: 'Browse through our available services.',
        position: 'bottom'
      },
      {
        id: 'step-3',
        target: 'footer',
        title: 'Need Help?',
        content: 'Find contact information in the footer.',
        position: 'top'
      }
    ]
  },
  'home-tour': {
    id: 'home-tour',
    name: 'Home Page Tour',
    description: 'Tour of the home page features',
    route: '/',
    steps: [
      {
        id: 'home-1',
        target: 'hero-banner',
        title: 'Welcome',
        content: 'This is the main landing area of our site.',
        position: 'bottom'
      },
      {
        id: 'home-2',
        target: 'cta-section',
        title: 'Get Started',
        content: 'Click here to begin using our services.',
        position: 'top'
      }
    ]
  }
};

/**
 * Load a specific tour path by ID
 */
export const loadTourPath = async (pathId: string): Promise<TourPath | null> => {
  // Simulate API request
  return new Promise((resolve) => {
    setTimeout(() => {
      const path = tourPathsDatabase[pathId];
      resolve(path || null);
    }, 300);
  });
};

/**
 * Load tour paths for a given route
 */
export const loadTourPathsForRoute = async (route: string): Promise<TourPath[]> => {
  // Simulate API request
  return new Promise((resolve) => {
    setTimeout(() => {
      // Find all paths that are associated with this route
      const paths = Object.values(tourPathsDatabase).filter(
        (path) => path.route === route
      );
      resolve(paths);
    }, 300);
  });
};
