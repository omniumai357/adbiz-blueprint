
import React, { useState, useRef } from "react";
import { useTour } from "@/contexts/tour";
import { useTourFocusTrap } from "@/hooks/tour/useTourFocusTrap";
import { TourFocusManager } from "../../accessibility/TourFocusManager";
import { TourLiveAnnouncer } from "../../accessibility/TourLiveAnnouncer";
import { TourStepFocusManager } from "../../accessibility/TourStepFocusManager";
import { TourFocusStyles } from "../../accessibility/TourFocusStyles";
import { TourScreenReaderAnnouncer } from "../../accessibility/TourScreenReaderAnnouncer";
import { TourSkipNavigation } from "../../accessibility/TourSkipNavigation";

interface TourAccessibilityManagerProps {
  tooltipRef: React.RefObject<HTMLDivElement>;
}

export const TourAccessibilityManager: React.FC<TourAccessibilityManagerProps> = ({ 
  tooltipRef 
}) => {
  const { 
    isActive, 
    currentStepData,
    endTour
  } = useTour();
  
  const [lastStepIndex, setLastStepIndex] = useState<number>(-1);
  const { focusElement } = useTourFocusTrap(isActive, tooltipRef, true);
  
  // Handle skip to main content functionality
  const handleSkipToMain = () => {
    // Find the main content area
    const mainContent = document.querySelector('main') || 
                        document.getElementById('main-content') || 
                        document.getElementById('content');
    
    if (mainContent) {
      // End the tour and move focus to main content
      endTour();
      
      // Set focus on the main content
      if (mainContent instanceof HTMLElement) {
        mainContent.setAttribute('tabindex', '-1');
        mainContent.focus();
        
        // Remove tabindex after focus to maintain proper tab order
        setTimeout(() => {
          mainContent.removeAttribute('tabindex');
        }, 100);
      }
    } else {
      // If no main content found, just end the tour
      endTour();
    }
  };
  
  return (
    <>
      <TourFocusStyles />
      
      <TourFocusManager 
        isActive={isActive} 
        currentStepData={currentStepData} 
      />
      
      {/* Skip navigation links for keyboard users */}
      <TourSkipNavigation 
        isActive={isActive} 
        onSkipToMain={handleSkipToMain} 
      />
      
      {/* Enhanced screen reader announcements */}
      <TourScreenReaderAnnouncer 
        politeAnnouncements={true}
        assertiveForStatus={true}
      />
      
      {/* Legacy announcer for backward compatibility */}
      <TourLiveAnnouncer 
        isActive={isActive} 
        currentStepData={currentStepData} 
      />
      
      <TourStepFocusManager 
        isActive={isActive}
        currentStepData={currentStepData}
        lastStepIndex={lastStepIndex}
        setLastStepIndex={setLastStepIndex}
        focusElement={focusElement}
      />
    </>
  );
};
