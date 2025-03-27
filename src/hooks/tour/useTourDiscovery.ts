import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useTour } from '@/contexts/tour';
import { TourPath } from '@/contexts/tour/types';

/**
 * Hook for tour discovery and management
 */
export function useTourDiscovery() {
  const location = useLocation();
  const {
    isActive,
    startTour,
    endTour,
    currentPath,
    currentPathData,
    tourPaths
  } = useTour();
  
  const [hasSeenAnyTour, setHasSeenAnyTour] = useState(false);
  const [hasStartedTour, setHasStartedTour] = useState(false);
  const [completedTours, setCompletedTours] = useState<string[]>([]);
  const [dismissedTours, setDismissedTours] = useState<string[]>([]);
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});
  const [lastSeenDate, setLastSeenDate] = useState('');
  
  // Load tour state from local storage on mount
  useEffect(() => {
    const storedHasSeenAnyTour = localStorage.getItem('hasSeenAnyTour');
    const storedCompletedTours = localStorage.getItem('completedTours');
    const storedDismissedTours = localStorage.getItem('dismissedTours');
    const storedViewCounts = localStorage.getItem('tourViewCounts');
    const storedLastSeenDate = localStorage.getItem('tourLastSeenDate');
    
    if (storedHasSeenAnyTour) {
      setHasSeenAnyTour(JSON.parse(storedHasSeenAnyTour));
    }
    
    if (storedCompletedTours) {
      setCompletedTours(JSON.parse(storedCompletedTours));
    }
    
    if (storedDismissedTours) {
      setDismissedTours(JSON.parse(storedDismissedTours));
    }
    
    if (storedViewCounts) {
      setViewCounts(JSON.parse(storedViewCounts));
    }
    
    if (storedLastSeenDate) {
      setLastSeenDate(storedLastSeenDate);
    }
  }, []);
  
  // Check if current page tour has been completed
  const hasCompletedCurrentPageTour = useCallback(() => {
    const currentPageTourId = findAppropriatePathForCurrentPage();
    return completedTours.includes(currentPageTourId);
  }, [completedTours]);
  
  // Find the appropriate tour path for the current page
  const findAppropriatePathForCurrentPage = useCallback(() => {
    const currentPagePath = location.pathname;
    
    // Find a tour that matches the current route
    const matchingPath = tourPaths.find(path => path.route === currentPagePath);
    
    // If found, return its ID
    if (matchingPath) {
      return matchingPath.id;
    }
    
    // Otherwise, generate a generic tour ID based on the path
    const pathId = `${currentPagePath.replace(/\//g, '-')}-tour`.replace(/^-/, '');
    return pathId;
  }, [location.pathname, tourPaths]);
  
  // Mark the current tour as completed
  const markCurrentTourCompleted = useCallback(() => {
    if (currentPath) {
      const updatedCompletedTours = [...completedTours, currentPath];
      setCompletedTours(updatedCompletedTours);
      localStorage.setItem('completedTours', JSON.stringify(updatedCompletedTours));
      
      // Also mark that we've seen at least one tour
      setHasSeenAnyTour(true);
      localStorage.setItem('hasSeenAnyTour', JSON.stringify(true));
    }
  }, [currentPath, completedTours]);
  
  // Dismiss the current tour without completing it
  const dismissCurrentTour = useCallback(() => {
    const tourId = findAppropriatePathForCurrentPage();
    const updatedDismissedTours = [...dismissedTours, tourId];
    setDismissedTours(updatedDismissedTours);
    localStorage.setItem('dismissedTours', JSON.stringify(updatedDismissedTours));
    
    // Also mark that we've seen at least one tour
    setHasSeenAnyTour(true);
    localStorage.setItem('hasSeenAnyTour', JSON.stringify(true));
    
    // End the tour if it's active
    if (isActive) {
      endTour();
    }
  }, [dismissedTours, findAppropriatePathForCurrentPage, isActive, endTour]);
  
  // Start the appropriate tour for the current page
  const startAppropriatePageTour = useCallback(() => {
    const tourId = findAppropriatePathForCurrentPage();
    
    // Check if this tour has been completed or dismissed
    if (completedTours.includes(tourId) || dismissedTours.includes(tourId)) {
      return false;
    }
    
    // Start the tour
    startTour(tourId);
    setHasStartedTour(true);
    
    // Update view count
    const newViewCounts = { ...viewCounts };
    newViewCounts[tourId] = (newViewCounts[tourId] || 0) + 1;
    setViewCounts(newViewCounts);
    localStorage.setItem('tourViewCounts', JSON.stringify(newViewCounts));
    
    // Update last seen date
    const today = new Date().toISOString().split('T')[0];
    setLastSeenDate(today);
    localStorage.setItem('tourLastSeenDate', today);
    
    return true;
  }, [
    findAppropriatePathForCurrentPage,
    completedTours,
    dismissedTours,
    startTour,
    viewCounts
  ]);
  
  // Reset all tour progress
  const resetAllTourProgress = useCallback(() => {
    setCompletedTours([]);
    setDismissedTours([]);
    setViewCounts({});
    setLastSeenDate('');
    setHasSeenAnyTour(false);
    
    localStorage.removeItem('completedTours');
    localStorage.removeItem('dismissedTours');
    localStorage.removeItem('tourViewCounts');
    localStorage.removeItem('tourLastSeenDate');
    localStorage.removeItem('hasSeenAnyTour');
    
    if (isActive) {
      endTour();
    }
  }, [isActive, endTour]);
  
  // Mark tour as completed when the last step is reached
  useEffect(() => {
    if (isActive && currentPathData && currentPath) {
      const handleTourComplete = () => {
        markCurrentTourCompleted();
      };
      
      document.addEventListener('tour:complete', handleTourComplete);
      
      return () => {
        document.removeEventListener('tour:complete', handleTourComplete);
      };
    }
  }, [isActive, currentPathData, currentPath, markCurrentTourCompleted]);
  
  return {
    hasSeenAnyTour,
    hasStartedTour,
    completedTours,
    dismissedTours,
    viewCounts,
    lastSeenDate,
    hasCompletedCurrentPageTour,
    markCurrentTourCompleted,
    dismissCurrentTour,
    startAppropriatePageTour,
    resetAllTourProgress,
    findAppropriatePathForCurrentPage
  };
}
