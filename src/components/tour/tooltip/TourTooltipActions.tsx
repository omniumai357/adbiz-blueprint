
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Keyboard } from "lucide-react";
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
  showKeyboardShortcuts?: () => void;
  currentStep: number;
  totalSteps: number;
  isRTL?: boolean;
}

export const TourTooltipActions: React.FC<TourTooltipActionsProps> = ({
  onPrev,
  onNext,
  onClose,
  isLastStep,
  nextLabel = "Next",
  prevLabel = "Back",
  skipLabel = "Skip",
  stepInfo,
  showKeyboardShortcuts,
  currentStep,
  totalSteps,
  isRTL = false
}) => {
  // Swap chevron icons for RTL
  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <div className="mt-4 space-y-3">
      {/* Step indicator */}
      <div className="flex items-center justify-between text-sm text-[color:var(--tour-tooltip-text-secondary)]">
        <span>{stepInfo}</span>
        
        {showKeyboardShortcuts && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={showKeyboardShortcuts}
            data-tour-action="show-shortcuts"
          >
            <Keyboard className="h-3 w-3 mr-1" />
            <span>Shortcuts</span>
          </Button>
        )}
      </div>
      
      {/* Action buttons */}
      <div className={cn(
        "flex items-center",
        onPrev ? "justify-between" : "justify-end"
      )}>
        {/* Previous button - only shown if not on first step */}
        {onPrev && (
          <Button
            variant="outline"
            size="sm"
            onClick={onPrev}
            className="text-[color:var(--tour-tooltip-text)] border-[color:var(--tour-tooltip-border)]"
            data-tour-action="prev"
          >
            <PrevIcon className="h-4 w-4 mr-1" />
            <span>{prevLabel}</span>
          </Button>
        )}
        
        <div className="flex items-center space-x-2">
          {!isLastStep && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-[color:var(--tour-tooltip-text)] border-[color:var(--tour-tooltip-border)]"
              data-tour-action="skip"
            >
              {skipLabel}
            </Button>
          )}
          
          <Button
            variant="default"
            size="sm"
            onClick={onNext}
            className="bg-[color:var(--tour-tooltip-accent)] hover:bg-[color:var(--tour-tooltip-accent-hover)]"
            data-tour-action="next"
          >
            <span>{isLastStep ? "Finish" : nextLabel}</span>
            {!isLastStep && <NextIcon className="h-4 w-4 ml-1" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
