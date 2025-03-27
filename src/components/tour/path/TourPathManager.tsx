
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
    if (
      isActive && 
      currentStepData?.path?.enabled && 
      currentStepData?.path?.targetElementId
    ) {
      const targetId = currentStepData.path.targetElementId;
      const element = document.getElementById(targetId);
      
      if (element) {
        onPathTargetChange(element);
      } else {
        try {
          const potentialElement = document.querySelector(
            `#${targetId}, .${targetId}, [data-tour-id="${targetId}"]`
          );
          if (potentialElement instanceof HTMLElement) {
            onPathTargetChange(potentialElement);
          } else {
            console.warn(`Path target element not found: ${targetId}`);
            onPathTargetChange(null);
          }
        } catch (e) {
          console.warn(`Error finding path target element: ${targetId}`, e);
          onPathTargetChange(null);
        }
      }
    } else {
      onPathTargetChange(null);
    }
  }, [isActive, currentStepData, onPathTargetChange]);

  return null;
};
