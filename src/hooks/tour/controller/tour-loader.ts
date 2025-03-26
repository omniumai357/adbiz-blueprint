
import { useEffect, useState } from 'react';
import { TourPath, TourStep } from '@/contexts/tour/types';

// Middleware function for transforming steps during loading
type StepTransformer = (step: TourStep) => TourStep;

/**
 * Loads tour data and paths based on the current pathname
 * 
 * @param pathname Current route path
 * @param stepTransformers Optional transformers to modify steps during loading
 * @returns Loaded tour paths
 */
export function loadTourPaths(
  pathname: string,
  stepTransformers: StepTransformer[] = []
): TourPath[] {
  const paths: TourPath[] = [];
  
  try {
    // Match pathname to possible tour paths
    if (pathname === '/') {
      // Load home tour paths
      // In a real implementation, this would load from a registry or config
      paths.push({
        id: 'home-tour',
        name: 'Home Tour',
        steps: sampleHomeSteps,
        allowSkip: true,
        showProgress: true
      });
    } else if (pathname.includes('/checkout')) {
      paths.push({
        id: 'checkout-tour',
        name: 'Checkout Tour',
        steps: sampleCheckoutSteps,
        allowSkip: true,
        showProgress: true
      });
    }
    
    // Apply transformers to each step
    if (stepTransformers.length > 0) {
      paths.forEach(path => {
        path.steps = path.steps.map(step => {
          let transformedStep = { ...step };
          stepTransformers.forEach(transformer => {
            transformedStep = transformer(transformedStep);
          });
          return transformedStep;
        });
      });
    }
  } catch (error) {
    console.error('Error loading tour paths:', error);
  }
  
  return paths;
}

// Fix the path property to include the 'enabled' property
const enhancePathPropertyWithEnabled = (step: TourStep): TourStep => {
  if (step.path && typeof step.path === 'object' && !('enabled' in step.path)) {
    return {
      ...step,
      path: {
        enabled: true, // Add the missing property
        ...step.path
      }
    };
  }
  return step;
};

// Sample steps for testing
const sampleHomeSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Our App',
    content: 'This tour will guide you through the main features.',
    target: '#header-welcome',
    position: 'bottom',
  },
  {
    id: 'features',
    title: 'Explore Features',
    content: 'Check out our amazing features.',
    target: '#features-section',
    position: 'right',
    path: { 
      enabled: true,
      targetElementId: '#features-section',
      style: 'dashed'
    }
  },
  {
    id: 'get-started',
    title: 'Get Started',
    content: 'Click here to get started with your first project.',
    target: '#get-started-button',
    position: 'top',
  }
];

const sampleCheckoutSteps: TourStep[] = [
  {
    id: 'checkout-welcome',
    title: 'Checkout Process',
    content: 'Let\'s walk through the checkout process.',
    target: '#checkout-header',
    position: 'bottom',
  },
  {
    id: 'payment-info',
    title: 'Payment Information',
    content: 'Enter your payment details securely.',
    target: '#payment-form',
    position: 'right',
    path: { 
      enabled: true,
      targetElementId: '#payment-form',
      style: 'solid'
    }
  },
  {
    id: 'complete-order',
    title: 'Complete Your Order',
    content: 'Review and submit your order.',
    target: '#submit-order-button',
    position: 'top',
  }
];

/**
 * Custom hook for loading tour paths based on the current route
 */
export function useTourPathsLoader(
  pathname: string,
  stepTransformers: StepTransformer[] = []
): TourPath[] {
  const [paths, setPaths] = useState<TourPath[]>([]);
  
  useEffect(() => {
    // Add the enhance function to ensure all path objects have 'enabled' property
    const allTransformers = [...stepTransformers, enhancePathPropertyWithEnabled];
    
    const loadedPaths = loadTourPaths(pathname, allTransformers);
    setPaths(loadedPaths);
  }, [pathname]);
  
  return paths;
}
