
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TourMobileActionsProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  prevLabel?: string;
  nextLabel?: string;
  skipLabel?: string;
}

export const TourMobileActions: React.FC<TourMobileActionsProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onClose,
  prevLabel,
  nextLabel,
  skipLabel
}) => {
  const isLastStep = currentStep === totalSteps - 1;
  
  return (
    <div className="flex flex-row justify-between pt-2 pb-4">
      <div className="flex gap-2">
        {currentStep > 0 && (
          <Button variant="outline" size="sm" onClick={onPrev}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            {prevLabel || "Previous"}
          </Button>
        )}
      </div>
      <div className="flex gap-2">
        {!isLastStep && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            {skipLabel || "Skip"}
          </Button>
        )}
        <Button 
          size="sm" 
          onClick={onNext} 
          className={cn("animate-pulse-subtle", isLastStep ? "bg-green-500 hover:bg-green-600" : "")}
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
