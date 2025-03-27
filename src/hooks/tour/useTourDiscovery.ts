
import { useState, useEffect, useCallback } from 'react';
import { useTour } from '@/contexts/tour';
import { useLocation } from 'react-router-dom';

/**
 * Typed interface for tour history storage
 */
interface TourHistory {
  completedTours: string[];
  lastSeenDate?: string;
  dismissedTours?: string[];
  viewCounts?: Record<string, number>;
}

/**
 * Hook for managing tour discovery, history, and auto-start functionality
 */
export function useTourDiscovery() {
  const [tourHistory, setTourHistory] = useState<TourHistory>({
    completedTours: [],
    dismissedTours: [],
    viewCounts: {}
  });
  
  const [hasStartedTour, setHasStartedTour] = useState<boolean>(false);
  const { isActive, currentPath, availablePaths, startTour, endTour } = useTour();
  const location = useLocation();

  // Load tour history on mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('tourHistory');
      if (storedHistory) {
        setTourHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Error loading tour history:', error);
      // Reset to defaults if there's an error
      setTourHistory({
        completedTours: [],
        dismissedTours: [],
        viewCounts: {}
      });
    }
  }, []);

  // Save tour history whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('tourHistory', JSON.stringify(tourHistory));
    } catch (error) {
      console.error('Error saving tour history:', error);
    }
  }, [tourHistory]);

  // Track when user starts a tour
  useEffect(() => {
    if (isActive && currentPath) {
      setHasStartedTour(true);
      
      // Update view count for this tour
      setTourHistory(prev => {
        const viewCounts = { ...(prev.viewCounts || {}) };
        viewCounts[currentPath] = (viewCounts[currentPath] || 0) + 1;
        
        return {
          ...prev,
          lastSeenDate: new Date().toISOString(),
          viewCounts
        };
      });
    }
  }, [isActive, currentPath]);

  // Find the appropriate tour for the current page
  const findAppropriatePathForCurrentPage = useCallback(() => {
    if (!availablePaths || availablePaths.length === 0) {
      return null;
    }
    
    // First, try to find a tour path that matches the current route exactly
    const exactMatch = availablePaths.find(path => {
      const pathRoute = path.route || path.config?.metadata?.route;
      return pathRoute === location.pathname;
    });
    
    if (exactMatch) {
      return exactMatch.id;
    }
    
    // If no exact match, try to find a path based on route patterns
    const pathsByPattern = {
      home: availablePaths.find(p => p.id.includes("home")),
      checkout: availablePaths.find(p => p.id.includes("checkout")),
      services: availablePaths.find(p => p.id.includes("services")),
      contact: availablePaths.find(p => p.id.includes("contact")),
    };
    
    if (location.pathname === "/" || location.pathname.includes("home")) {
      return pathsByPattern.home?.id;
    } else if (location.pathname.includes("checkout")) {
      return pathsByPattern.checkout?.id;
    } else if (location.pathname.includes("services")) {
      return pathsByPattern.services?.id;
    } else if (location.pathname.includes("contact")) {
      return pathsByPattern.contact?.id;
    }
    
    // If no specific tour found, use the first available one
    return availablePaths[0]?.id;
  }, [availablePaths, location.pathname]);

  // Start the appropriate tour for the current page
  const startAppropriatePageTour = useCallback(() => {
    const tourId = findAppropriatePathForCurrentPage();
    if (tourId) {
      startTour(tourId);
    }
  }, [findAppropriatePathForCurrentPage, startTour]);

  // Mark a tour as completed
  const markTourCompleted = useCallback((tourId: string) => {
    setTourHistory(prev => {
      if (prev.completedTours.includes(tourId)) {
        return prev;
      }
      
      return {
        ...prev,
        completedTours: [...prev.completedTours, tourId]
      };
    });
  }, []);

  // Dismiss a tour (user explicitly chooses not to see it)
  const dismissTour = useCallback((tourId: string) => {
    setTourHistory(prev => {
      if (prev.dismissedTours?.includes(tourId)) {
        return prev;
      }
      
      return {
        ...prev,
        dismissedTours: [...(prev.dismissedTours || []), tourId]
      };
    });
  }, []);

  // Check if the current page tour has been completed
  const hasCompletedCurrentPageTour = useCallback(() => {
    const tourId = findAppropriatePathForCurrentPage();
    return tourId ? tourHistory.completedTours.includes(tourId) : false;
  }, [findAppropriatePathForCurrentPage, tourHistory.completedTours]);

  // Check if the current page tour has been dismissed
  const hasBeenDismissed = useCallback((tourId?: string) => {
    const id = tourId || findAppropriatePathForCurrentPage();
    return id ? tourHistory.dismissedTours?.includes(id) || false : false;
  }, [findAppropriatePathForCurrentPage, tourHistory.dismissedTours]);

  return {
    hasSeenAnyTour: tourHistory.completedTours.length > 0,
    hasStartedTour,
    completedTours: tourHistory.completedTours,
    dismissedTours: tourHistory.dismissedTours || [],
    viewCounts: tourHistory.viewCounts || {},
    lastSeenDate: tourHistory.lastSeenDate,
    hasCompletedCurrentPageTour,
    hasBeenDismissed,
    startAppropriatePageTour,
    markTourCompleted,
    dismissTour,
    findAppropriatePathForCurrentPage
  };
}
