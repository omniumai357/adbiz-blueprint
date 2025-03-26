
import React, { useEffect, useState } from "react";

interface TourPathManagerProps {
  isActive: boolean;
  currentStepData: any | null;
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
          }
        } catch (e) {
          console.warn(`Path target element not found: ${targetId}`);
          onPathTargetChange(null);
        }
      }
    } else {
      onPathTargetChange(null);
    }
  }, [isActive, currentStepData, onPathTargetChange]);

  return null;
};
