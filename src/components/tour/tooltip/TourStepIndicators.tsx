
import React from "react";
import { cn } from "@/lib/utils";

interface TourStepIndicatorsProps {
  currentStep: number;
  totalSteps: number;
}

export const TourStepIndicators: React.FC<TourStepIndicatorsProps> = ({ 
  currentStep, 
  totalSteps 
}) => {
  if (totalSteps <= 1) return null;
  
  return (
    <div className="flex justify-center space-x-1 mt-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div 
          key={index}
          className={cn(
            "h-2 w-2 rounded-full transition-all duration-300",
            index === currentStep 
              ? "bg-primary scale-125" 
              : index < currentStep 
                ? "bg-primary/60" 
                : "bg-gray-300"
          )}
          aria-label={`Step ${index + 1} of ${totalSteps}`}
        />
      ))}
    </div>
  );
};
