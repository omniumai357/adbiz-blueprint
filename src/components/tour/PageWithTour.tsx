
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TourProvider } from '@/contexts/tour';
import { ModalProvider } from '@/components/ui/modal-provider';
import { WelcomeTourModal } from './WelcomeTourModal';
import { useTourDiscovery } from '@/hooks/tour/useTourDiscovery';

interface PageWithTourProps {
  children: React.ReactNode;
  autoStart?: boolean;
  tourId?: string;
  showWelcomeModal?: boolean;
  disableAutoScroll?: boolean;
}

export const PageWithTour: React.FC<PageWithTourProps> = ({ 
  children, 
  autoStart = false,
  tourId,
  showWelcomeModal = true,
  disableAutoScroll = false
}) => {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const { 
    hasSeenTour, 
    hasCompletedCurrentPageTour, 
    startAppropriatePageTour 
  } = useTourDiscovery();
  
  useEffect(() => {
    // When the user navigates to a new page, check if they've seen the tour before
    const completedTours = JSON.parse(localStorage.getItem('completedTours') || '[]');
    const pageSpecificTourId = tourId || `${location.pathname.replace(/\//g, '-')}-tour`.replace(/^-/, '');
    const hasCompletedThisTour = completedTours.includes(pageSpecificTourId);
    
    // Reset page scroll when navigating to a page with a tour (unless disabled)
    if (!disableAutoScroll) {
      window.scrollTo(0, 0);
    }
    
    // Determine if we should auto-start the tour
    if (autoStart && !hasCompletedThisTour) {
      // Delay the start slightly to ensure the page has fully rendered
      setTimeout(() => {
        startAppropriatePageTour();
      }, 500);
    }
    
    // Determine if we should show the welcome modal
    if (showWelcomeModal && !hasSeenTour && !hasCompletedThisTour) {
      setShowModal(true);
    }
  }, [location.pathname, hasSeenTour, autoStart, tourId, disableAutoScroll, showWelcomeModal, startAppropriatePageTour, hasCompletedCurrentPageTour]);
  
  return (
    <TourProvider currentPathname={location.pathname}>
      <ModalProvider>
        {children}
        {showModal && <WelcomeTourModal forceShow={true} />}
      </ModalProvider>
    </TourProvider>
  );
};
