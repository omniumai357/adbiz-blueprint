
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
    if (!isActive || !currentStepData || !currentStepData.path) {
      setPathTargetElement(null);
      return;
    }
    
    // Handle path property which could be a string or an object
    const pathObj = typeof currentStepData.path === 'string' ? 
      { enabled: true, targetElementId: currentStepData.path, style: 'solid' } : 
      currentStepData.path;
    
    // Check if path is enabled
    if (!pathObj.enabled) {
      setPathTargetElement(null);
      return;
    }
    
    // Find the target element for the path
    const pathTargetSelector = pathObj.targetElementId;
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
  
  if (!isActive || !currentStepData?.path || !targetElement || !pathTargetElement) {
    return null;
  }
  
  // Convert the path options from the step data
  const pathObj = typeof currentStepData.path === 'string' ? 
    { enabled: true, targetElementId: currentStepData.path, style: 'solid' } : 
    currentStepData.path;
    
  // Convert the path options from the step data
  const pathOptions = {
    style: pathObj.style || 'solid',
    color: pathObj.color || '#4f46e5',
    animationDuration: pathObj.animationDuration || 500,
    showArrow: pathObj.showArrow !== false,
    waypoints: pathObj.waypoints
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
