
import React, { useEffect, useRef } from "react";
import { useTour } from "@/contexts/tour";
import { useIsMobile } from "@/hooks/use-mobile";

interface TourLiveAnnouncerProps {
  isActive: boolean;
  currentStepData: any | null;
}

export const TourLiveAnnouncer: React.FC<TourLiveAnnouncerProps> = ({ 
  isActive, 
  currentStepData 
}) => {
  const { currentStep, totalSteps, content } = useTour();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (isActive && currentStepData) {
      let liveRegion = document.getElementById('tour-announcer');
      if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'tour-announcer';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
      }
      
      const stepNumber = currentStep + 1;
      // Use currentStepData.content if content is undefined
      const stepContent = content || currentStepData.content || '';
      let announcement = `Step ${stepNumber} of ${totalSteps}: ${currentStepData.title}. ${stepContent}`;
      
      if (isMobile) {
        announcement += '. You can swipe left to continue or swipe right to go back.';
      } else {
        announcement += '. Use arrow keys to navigate, Home and End to jump to first or last step, and Shift+? for keyboard shortcuts.';
      }
      
      liveRegion.textContent = announcement;
    }
    
    return () => {
      const liveRegion = document.getElementById('tour-announcer');
      if (liveRegion && !isActive) {
        liveRegion.textContent = "Tour ended";
      }
    };
  }, [isActive, currentStepData, currentStep, totalSteps, content, isMobile]);
  
  return null;
};
