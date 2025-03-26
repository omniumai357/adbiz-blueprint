
import { useEffect } from 'react';
import { TourPath } from '@/contexts/tour-context';
import { loadTourPathsForRoute } from '../tour-loader';
import { getVisibleSteps } from '../step-processor';

/**
 * Hook to handle loading tour paths
 */
export function useTourPathLoading(
  currentPathname: string,
  currentPath: string | null,
  setTourPaths: (paths: TourPath[]) => void,
  setVisibleSteps: (steps: TourStep[]) => void,
  getCurrentPathData: () => TourPath | undefined
) {
  // Load tour paths based on current route
  useEffect(() => {
    const fetchTourPaths = async () => {
      const paths = await loadTourPathsForRoute(currentPathname);
      setTourPaths(paths);
    };

    fetchTourPaths();
  }, [currentPathname, setTourPaths]);

  // Process and filter steps when path changes
  useEffect(() => {
    const processDynamicSteps = async () => {
      const currentPathData = getCurrentPathData();
      if (currentPathData) {
        const filteredSteps = getVisibleSteps(currentPathData);
        setVisibleSteps(filteredSteps);
      }
    };
    
    processDynamicSteps();
  }, [currentPath, getCurrentPathData, setVisibleSteps]);

  return {};
}
