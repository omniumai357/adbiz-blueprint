
import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { TourStepIndicators } from "../tooltip/TourStepIndicators";
import { cn } from "@/lib/utils";

interface TourMobileProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
  variant?: "minimal" | "standard" | "full";
}

export const TourMobileProgress: React.FC<TourMobileProgressProps> = ({ 
  currentStep, 
  totalSteps,
  className,
  variant = "standard"
}) => {
  const [progressValue, setProgressValue] = useState(0);
  const [animateProgress, setAnimateProgress] = useState(false);
  
  // Calculate progress percentage with animation
  useEffect(() => {
    setProgressValue(0);
    setAnimateProgress(false);
    
    // Small delay to allow for animation reset
    const timeout = setTimeout(() => {
      setAnimateProgress(true);
      setProgressValue(((currentStep + 1) / totalSteps) * 100);
    }, 50);
    
    return () => clearTimeout(timeout);
  }, [currentStep, totalSteps]);
  
  if (variant === "minimal") {
    return (
      <div className={cn("flex justify-between items-center text-xs text-muted-foreground", className)}>
        <span>Step {currentStep + 1}/{totalSteps}</span>
      </div>
    );
  }
  
  return (
    <div className={className}>
      {/* Progress bar */}
      <Progress 
        value={progressValue} 
        className={cn(
          "h-1 mb-4", 
          animateProgress ? "transition-all duration-500" : ""
        )} 
      />
      
      {/* Step dots for smaller tours */}
      {variant === "full" && totalSteps <= 8 && (
        <TourStepIndicators 
          currentStep={currentStep} 
          totalSteps={totalSteps} 
        />
      )}
      
      {/* Text indicator for larger tours or when in full variant */}
      {(variant === "full" || totalSteps > 8) && (
        <div className="text-xs text-center text-muted-foreground mb-2">
          Step {currentStep + 1} of {totalSteps}
        </div>
      )}
    </div>
  );
};
