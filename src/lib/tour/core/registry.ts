
import { TourStep, TourPath } from '@/contexts/tour/types';

// Registry for tour paths and step groups
const pathRegistry: Record<string, TourPath> = {};
const stepGroupRegistry: Record<string, { id: string, name: string, steps: TourStep[], description?: string }> = {};

// Register a tour path
export function registerTourPath(path: TourPath): void {
  pathRegistry[path.id] = path;
}

// Register multiple tour paths
export function registerTourPaths(paths: TourPath[]): void {
  paths.forEach(path => registerTourPath(path));
}

// Register a step group
export function registerStepGroup(
  id: string,
  name: string,
  steps: TourStep[],
  description?: string
): void {
  stepGroupRegistry[id] = { id, name, steps, description };
}

// Get a tour path by ID
export function getTourPath(id: string): TourPath | undefined {
  return pathRegistry[id];
}

// Get all tour paths
export function getAllTourPaths(): TourPath[] {
  return Object.values(pathRegistry);
}

// Get a step group by ID
export function getStepGroup(id: string): { id: string, name: string, steps: TourStep[], description?: string } | undefined {
  return stepGroupRegistry[id];
}

// Get all step groups
export function getAllStepGroups(): Record<string, { id: string, name: string, steps: TourStep[], description?: string }> {
  return { ...stepGroupRegistry };
}

// Get tour paths by route
export function getTourPathsByRoute(route: string): TourPath[] {
  return Object.values(pathRegistry).filter(path => {
    // Consider both the direct route property and the config.metadata.route
    const pathRoute = path.route || path.config?.metadata?.route;
    
    // Simple path matching logic - can be enhanced as needed
    if (pathRoute === route) return true;
    if (pathRoute === '*') return true;
    
    // Check for path patterns
    if (pathRoute && pathRoute.includes('*')) {
      const pattern = pathRoute.replace('*', '.*');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(route);
    }
    
    return false;
  });
}

// Clear registry (useful for testing)
export function clearRegistry(): void {
  Object.keys(pathRegistry).forEach(key => delete pathRegistry[key]);
  Object.keys(stepGroupRegistry).forEach(key => delete stepGroupRegistry[key]);
}
