
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, KeyRound } from "lucide-react";
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
  currentStep?: number;
  totalSteps?: number;
}

export const TourTooltipActions: React.FC<TourTooltipActionsProps> = ({
  onPrev,
  onNext,
  onClose,
  isLastStep,
  nextLabel,
  prevLabel,
  skipLabel,
  stepInfo,
  showKeyboardShortcuts,
  currentStep = 0,
  totalSteps = 1
}) => {
  const buttonBaseClasses = "text-xs transition-all focus-visible:ring-2 focus-visible:ring-[color:var(--tour-accent-blue)] focus-visible:ring-offset-2";
  
  return (
    <div 
      className="flex items-center justify-between mt-3"
      role="group"
      aria-label="Tour navigation"
    >
      <div className="flex items-center gap-2">
        {/* Skip button or keyboard shortcut button */}
        {onPrev ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrev}
            className={cn(
              buttonBaseClasses,
              "px-2 h-8 text-[color:var(--tour-text-secondary)] hover:bg-[color:var(--tour-button-secondary-hover-bg)] hover:text-[color:var(--tour-text-primary)]"
            )}
            aria-label={`Previous step: ${prevLabel || "Previous"}`}
            data-tour-action="previous"
            data-autofocus={currentStep > 0 ? "true" : undefined}
            title="Previous (Keyboard: Left Arrow or P)"
          >
            <ChevronLeft className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
            {prevLabel || "Previous"}
          </Button>
        ) : showKeyboardShortcuts ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={showKeyboardShortcuts}
            className={cn(
              buttonBaseClasses,
              "px-2 h-8 text-[color:var(--tour-text-secondary)] hover:bg-[color:var(--tour-button-secondary-hover-bg)] hover:text-[color:var(--tour-text-primary)]"
            )}
            title="Show keyboard shortcuts (Shift+?)"
            aria-label="Show keyboard shortcuts"
            data-tour-action="shortcuts"
          >
            <KeyRound className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
            Shortcuts
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className={cn(
              buttonBaseClasses,
              "px-2 h-8 text-[color:var(--tour-text-secondary)] hover:bg-[color:var(--tour-button-secondary-hover-bg)] hover:text-[color:var(--tour-text-primary)]"
            )}
            aria-label={`Skip tour: ${skipLabel || "Skip"}`}
            data-tour-action="skip"
            title="Skip tour (Keyboard: Escape)"
          >
            {skipLabel || "Skip"}
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Step info */}
        <span 
          className="text-xs text-[color:var(--tour-text-tertiary)] mr-2"
          aria-live="polite"
          aria-atomic="true"
        >
          {stepInfo}
        </span>

        {/* Next or Done button */}
        <Button
          variant="default"
          size="sm"
          onClick={onNext}
          className={cn(
            buttonBaseClasses,
            "px-3 h-8 bg-[color:var(--tour-button-primary-bg)] text-[color:var(--tour-button-primary-text)] hover:bg-[color:var(--tour-button-primary-hover-bg)]"
          )}
          aria-label={isLastStep ? `Finish tour: Done` : `Next step: ${nextLabel || "Next"}`}
          data-tour-action={isLastStep ? "finish" : "next"}
          data-tour-next="true"
          data-autofocus={currentStep === 0 || isLastStep ? "true" : undefined}
          title={isLastStep ? "Finish tour (Keyboard: Enter)" : "Next step (Keyboard: Right Arrow or N)"}
        >
          {isLastStep ? "Done" : nextLabel || "Next"}
          {!isLastStep && <ChevronRight className="h-3.5 w-3.5 ml-1" aria-hidden="true" />}
        </Button>
      </div>
    </div>
  );
};
