
import { TourStep, TourPath } from '@/contexts/tour/types';
import { getTourPathsByRoute } from '@/lib/tour/core/registry';

/**
 * Load tour paths based on the current route
 * 
 * @param route Current route path
 * @returns Array of tour paths applicable for the route
 */
export async function loadTourPathsForRoute(route: string): Promise<TourPath[]> {
  try {
    // First check if paths are registered in the registry
    const registeredPaths = getTourPathsByRoute(route);
    if (registeredPaths.length > 0) {
      return registeredPaths;
    }

    // Dynamically load tour paths based on route
    let paths: TourPath[] = [];

    // Home page tours
    if (route === '/' || route === '/home') {
      try {
        const homeModule = await import('@/lib/tour/home/tour-path');
        if (homeModule.homeWelcomeTourPath) {
          paths.push(homeModule.homeWelcomeTourPath);
        }
        if (homeModule.homeFeaturesPath) {
          paths.push(homeModule.homeFeaturesPath);
        }
      } catch (err) {
        console.warn('Failed to load home tour paths', err);
      }
    }

    // Checkout page tours
    if (route.includes('/checkout')) {
      try {
        const checkoutModule = await import('@/lib/tour/checkout/tour-path');
        if (checkoutModule.checkoutTourPath) {
          paths.push(checkoutModule.checkoutTourPath);
        }
      } catch (err) {
        console.warn('Failed to load checkout tour paths', err);
      }
    }

    // Services page tours
    if (route.includes('/services')) {
      try {
        const servicesModule = await import('@/lib/tour/services/tour-path');
        if (servicesModule.servicesTourPath) {
          paths.push(servicesModule.servicesTourPath);
        }
      } catch (err) {
        console.warn('Failed to load services tour paths', err);
      }
    }

    // Enhance paths with common properties
    paths = paths.map(path => ({
      ...path,
      steps: path.steps.map(step => enhanceStep(step))
    }));

    return paths;
  } catch (error) {
    console.error('Error loading tour paths', error);
    return [];
  }
}

/**
 * Enhance a step with default properties if needed
 */
function enhanceStep(step: TourStep): TourStep {
  // Ensure path property has the correct structure if it's a string
  if (typeof step.path === 'string') {
    step.path = {
      enabled: true,
      targetElementId: step.path,
      style: 'solid'
    };
  }
  
  return step;
}
