
import React, { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TourTooltipContainerProps {
  children: React.ReactNode;
  tooltipId: string;
  titleId: string;
  contentId: string;
  descriptionId: string;
  className?: string;
  style?: React.CSSProperties;
  onClose: () => void;
  arrowStyles: React.CSSProperties;
  arrowClassNames: string;
  currentStep: number;
  totalSteps: number;
}

export const TourTooltipContainer = forwardRef<HTMLDivElement, TourTooltipContainerProps>(({
  children,
  tooltipId,
  titleId,
  contentId,
  descriptionId,
  className,
  style,
  onClose,
  arrowStyles,
  arrowClassNames,
  currentStep,
  totalSteps
}, ref) => {
  return (
    <div 
      className="fixed inset-0 z-[60] pointer-events-none overflow-hidden" 
      style={{ zIndex: 9999 }}
      role="region"
      aria-label={`Tour step ${currentStep + 1} of ${totalSteps}`}
    >
      <div 
        ref={ref}
        className={cn(
          "absolute tour-tooltip pointer-events-auto z-50",
          "bg-[color:var(--tour-tooltip-bg)] text-[color:var(--tour-tooltip-text)] rounded-lg p-4 w-80 border border-[color:var(--tour-tooltip-border)]",
          "focus-within:outline-none focus-within:ring-2 focus-within:ring-[color:var(--tour-accent-blue)] focus-within:ring-offset-2",
          "shadow-[var(--tour-tooltip-shadow)]",
          className
        )}
        style={style}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={`${contentId} ${descriptionId}`}
        id={tooltipId}
        aria-live="polite"
      >
        {/* Skip repetitive content link - visually hidden but available to screen readers */}
        <Button
          variant="link"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-10 focus:text-xs focus:p-1"
          data-tour-action="skip-repetitive"
          aria-label="Skip repetitive content"
          tabIndex={0}
          onClick={(e) => {
            // Prevent event bubbling
            e.stopPropagation();
            
            // Find the next button and focus it, skipping repetitive content
            const nextButton = document.querySelector('[data-tour-action="next"]') as HTMLElement;
            if (nextButton) {
              nextButton.focus();
            }
          }}
        >
          Skip to actions
        </Button>
        
        {/* Arrow */}
        <div 
          className={cn(
            "absolute w-3 h-3 bg-[color:var(--tour-tooltip-bg)] border-[color:var(--tour-tooltip-border)]",
            arrowClassNames
          )}
          style={arrowStyles as React.CSSProperties}
          aria-hidden="true"
        />
        
        {/* Close button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 h-6 w-6 hover:bg-[color:var(--tour-bg-tertiary)] focus-visible:ring-2 focus-visible:ring-[color:var(--tour-accent-blue)] focus-visible:ring-offset-2" 
          onClick={onClose}
          aria-label="Close tour"
          data-tour-action="close"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </Button>
        
        {/* Content rendered by children */}
        {children}
      </div>
    </div>
  );
});

TourTooltipContainer.displayName = "TourTooltipContainer";
