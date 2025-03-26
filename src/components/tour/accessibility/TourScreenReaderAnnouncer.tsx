
import React, { useEffect, useRef } from "react";
import { useTour } from "@/contexts/tour";

interface TourScreenReaderAnnouncerProps {
  politeAnnouncements?: boolean;
}

/**
 * Component that announces tour changes to screen readers
 * 
 * This component creates and manages aria-live regions for accessible
 * announcements related to tour navigation and content changes.
 */
export const TourScreenReaderAnnouncer: React.FC<TourScreenReaderAnnouncerProps> = ({
  politeAnnouncements = true
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
        politeAnnouncementRef.current = `Tour started. ${totalSteps} steps in total.`;
      }
    } else if (previousStepRef.current !== -1) {
      // Tour just ended
      politeAnnouncementRef.current = "Tour ended.";
      previousStepRef.current = -1;
    }
  }, [isActive, totalSteps]);
  
  // Announce step changes
  useEffect(() => {
    if (isActive && currentStepData) {
      // Only announce if this is a step change (not initial load)
      if (previousStepRef.current !== -1 && previousStepRef.current !== currentStep) {
        const direction = currentStep > previousStepRef.current ? 'next' : 'previous';
        politeAnnouncementRef.current = `Step ${currentStep + 1} of ${totalSteps}: ${currentStepData.title}`;
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
      >
        {politeAnnouncementRef.current}
      </div>
      
      {/* Assertive announcements - for critical information */}
      <div 
        aria-live="assertive" 
        aria-atomic="true"
        className="sr-only"
        id="tour-assertive-announcer"
      >
        {assertiveAnnouncementRef.current}
      </div>
    </>
  );
};
