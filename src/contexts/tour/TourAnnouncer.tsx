
import React, { useEffect, useRef } from "react";

interface TourAnnouncerProps {
  isActive: boolean;
  currentStepData: any | null;
  currentStep: number;
  totalSteps: number;
}

export const TourAnnouncer: React.FC<TourAnnouncerProps> = ({
  isActive,
  currentStepData,
  currentStep,
  totalSteps
}) => {
  const announcerRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    if (!announcerRef.current) {
      const announcer = document.createElement('div');
      announcer.id = 'tour-sr-announcer';
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      document.body.appendChild(announcer);
      announcerRef.current = announcer;
    }
    
    return () => {
      if (announcerRef.current && document.body.contains(announcerRef.current)) {
        document.body.removeChild(announcerRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    if (isActive && currentStepData && announcerRef.current) {
      const { title } = currentStepData;
      const stepNumber = currentStep + 1;
      const announcement = `Step ${stepNumber} of ${totalSteps}: ${title}`;
      
      announcerRef.current.textContent = '';
      
      setTimeout(() => {
        if (announcerRef.current) {
          announcerRef.current.textContent = announcement;
        }
      }, 50);
    }
  }, [isActive, currentStep, currentStepData, totalSteps]);
  
  return null;
};
