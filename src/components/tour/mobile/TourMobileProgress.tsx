
import React from 'react';
import { cn } from '@/lib/utils';
import { useResponsiveTour } from '@/contexts/tour/ResponsiveTourContext';

interface TourMobileProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
  compact?: boolean;
}

/**
 * TourMobileProgress Component
 * 
 * Displays tour progress with responsive design for different mobile views.
 * Adapts its display based on available space and device orientation.
 */
export const TourMobileProgress: React.FC<TourMobileProgressProps> = ({
  currentStep,
  totalSteps,
  className,
  compact = false
}) => {
  const { isLandscape, isTablet, direction } = useResponsiveTour();
  
  // Calculate progress percentage
  const progress = ((currentStep + 1) / totalSteps) * 100;
  
  // Determine text alignment based on language direction
  const textAlignClass = direction === 'rtl' ? 'text-right' : 'text-left';
  
  // Display as dots for very compact view (like in landscape on small devices)
  if (compact && !isTablet && isLandscape) {
    return (
      <div className={cn("flex justify-center items-center gap-1.5", className)}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div 
            key={index}
            className={cn(
              "h-2 w-2 rounded-full transition-colors",
              index === currentStep ? "bg-primary" : "bg-muted"
            )}
            aria-hidden="true"
          />
        ))}
        <span className="sr-only">Step {currentStep + 1} of {totalSteps}</span>
      </div>
    );
  }
  
  // Default progress bar view
  return (
    <div className={cn("mt-2 space-y-1", className)}>
      <div className={cn(
        "flex justify-between items-center text-xs text-muted-foreground",
        textAlignClass
      )}>
        <span>Progress</span>
        <span>{currentStep + 1} of {totalSteps}</span>
      </div>
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
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
