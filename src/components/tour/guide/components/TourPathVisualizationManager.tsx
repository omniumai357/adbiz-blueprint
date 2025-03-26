
import React, { useState, useCallback } from "react";
import { useTour } from "@/contexts/tour";
import { TourPathManager } from "../../path/TourPathManager";
import { TourPathVisualization } from "../TourPathVisualization";

interface TourPathVisualizationManagerProps {
  targetElement: HTMLElement | null;
}

export const TourPathVisualizationManager: React.FC<TourPathVisualizationManagerProps> = ({
  targetElement
}) => {
  const { isActive, currentStepData } = useTour();
  const [pathTargetElement, setPathTargetElement] = useState<HTMLElement | null>(null);
  
  const handlePathTargetChange = useCallback((element: HTMLElement | null) => {
    setPathTargetElement(element);
  }, []);
  
  return (
    <>
      <TourPathManager 
        isActive={isActive}
        currentStepData={currentStepData}
        onPathTargetChange={handlePathTargetChange}
      />
      
      <TourPathVisualization 
        isActive={!!currentStepData?.path?.enabled && !!targetElement && !!pathTargetElement}
        sourceElement={targetElement}
        targetElement={pathTargetElement}
        pathOptions={currentStepData?.path}
      />
    </>
  );
};
