
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useTour } from '@/contexts/tour';
import { TourPath } from '@/contexts/tour/types';

interface TourDiscoveryState {
  hasSeenAnyTour: boolean;
  hasStartedTour: boolean;
  completedTours: string[];
  dismissedTours: string[];
  viewCounts: Record<string, number>;
  lastSeenDate: string;
}

/**
 * Hook for discovering and managing tour paths for the current page
 */
export const useTourDiscovery = () => {
  const location = useLocation();
  const { startTour, currentPathData, tourPaths } = useTour();
  const [state, setState] = useState<TourDiscoveryState>({
    hasSeenAnyTour: false,
    hasStartedTour: false,
    completedTours: [],
    dismissedTours: [],
    viewCounts: {},
    lastSeenDate: ''
  });

  // Load tour state from localStorage on initial render
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('tour-discovery-state');
      if (savedState) {
        setState(JSON.parse(savedState));
      } else {
        // Initialize from individual storage items for backward compatibility
        const completedTours = JSON.parse(localStorage.getItem('completedTours') || '[]');
        const dismissedTours = JSON.parse(localStorage.getItem('dismissedTours') || '[]');
        const viewCounts = JSON.parse(localStorage.getItem('tourViewCounts') || '{}');
        const hasSeenAnyTour = localStorage.getItem('hasSeenAnyTour') === 'true';
        
        setState({
          hasSeenAnyTour,
          hasStartedTour: false,
          completedTours,
          dismissedTours,
          viewCounts,
          lastSeenDate: localStorage.getItem('lastTourDate') || ''
        });
      }
    } catch (e) {
      console.error('Error loading tour discovery state:', e);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('tour-discovery-state', JSON.stringify(state));
    } catch (e) {
      console.error('Error saving tour discovery state:', e);
    }
  }, [state]);

  // Check if the current page tour has been completed
  const hasCompletedCurrentPageTour = useCallback(() => {
    const currentPath = location.pathname;
    const pagePathId = `${currentPath.replace(/\//g, '-')}-tour`.replace(/^-/, '');
    return state.completedTours.includes(pagePathId);
  }, [location.pathname, state.completedTours]);

  // Find the appropriate tour path for the current page
  const findAppropriatePathForCurrentPage = useCallback(() => {
    const currentPath = location.pathname;
    
    // First look for exact route match
    for (const path of tourPaths) {
      if (path.route === currentPath || path.config?.metadata?.route === currentPath) {
        return path.id;
      }
    }
    
    // Then try pattern matching
    for (const path of tourPaths) {
      const pathPattern = path.routePattern || path.config?.metadata?.routePattern;
      if (pathPattern && new RegExp(pathPattern).test(currentPath)) {
        return path.id;
      }
    }
    
    // Default to page-specific tour ID
    return `${currentPath.replace(/\//g, '-')}-tour`.replace(/^-/, '');
  }, [location.pathname, tourPaths]);

  // Start the appropriate tour for the current page
  const startAppropriatePageTour = useCallback(() => {
    const pathId = findAppropriatePathForCurrentPage();
    if (pathId) {
      startTour(pathId);
      
      // Update state to reflect that user has seen a tour
      setState(prev => ({
        ...prev,
        hasSeenAnyTour: true,
        hasStartedTour: true,
        viewCounts: {
          ...prev.viewCounts,
          [pathId]: (prev.viewCounts[pathId] || 0) + 1
        },
        lastSeenDate: new Date().toISOString()
      }));
    }
  }, [findAppropriatePathForCurrentPage, startTour]);

  return {
    hasSeenAnyTour: state.hasSeenAnyTour,
    hasStartedTour: state.hasStartedTour,
    completedTours: state.completedTours,
    dismissedTours: state.dismissedTours,
    viewCounts: state.viewCounts,
    lastSeenDate: state.lastSeenDate,
    hasCompletedCurrentPageTour,
    startAppropriatePageTour,
    findAppropriatePathForCurrentPage
  };
};
