
import React, { useRef } from "react";
import { useTour } from "@/contexts/tour";
import { TourPathVisualization } from "../TourPathVisualization";

interface TourPathVisualizationManagerProps {
  targetElement: HTMLElement | null;
}

export const TourPathVisualizationManager: React.FC<TourPathVisualizationManagerProps> = ({ 
  targetElement 
}) => {
  const { isActive, currentStepData } = useTour();
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  
  // Skip rendering if no target element
  if (!targetElement || !currentStepData) {
    return null;
  }
  
  // Skip if no path configuration
  if (!currentStepData.path?.enabled) {
    return null;
  }
  
  // Find path target element (if any)
  const pathTarget = currentStepData.path.targetElementId
    ? document.getElementById(currentStepData.path.targetElementId)
    : null;
  
  return (
    <TourPathVisualization
      isActive={isActive}
      sourceElement={tooltipRef.current}
      targetElement={pathTarget}
      pathOptions={{
        style: currentStepData.path.style || 'solid',
        color: '#0066cc',
        width: 2,
        animate: true
      }}
    />
  );
};
