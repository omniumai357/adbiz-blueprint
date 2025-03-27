import { TourPath } from '@/contexts/tour/types';

// Keep track of loaded tour paths for caching
const cachedPaths: Record<string, TourPath[]> = {};

/**
 * Load tour paths based on the current route
 * 
 * @param route Current route path
 * @returns Array of tour paths applicable for the route
 */
export async function loadTourPathsForRoute(route: string): Promise<TourPath[]> {
  try {
    // First check cache to avoid unnecessary dynamic imports
    if (cachedPaths[route]) {
      return cachedPaths[route];
    }
    
    // Normalize the route for matching
    const normalizedRoute = route.endsWith('/') ? route : `${route}/`;
    const paths: TourPath[] = [];

    // Map routes to their respective tour path modules
    const routeToModuleMap: Record<string, string> = {
      '/': '@/lib/tour/home/tour-path',
      '/home': '@/lib/tour/home/tour-path',
      '/checkout': '@/lib/tour/checkout/tour-path',
      '/services': '@/lib/tour/services/tour-path',
      '/contact': '@/lib/tour/contact-tour',
      // Add more routes as needed
    };

    // Find the appropriate module to load
    const moduleToLoad = Object.keys(routeToModuleMap).find(r => 
      normalizedRoute.startsWith(r === '/' ? r : `${r}/`)
    );

    if (moduleToLoad) {
      try {
        const module = await import(routeToModuleMap[moduleToLoad]);
        
        // Extract tour paths from the module
        Object.keys(module).forEach(key => {
          if (key.includes('TourPath') || key.includes('tourPath')) {
            if (module[key] && typeof module[key] === 'object') {
              paths.push(module[key]);
            }
          }
        });
      } catch (err) {
        console.warn(`Failed to load tour paths for route: ${route}`, err);
      }
    }

    // Fallback to a generic tour path for routes without specific tours
    if (paths.length === 0) {
      try {
        const defaultModule = await import('@/lib/tour/default-tour');
        if (defaultModule.defaultTourPath) {
          paths.push(defaultModule.defaultTourPath);
        }
      } catch (err) {
        console.warn('Failed to load default tour path', err);
      }
    }

    // Cache the loaded paths
    cachedPaths[route] = paths;
    return paths;
  } catch (error) {
    console.error('Error loading tour paths', error);
    return [];
  }
}

/**
 * Preload tour paths for a set of routes
 * 
 * @param routes Array of routes to preload tour paths for
 */
export async function preloadTourPaths(routes: string[]): Promise<void> {
  try {
    await Promise.all(routes.map(route => loadTourPathsForRoute(route)));
  } catch (error) {
    console.error('Error preloading tour paths', error);
  }
}

/**
 * Clear the tour path cache
 * 
 * @param route Optional route to clear, if not provided all routes will be cleared
 */
export function clearTourPathCache(route?: string): void {
  if (route) {
    delete cachedPaths[route];
  } else {
    Object.keys(cachedPaths).forEach(key => delete cachedPaths[key]);
  }
}
