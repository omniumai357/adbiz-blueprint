
import React from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface TourMobileProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
  compact?: boolean;
}

export const TourMobileProgress: React.FC<TourMobileProgressProps> = ({
  currentStep,
  totalSteps,
  className,
  compact = false
}) => {
  // Calculate progress percentage
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;
  
  return (
    <div className={cn("space-y-1", className)}>
      {!compact && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Step {currentStep + 1} of {totalSteps}</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
      )}
      <Progress 
        value={progressPercentage} 
        className={cn(
          "h-1", 
          compact ? "w-full" : "h-1.5"
        )}
      />
    </div>
  );
};
