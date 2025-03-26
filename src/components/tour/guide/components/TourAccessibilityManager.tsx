
import React, { useState, useRef } from "react";
import { useTour } from "@/contexts/tour";
import { useTourFocusTrap } from "@/hooks/tour/useTourFocusTrap";
import { TourFocusManager } from "../../accessibility/TourFocusManager";
import { TourLiveAnnouncer } from "../../accessibility/TourLiveAnnouncer";
import { TourStepFocusManager } from "../../accessibility/TourStepFocusManager";
import { TourFocusStyles } from "../../accessibility/TourFocusStyles";

interface TourAccessibilityManagerProps {
  tooltipRef: React.RefObject<HTMLDivElement>;
}

export const TourAccessibilityManager: React.FC<TourAccessibilityManagerProps> = ({ 
  tooltipRef 
}) => {
  const { 
    isActive, 
    currentStepData 
  } = useTour();
  
  const [lastStepIndex, setLastStepIndex] = useState<number>(-1);
  const { focusElement } = useTourFocusTrap(isActive, tooltipRef, true);
  
  return (
    <>
      <TourFocusStyles />
      
      <TourFocusManager 
        isActive={isActive} 
        currentStepData={currentStepData} 
      />
      
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
