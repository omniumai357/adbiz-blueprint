
import React, { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { TourMedia } from "./tooltip/TourMedia";
import { TourStepIndicators } from "./tooltip/TourStepIndicators";
import { useTooltipPosition } from "./tooltip/useTooltipPosition";
import { useTooltipAnimation } from "./tooltip/useTooltipAnimation";
import { TourTooltipActions } from "./tooltip/TourTooltipActions";

type Position = "top" | "right" | "bottom" | "left";

interface TourTooltipProps {
  targetElement: HTMLElement;
  position?: Position;
  title: string;
  content: string;
  stepInfo: string;
  onPrev?: () => void;
  onNext: () => void;
  onClose: () => void;
  isLastStep: boolean;
  animation?: string;
  media?: {
    type: "image" | "video" | "gif";
    url: string;
    alt?: string;
    animation?: string;
  };
  nextLabel?: string;
  prevLabel?: string;
  skipLabel?: string;
  transition?: {
    type: "fade" | "slide" | "zoom" | "flip" | "none";
    direction?: "up" | "down" | "left" | "right";
    duration?: number;
  };
  spotlight?: {
    intensity?: "low" | "medium" | "high";
    color?: string;
    pulseEffect?: boolean;
    fadeBackground?: boolean;
  };
  currentStep: number;
  totalSteps: number;
  showKeyboardShortcuts?: () => void;
  tooltipRef?: React.RefObject<HTMLDivElement>;
}

export const TourTooltip = forwardRef<HTMLDivElement, TourTooltipProps>(({
  targetElement,
  position = "bottom",
  title,
  content,
  stepInfo,
  onPrev,
  onNext,
  onClose,
  isLastStep,
  animation = "fade-in",
  media,
  nextLabel,
  prevLabel,
  skipLabel,
  transition,
  spotlight,
  currentStep,
  totalSteps,
  showKeyboardShortcuts,
  tooltipRef
}, ref) => {
  // Use the provided ref or our own internal ref
  const divRef = tooltipRef || ref;

  // Use our custom hooks for positioning and animations
  const { 
    tooltipStyles, 
    arrowStyles, 
    arrowClassNames 
  } = useTooltipPosition(
    targetElement, 
    position, 
    transition?.duration || 300
  );
  
  const { 
    animationClass, 
    transitionClass,
    getSpotlightStyles 
  } = useTooltipAnimation(animation, transition);
  
  // Calculate progress percentage for the progress bar
  const progressValue = ((currentStep + 1) / totalSteps) * 100;
  
  // Combine spotlight styles with tooltip styles if necessary
  const combinedStyles = {
    ...tooltipStyles as React.CSSProperties,
    ...getSpotlightStyles(spotlight)
  };

  // Generate a unique ID for each tooltip
  const tooltipId = `tour-tooltip-${currentStep}`;
  const titleId = `${tooltipId}-title`;
  const contentId = `${tooltipId}-content`;
  const descriptionId = `${tooltipId}-description`;

  return (
    <div 
      className="fixed inset-0 z-[60] pointer-events-none overflow-hidden" 
      style={{ zIndex: 9999 }}
      role="region"
      aria-label={`Tour step ${currentStep + 1} of ${totalSteps}`}
    >
      <div 
        ref={divRef}
        className={cn(
          "absolute bg-popover text-popover-foreground rounded-lg shadow-lg p-4 w-80 pointer-events-auto border z-50",
          "focus-within:outline-none focus-within:ring-2 focus-within:ring-[#0ea5e9] focus-within:ring-offset-2",
          animationClass,
          transitionClass
        )}
        style={combinedStyles}
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
        
        {/* Content section */}
        <div className="mb-4 mt-1">
          <h3 id={titleId} className="font-medium text-lg">{title}</h3>
          
          {/* Media content */}
          {media && <TourMedia media={media} title={title} />}
          
          <p 
            id={contentId} 
            className="text-sm text-muted-foreground mt-2 leading-relaxed"
          >
            {content}
          </p>
          
          {/* Description for screen readers */}
          <span 
            id={descriptionId} 
            className="sr-only"
          >
            This is step {currentStep + 1} of {totalSteps}. 
            {onPrev ? 'You can navigate back to the previous step.' : ''}
            {isLastStep 
              ? 'This is the last step of the tour. You can finish the tour by clicking Done.' 
              : 'You can navigate to the next step by clicking Next.'
            }
          </span>
        </div>
        
        {/* Progress bar */}
        <Progress 
          value={progressValue} 
          className="h-1 mb-2" 
          aria-label={`Tour progress: ${currentStep + 1} of ${totalSteps} steps completed`}
        />
        
        {/* Step indicators (dots) */}
        {totalSteps <= 8 && (
          <TourStepIndicators 
            currentStep={currentStep} 
            totalSteps={totalSteps} 
          />
        )}
        
        {/* Action buttons */}
        <TourTooltipActions
          onPrev={onPrev}
          onNext={onNext}
          onClose={onClose}
          isLastStep={isLastStep}
          nextLabel={nextLabel}
          prevLabel={prevLabel}
          skipLabel={skipLabel}
          stepInfo={stepInfo}
          showKeyboardShortcuts={showKeyboardShortcuts}
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
      </div>
    </div>
  );
});

TourTooltip.displayName = "TourTooltip";
