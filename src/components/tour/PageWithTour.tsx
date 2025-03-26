
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { TourProvider } from '@/contexts/tour-context';
import { ModalProvider } from '@/components/ui/modal-provider';
import { WelcomeTourModal } from './WelcomeTourModal';

interface PageWithTourProps {
  children: React.ReactNode;
}

export const PageWithTour: React.FC<PageWithTourProps> = ({ children }) => {
  const location = useLocation();
  
  useEffect(() => {
    // When the user navigates to a new page, check if they've seen the tour before
    const completedTours = JSON.parse(localStorage.getItem('completedTours') || '[]');
    const hasSeenTour = localStorage.getItem('hasSeenTour') === 'true';
    
    // Reset page scroll when navigating to a page with a tour
    window.scrollTo(0, 0);
    
    // If necessary, we could add more dynamic tour logic here
  }, [location.pathname]);
  
  return (
    <TourProvider currentPathname={location.pathname}>
      <ModalProvider>
        {children}
      </ModalProvider>
    </TourProvider>
  );
};
