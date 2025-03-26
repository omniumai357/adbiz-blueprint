
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, KeyRound } from "lucide-react";

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
  showKeyboardShortcuts
}) => {
  return (
    <div className="flex items-center justify-between mt-3">
      <div className="flex items-center gap-2">
        {/* Skip button or keyboard shortcut button */}
        {onPrev ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrev}
            className="text-xs px-2 h-8 focus-visible:ring-2 focus-visible:ring-[#0ea5e9] focus-visible:ring-offset-2 transition-all"
          >
            <ChevronLeft className="h-3.5 w-3.5 mr-1" />
            {prevLabel || "Previous"}
          </Button>
        ) : showKeyboardShortcuts ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={showKeyboardShortcuts}
            className="text-xs px-2 h-8 focus-visible:ring-2 focus-visible:ring-[#0ea5e9] focus-visible:ring-offset-2 transition-all"
            title="Show keyboard shortcuts (Shift+?)"
          >
            <KeyRound className="h-3.5 w-3.5 mr-1" />
            Shortcuts
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-xs px-2 h-8 focus-visible:ring-2 focus-visible:ring-[#0ea5e9] focus-visible:ring-offset-2 transition-all"
          >
            {skipLabel || "Skip"}
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Step info */}
        <span className="text-xs text-muted-foreground mr-2">{stepInfo}</span>

        {/* Next or Done button */}
        <Button
          variant="default"
          size="sm"
          onClick={onNext}
          className="text-xs px-3 h-8 focus-visible:ring-2 focus-visible:ring-[#0ea5e9] focus-visible:ring-offset-2 transition-all"
        >
          {isLastStep ? "Done" : nextLabel || "Next"}
          {!isLastStep && <ChevronRight className="h-3.5 w-3.5 ml-1" />}
        </Button>
      </div>
    </div>
  );
};
