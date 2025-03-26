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
          "absolute bg-popover text-popover-foreground rounded-lg shadow-lg p-4 w-80 pointer-events-auto border z-50",
          "focus-within:outline-none focus-within:ring-2 focus-within:ring-[#0ea5e9] focus-within:ring-offset-2",
          className
        )}
        style={style}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={`${contentId} ${descriptionId}`}
        id={tooltipId}
      >
        {/* Arrow */}
        <div 
          className={cn(
            "absolute w-3 h-3 bg-popover border-popover",
            arrowClassNames
          )}
          style={arrowStyles as React.CSSProperties}
          aria-hidden="true"
        />
        
        {/* Close button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 h-6 w-6 hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-[#0ea5e9] focus-visible:ring-offset-2" 
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
