
import React, { useEffect } from "react";
import { useTour } from "@/contexts/tour";
import { useIsMobile } from "@/hooks/use-mobile";

interface TourStepFocusManagerProps {
  isActive: boolean;
  currentStepData: any | null;
  lastStepIndex: number;
  setLastStepIndex: (index: number) => void;
  focusElement: (selector: string) => boolean;
}

export const TourStepFocusManager: React.FC<TourStepFocusManagerProps> = ({
  isActive,
  currentStepData,
  lastStepIndex,
  setLastStepIndex,
  focusElement
}) => {
  const { currentStep, totalSteps } = useTour();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isActive && currentStepData && lastStepIndex !== currentStep) {
      setLastStepIndex(currentStep);
      
      setTimeout(() => {
        if (!isMobile) {
          if (currentStep === 0) {
            focusElement('[data-tour-action="next"]');
          } else if (currentStep === totalSteps - 1) {
            focusElement('[data-tour-action="finish"]');
          } else if (currentStep > lastStepIndex && lastStepIndex !== -1) {
            focusElement('[data-tour-action="next"]');
          } else if (currentStep < lastStepIndex) {
            focusElement('[data-tour-action="previous"]');
          }
        }

        const liveRegion = document.getElementById('tour-announcer');
        if (liveRegion) {
          const stepNumber = currentStep + 1;
          // Use currentStepData.content directly
          const stepContent = currentStepData.content || '';
          liveRegion.textContent = `Step ${stepNumber} of ${totalSteps}: ${currentStepData.title}. ${stepContent}`;
        }
      }, 150);
    }
  }, [isActive, currentStep, currentStepData, lastStepIndex, totalSteps, isMobile, focusElement, setLastStepIndex]);

  return null;
};
