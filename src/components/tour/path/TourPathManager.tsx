
import React, { useEffect } from "react";
import { TourStep } from "@/contexts/tour/types";

interface TourPathManagerProps {
  isActive: boolean;
  currentStepData: TourStep | null;
  onPathTargetChange: (element: HTMLElement | null) => void;
}

export const TourPathManager: React.FC<TourPathManagerProps> = ({
  isActive,
  currentStepData,
  onPathTargetChange
}) => {
  useEffect(() => {
    if (!isActive || !currentStepData) {
      onPathTargetChange(null);
      return;
    }

    // Handle path property which could be a string or an object
    // If path property doesn't exist, try using target or elementId
    const targetId = currentStepData.target || 
                     (currentStepData as any).elementId || 
                     (currentStepData as any).path?.targetElementId;
    
    if (!targetId) {
      onPathTargetChange(null);
      return;
    }
    
    try {
      // Try to find the element by id first
      let element = document.getElementById(targetId);
      
      // If not found, try other selectors
      if (!element) {
        const potentialElement = document.querySelector(
          `#${targetId}, .${targetId}, [data-tour-id="${targetId}"]`
        );
        
        if (potentialElement instanceof HTMLElement) {
          element = potentialElement;
        } else {
          console.warn(`Path target element not found: ${targetId}`);
          onPathTargetChange(null);
          return;
        }
      }
      
      onPathTargetChange(element);
    } catch (e) {
      console.warn(`Error finding path target element: ${targetId}`, e);
      onPathTargetChange(null);
    }
  }, [isActive, currentStepData, onPathTargetChange]);

  return null;
};
