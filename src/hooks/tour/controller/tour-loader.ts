
import { TourPath, TourStep } from '@/contexts/tour/types';

/**
 * Validates a tour path to ensure all required properties are present
 * @param path Tour path configuration to validate
 * @returns Boolean indicating if the path is valid
 */
const validateTourPath = (path: any): boolean => {
  if (!path || typeof path !== 'object') return false;
  if (!path.id || !path.name || !Array.isArray(path.steps)) return false;
  
  // Check if all steps have required properties
  return path.steps.every((step: any) => {
    return step.id && (step.elementId || step.target || step.targetId);
  });
};

/**
 * Normalizes a tour path to ensure all properties follow the expected format
 * @param path Tour path to normalize
 * @returns Normalized tour path object
 */
const normalizeTourPath = (path: any): TourPath => {
  // Ensure steps have the required target property
  const normalizedSteps = path.steps.map((step: any): TourStep => {
    const normalizedStep: any = { ...step };
    
    // Set target if not present (use elementId as fallback)
    if (!normalizedStep.target) {
      normalizedStep.target = normalizedStep.elementId || normalizedStep.targetId;
    }
    
    // Set position to bottom if not present
    if (!normalizedStep.position) {
      normalizedStep.position = "bottom";
    }
    
    return normalizedStep;
  });
  
  return {
    ...path,
    steps: normalizedSteps
  };
};

/**
 * Loads a tour path from various sources (local, remote, etc.)
 * @param pathId ID of the tour path to load
 * @param options Options for loading the tour
 * @returns Promise resolving to the loaded tour path
 */
export const loadTourPath = async (pathId: string, options: any = {}): Promise<TourPath | null> => {
  // For demonstration, creating a sample tour path
  if (pathId === 'demo-tour') {
    const demoPath: TourPath = {
      id: 'demo-tour',
      name: 'Demo Tour',
      steps: [
        {
          id: 'welcome',
          elementId: 'welcome-element',
          title: 'Welcome to the Tour',
          content: 'This is a demonstration of our guided tour feature.',
          position: 'bottom',
          target: 'welcome-element' // Add target property to satisfy type requirements
        }
      ]
    };
    
    if (validateTourPath(demoPath)) {
      return normalizeTourPath(demoPath);
    }
  }
  
  // In a real app, you would fetch the tour path from an API or local storage
  console.warn(`Tour path "${pathId}" not found`);
  return null;
};

/**
 * Registers a new tour path in the system
 * @param path Tour path to register
 * @returns Boolean indicating success
 */
export const registerTourPath = (path: any): boolean => {
  if (!validateTourPath(path)) {
    console.error('Invalid tour path provided');
    return false;
  }
  
  const normalizedPath = normalizeTourPath(path);
  
  // In a real app, you would store this path for later use
  console.log(`Registered tour path: ${normalizedPath.id}`);
  return true;
};

/**
 * Load tour paths for a given route
 * @param route Current route path
 * @returns Promise resolving to tour paths for the route
 */
export const loadTourPathsForRoute = async (route: string): Promise<TourPath[]> => {
  // For now, we'll simply try to load a path based on the route name
  const pathId = `${route.replace(/\//g, '-')}-tour`.replace(/^-/, '');
  const path = await loadTourPath(pathId);
  
  // Return an array of paths (for now just the one we found, or empty array)
  return path ? [path] : [];
};
