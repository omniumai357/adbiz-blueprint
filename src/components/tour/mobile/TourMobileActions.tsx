
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
  deviceType?: "mobile" | "tablet" | "desktop";
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
  className,
  deviceType = "mobile"
}) => {
  const isLastStep = currentStep === totalSteps - 1;
  const isLandscape = useMediaQuery("(orientation: landscape)");
  const isTablet = deviceType === "tablet";
  const useCompactButtons = isLandscape || useMediaQuery("(max-width: 400px)");
  
  // Tablet-specific optimized layout
  if (isTablet && !isLandscape) {
    return (
      <div className={cn("flex justify-between items-center py-3", className)}>
        <div>
          {currentStep > 0 && (
            <Button 
              variant="outline" 
              onClick={onPrev} 
              className="text-sm px-4"
              size={useCompactButtons ? "sm" : "default"}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {prevLabel || "Previous"}
            </Button>
          )}
        </div>
        
        <div className="flex gap-3">
          {!isLastStep && showSkip && (
            <Button 
              variant="ghost" 
              onClick={onClose} 
              className="text-sm"
              size={useCompactButtons ? "sm" : "default"}
            >
              {skipLabel || "Skip"}
            </Button>
          )}
          
          <Button 
            onClick={onNext} 
            className={cn(
              "text-sm px-4",
              isLastStep ? "bg-green-500 hover:bg-green-600" : ""
            )}
            size={useCompactButtons ? "sm" : "default"}
          >
            {isLastStep ? 
              (nextLabel || "Finish") : 
              (nextLabel || "Next")}
            {!isLastStep && <ChevronRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </div>
    );
  }
  
  // Use more compact UI for landscape or small screens
  if (useCompactButtons) {
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
  
  // Default mobile layout
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
