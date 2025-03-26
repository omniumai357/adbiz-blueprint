
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TourMobileSwipeHintProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
}

export const TourMobileSwipeHint: React.FC<TourMobileSwipeHintProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrev
}) => {
  return (
    <div className="flex justify-center mt-4 text-sm text-muted-foreground font-medium">
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
