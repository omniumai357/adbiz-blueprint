
import { useEffect } from 'react';
import { TourPath, TourStep } from '@/contexts/tour/types';
import { getTourPathSteps } from '@/hooks/tour/controller/tour-path-utils';

/**
 * Utility function to convert a TourPath to a TourStep array
 */
export const tourPathToStepsArray = (path: TourPath): TourStep[] => {
  if (!path || !Array.isArray(path.steps)) {
    return [];
  }
  return path.steps;
};

/**
 * Hook to handle loading tour paths based on current route
 */
export function useTourPathLoading(
  currentPathname: string,
  currentPath: string | null,
  setTourPaths: React.Dispatch<React.SetStateAction<TourPath[]>>,
  setVisibleSteps: React.Dispatch<React.SetStateAction<TourStep[]>>,
  getCurrentPathData: () => TourPath | undefined
) {
  // Load tour paths when the pathname changes
  useEffect(() => {
    // Here you would typically load tour paths based on the pathname
    // For the purpose of this example, we're just logging
    console.log(`Loading tour paths for ${currentPathname}`);
    
    // If a current path is already set, update visible steps
    if (currentPath) {
      const currentPathData = getCurrentPathData();
      
      if (currentPathData) {
        const steps = tourPathToStepsArray(currentPathData);
        setVisibleSteps(steps);
      }
    }
  }, [currentPathname, currentPath, getCurrentPathData, setVisibleSteps]);
}
