
import React, { useEffect, useState } from "react";
import { useTour } from "@/contexts/tour";
import { TourPathVisualization } from "../TourPathVisualization";
import { useTourElementFinder } from "@/hooks/tour/useTourElementFinder";

interface TourPathVisualizationManagerProps {
  targetElement: HTMLElement | null;
}

export const TourPathVisualizationManager: React.FC<TourPathVisualizationManagerProps> = ({
  targetElement
}) => {
  const { isActive, currentStepData } = useTour();
  const [pathTargetElement, setPathTargetElement] = useState<HTMLElement | null>(null);
  
  // If the current step has a path property, find the target element for the path
  useEffect(() => {
    if (!isActive || !currentStepData || !currentStepData.path || !currentStepData.path.enabled) {
      setPathTargetElement(null);
      return;
    }
    
    // Find the target element for the path
    const pathTargetSelector = currentStepData.path.targetElementId;
    if (!pathTargetSelector) {
      setPathTargetElement(null);
      return;
    }
    
    try {
      const element = document.querySelector(pathTargetSelector) as HTMLElement;
      setPathTargetElement(element);
    } catch (error) {
      console.error('Error finding path target element:', error);
      setPathTargetElement(null);
    }
  }, [isActive, currentStepData]);
  
  if (!isActive || !currentStepData?.path?.enabled || !targetElement || !pathTargetElement) {
    return null;
  }
  
  // Convert the path options from the step data
  const pathOptions = {
    style: currentStepData.path.style || 'solid',
    color: currentStepData.path.color || '#4f46e5',
    animationDuration: currentStepData.path.animationDuration || 500,
    showArrow: currentStepData.path.showArrow !== false,
    waypoints: currentStepData.path.waypoints
  };
  
  return (
    <TourPathVisualization
      isActive={true}
      sourceElement={targetElement}
      targetElement={pathTargetElement}
      pathOptions={pathOptions}
    />
  );
};
