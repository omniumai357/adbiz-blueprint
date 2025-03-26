
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, FlipHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

interface TourMobileSwipeHintProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  className?: string;
}

export const TourMobileSwipeHint: React.FC<TourMobileSwipeHintProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  className
}) => {
  const isLandscape = useMediaQuery("(orientation: landscape)");
  const hasMultipleSteps = totalSteps > 1;
  
  // Skip rendering if only one step
  if (!hasMultipleSteps) return null;
  
  // For landscape orientation or small heights, use a more compact hint
  if (isLandscape || useMediaQuery("(max-height: 700px)")) {
    return (
      <div className={cn("flex justify-center mt-2 text-xs text-muted-foreground", className)}>
        <div className="flex items-center gap-1 opacity-70">
          <FlipHorizontal className="h-3 w-3" />
          <span>Swipe to navigate</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn("flex justify-center mt-4 text-sm text-muted-foreground font-medium", className)}>
      <span className="inline-flex items-center">
        {currentStep > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onPrev}
            className="mr-2 h-8 px-2 text-xs"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Swipe right
          </Button>
        )}
        <span className="px-2">
          {currentStep + 1} / {totalSteps}
        </span>
        {currentStep < totalSteps - 1 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onNext}
            className="ml-2 h-8 px-2 text-xs"
          >
            Swipe left
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </span>
    </div>
  );
};
