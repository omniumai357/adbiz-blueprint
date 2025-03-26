
import React, { useEffect, useRef } from "react";
import { useTour } from "@/contexts/tour";

interface TourScreenReaderAnnouncerProps {
  politeAnnouncements?: boolean;
  assertiveForStatus?: boolean;
}

/**
 * Component that announces tour changes to screen readers
 * 
 * This component creates and manages aria-live regions for accessible
 * announcements related to tour navigation and content changes.
 */
export const TourScreenReaderAnnouncer: React.FC<TourScreenReaderAnnouncerProps> = ({
  politeAnnouncements = true,
  assertiveForStatus = true
}) => {
  const { 
    isActive,
    currentStep,
    totalSteps,
    currentStepData
  } = useTour();
  
  const previousStepRef = useRef<number>(-1);
  const politeAnnouncementRef = useRef<string>("");
  const assertiveAnnouncementRef = useRef<string>("");
  
  // Announce tour start/end
  useEffect(() => {
    if (isActive) {
      if (previousStepRef.current === -1) {
        // Tour just started
        const announcement = `Tour started. ${totalSteps} steps in total. Use arrow keys to navigate between steps, Space to select, and Escape to exit the tour.`;
        
        if (assertiveForStatus) {
          assertiveAnnouncementRef.current = announcement;
        } else {
          politeAnnouncementRef.current = announcement;
        }
      }
    } else if (previousStepRef.current !== -1) {
      // Tour just ended
      const announcement = "Tour ended. Focus is now returned to the page.";
      
      if (assertiveForStatus) {
        assertiveAnnouncementRef.current = announcement;
      } else {
        politeAnnouncementRef.current = announcement;
      }
      
      previousStepRef.current = -1;
    }
  }, [isActive, totalSteps, assertiveForStatus]);
  
  // Announce step changes
  useEffect(() => {
    if (isActive && currentStepData) {
      // Only announce if this is a step change (not initial load)
      if (previousStepRef.current !== -1 && previousStepRef.current !== currentStep) {
        const direction = currentStep > previousStepRef.current ? 'forward' : 'backward';
        const announcement = `Step ${currentStep + 1} of ${totalSteps}: ${currentStepData.title}. ${currentStepData.content || ''}`;
        
        // Add navigation hints based on current position
        const navigationHints = [];
        if (currentStep > 0) navigationHints.push("Press left arrow or shift+tab to go back");
        if (currentStep < totalSteps - 1) navigationHints.push("Press right arrow or tab to continue");
        if (currentStep === totalSteps - 1) navigationHints.push("Press Enter or Space to complete the tour");
        
        politeAnnouncementRef.current = `${announcement} ${navigationHints.join(". ")}`;
      }
      
      // Update the previous step reference
      previousStepRef.current = currentStep;
    }
  }, [isActive, currentStep, totalSteps, currentStepData]);
  
  // Clear announcements after they've been read
  useEffect(() => {
    if (politeAnnouncementRef.current) {
      const timeout = setTimeout(() => {
        politeAnnouncementRef.current = "";
      }, 5000);
      
      return () => clearTimeout(timeout);
    }
  }, [politeAnnouncementRef.current]);
  
  useEffect(() => {
    if (assertiveAnnouncementRef.current) {
      const timeout = setTimeout(() => {
        assertiveAnnouncementRef.current = "";
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [assertiveAnnouncementRef.current]);
  
  return (
    <>
      {/* Polite announcements - for most tour updates */}
      <div 
        aria-live={politeAnnouncements ? "polite" : "off"} 
        aria-atomic="true"
        className="sr-only"
        id="tour-polite-announcer"
        role="status"
      >
        {politeAnnouncementRef.current}
      </div>
      
      {/* Assertive announcements - for critical information */}
      <div 
        aria-live="assertive" 
        aria-atomic="true"
        className="sr-only"
        id="tour-assertive-announcer"
        role="alert"
      >
        {assertiveAnnouncementRef.current}
      </div>
    </>
  );
};
