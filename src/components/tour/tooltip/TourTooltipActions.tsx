
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface TourTooltipActionsProps {
  onPrev?: () => void;
  onNext: () => void;
  onClose: () => void;
  isLastStep: boolean;
  nextLabel?: string;
  prevLabel?: string;
  skipLabel?: string;
  stepInfo: string;
}

export const TourTooltipActions: React.FC<TourTooltipActionsProps> = ({
  onPrev,
  onNext,
  onClose,
  isLastStep,
  nextLabel,
  prevLabel,
  skipLabel,
  stepInfo
}) => {
  return (
    <div className="flex items-center justify-between mt-4">
      <span className="text-xs text-muted-foreground">{stepInfo}</span>
      <div className="flex gap-2">
        {!isLastStep && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose} 
            className="h-8 text-xs"
          >
            {skipLabel || "Skip"}
          </Button>
        )}
        {onPrev && (
          <Button size="sm" variant="outline" onClick={onPrev} className="h-8">
            <ChevronLeft className="h-4 w-4 mr-1" />
            {prevLabel || "Prev"}
          </Button>
        )}
        <Button 
          size="sm" 
          onClick={onNext} 
          className={cn("h-8", isLastStep ? "" : "animate-pulse-subtle")}
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
