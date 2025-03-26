
import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { TourStepIndicators } from "../tooltip/TourStepIndicators";

interface TourMobileProgressProps {
  currentStep: number;
  totalSteps: number;
}

export const TourMobileProgress: React.FC<TourMobileProgressProps> = ({ 
  currentStep, 
  totalSteps 
}) => {
  const [progressValue, setProgressValue] = useState(0);
  
  // Calculate progress percentage
  useEffect(() => {
    setProgressValue(((currentStep + 1) / totalSteps) * 100);
  }, [currentStep, totalSteps]);
  
  return (
    <>
      {/* Progress bar */}
      <Progress value={progressValue} className="h-1 mb-4" />
      
      {/* Step dots for smaller tours */}
      {totalSteps <= 8 && (
        <TourStepIndicators 
          currentStep={currentStep} 
          totalSteps={totalSteps} 
        />
      )}
    </>
  );
};
