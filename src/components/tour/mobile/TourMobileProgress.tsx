
import React from 'react';

interface TourMobileProgressProps {
  currentStep: number;
  totalSteps: number;
}

export const TourMobileProgress: React.FC<TourMobileProgressProps> = ({
  currentStep,
  totalSteps
}) => {
  // Calculate progress percentage
  const progress = ((currentStep + 1) / totalSteps) * 100;
  
  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1 text-xs text-muted-foreground">
        <span>Progress</span>
        <span>{currentStep + 1} of {totalSteps}</span>
      </div>
      <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={currentStep + 1}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
        />
      </div>
    </div>
  );
};
