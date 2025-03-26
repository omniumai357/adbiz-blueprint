
import React, { useEffect, useRef } from "react";
import { useTour } from "@/contexts/tour";

interface TourFocusManagerProps {
  isActive: boolean;
  currentStepData: any | null;
}

export const TourFocusManager: React.FC<TourFocusManagerProps> = ({
  isActive,
  currentStepData
}) => {
  const { totalSteps } = useTour();
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isActive) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      document.body.classList.add('tour-active-focus-mode');
      
      let liveRegion = document.getElementById('tour-announcer');
      if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'tour-announcer';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
      }
      
      if (currentStepData) {
        liveRegion.textContent = `Tour started. Step 1 of ${totalSteps}: ${currentStepData.title}`;
      }
    } else {
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
        previousFocusRef.current = null;
      }
      
      document.body.classList.remove('tour-active-focus-mode');
    }
  }, [isActive, currentStepData, totalSteps]);

  return null;
};
