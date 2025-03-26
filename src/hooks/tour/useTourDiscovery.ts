
import { useState, useEffect } from 'react';
import { useTour } from '@/contexts/tour-context';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook for managing tour discovery features
 */
export function useTourDiscovery() {
  const [hasSeenTour, setHasSeenTour] = useState<boolean>(false);
  const [hasStartedTour, setHasStartedTour] = useState<boolean>(false);
  const [completedTours, setCompletedTours] = useState<string[]>([]);
  const { isActive, currentPath, startTour, endTour } = useTour();
  const location = useLocation();

  // Load user tour history on mount
  useEffect(() => {
    const storedHasSeenTour = localStorage.getItem('hasSeenTour') === 'true';
    const storedCompletedTours = JSON.parse(localStorage.getItem('completedTours') || '[]');
    
    setHasSeenTour(storedHasSeenTour);
    setCompletedTours(storedCompletedTours);
  }, []);

  // Track when user starts a tour
  useEffect(() => {
    if (isActive && currentPath) {
      setHasSeenTour(true);
      setHasStartedTour(true);
      localStorage.setItem('hasSeenTour', 'true');
    }
  }, [isActive, currentPath]);

  // Find the appropriate tour for the current page
  const findAppropriatePathForCurrentPage = () => {
    const { availablePaths } = useTour();
    let tourId = null;
    
    if (location.pathname === "/") {
      tourId = availablePaths.find(p => p.id.includes("home"))?.id;
    } else if (location.pathname.includes("checkout")) {
      tourId = availablePaths.find(p => p.id.includes("checkout"))?.id;
    } else if (location.pathname.includes("services")) {
      tourId = availablePaths.find(p => p.id.includes("services"))?.id;
    } else if (location.pathname.includes("contact")) {
      tourId = availablePaths.find(p => p.id.includes("contact"))?.id;
    }
    
    // If no specific tour found, use the first available one
    if (!tourId && availablePaths.length > 0) {
      tourId = availablePaths[0].id;
    }
    
    return tourId;
  };

  // Start the appropriate tour for the current page
  const startAppropriatePageTour = () => {
    const tourId = findAppropriatePathForCurrentPage();
    if (tourId) {
      startTour(tourId);
    }
  };

  // Mark a tour as completed
  const markTourCompleted = (tourId: string) => {
    if (!completedTours.includes(tourId)) {
      const updatedCompletedTours = [...completedTours, tourId];
      setCompletedTours(updatedCompletedTours);
      localStorage.setItem('completedTours', JSON.stringify(updatedCompletedTours));
    }
  };

  // Check if the current page tour has been completed
  const hasCompletedCurrentPageTour = () => {
    const tourId = findAppropriatePathForCurrentPage();
    return tourId ? completedTours.includes(tourId) : false;
  };

  return {
    hasSeenTour,
    hasStartedTour,
    completedTours,
    hasCompletedCurrentPageTour,
    startAppropriatePageTour,
    markTourCompleted,
  };
}
