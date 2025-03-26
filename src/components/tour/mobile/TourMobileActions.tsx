
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

interface TourMobileActionsProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  prevLabel?: string;
  nextLabel?: string;
  skipLabel?: string;
  showSkip?: boolean;
  className?: string;
}

export const TourMobileActions: React.FC<TourMobileActionsProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onClose,
  prevLabel,
  nextLabel,
  skipLabel,
  showSkip = true,
  className
}) => {
  const isLastStep = currentStep === totalSteps - 1;
  const isLandscape = useMediaQuery("(orientation: landscape)");
  const isCompact = isLandscape || useMediaQuery("(max-width: 400px)");
  
  // Use more compact UI for landscape or small screens
  if (isCompact) {
    return (
      <div className={cn("flex justify-between pt-2 pb-3", className)}>
        <div>
          {currentStep > 0 && (
            <Button variant="outline" size="sm" onClick={onPrev} className="h-8 px-3">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">{prevLabel || "Previous"}</span>
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          {!isLastStep && showSkip && (
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 px-3 text-xs">
              {skipLabel || "Skip"}
            </Button>
          )}
          <Button 
            size="sm" 
            onClick={onNext} 
            className={cn(
              "h-8",
              isLastStep ? "bg-green-500 hover:bg-green-600" : ""
            )}
          >
            {isLastStep ? 
              (nextLabel || "Finish") : 
              (nextLabel || "Next")}
            {!isLastStep && <ChevronRight className="h-4 w-4 ml-1" />}
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn("flex flex-row justify-between pt-2 pb-4", className)}>
      <div className="flex gap-2">
        {currentStep > 0 && (
          <Button variant="outline" size="sm" onClick={onPrev}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            {prevLabel || "Previous"}
          </Button>
        )}
      </div>
      <div className="flex gap-2">
        {!isLastStep && showSkip && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            {skipLabel || "Skip"}
          </Button>
        )}
        <Button 
          size="sm" 
          onClick={onNext} 
          className={cn(
            "animate-pulse-subtle", 
            isLastStep ? "bg-green-500 hover:bg-green-600" : ""
          )}
        >
          {isLastStep ? 
            (nextLabel || "Finish") : 
            (nextLabel || "Next")}
          {!isLastStep && <ChevronRight className="h-4 w-4 ml-1" />}
        </Button>
      </div>
    </div>
  );
};
