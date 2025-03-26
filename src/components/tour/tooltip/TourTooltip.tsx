
import React, { forwardRef, useCallback } from "react";
import { TourTooltipPositioner } from "./TourTooltipPositioner";
import { TourTooltipContent } from "./TourTooltipContent";
import { TourTooltipActions } from "./TourTooltipActions";
import { TourTooltipContainer } from "./TourTooltipContainer";

interface TourTooltipProps {
  targetElement: HTMLElement;
  position?: "top" | "right" | "bottom" | "left";
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
  // Generate unique IDs for accessibility
  const tooltipId = `tour-tooltip-${currentStep}`;
  const titleId = `${tooltipId}-title`;
  const contentId = `${tooltipId}-content`;
  const descriptionId = `${tooltipId}-description`;
  
  // Calculate arrow styles and classes based on position
  const calculateArrowStylesAndClasses = useCallback(() => {
    // Default arrow styles point to the top
    const defaultArrowStyles = { 
      top: '-6px',
      left: '50%',
      transform: 'translateX(-50%) rotate(45deg)',
      borderTop: '1px solid',
      borderLeft: '1px solid'
    };
    
    // Default arrow classes
    const defaultArrowClassNames = "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-t border-l";
    
    // Adjust arrow position based on tooltip position
    switch (position) {
      case "top":
        return {
          styles: {
            bottom: '-6px',
            left: '50%',
            transform: 'translateX(-50%) rotate(225deg)',
            borderBottom: '1px solid',
            borderRight: '1px solid'
          },
          classes: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-225 border-b border-r"
        };
      case "right":
        return {
          styles: {
            left: '-6px',
            top: '50%',
            transform: 'translateY(-50%) rotate(-45deg)',
            borderTop: '1px solid',
            borderLeft: '1px solid'
          },
          classes: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45 border-t border-l"
        };
      case "bottom":
        return {
          styles: {
            top: '-6px',
            left: '50%',
            transform: 'translateX(-50%) rotate(45deg)',
            borderTop: '1px solid',
            borderLeft: '1px solid'
          },
          classes: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-t border-l"
        };
      case "left":
        return {
          styles: {
            right: '-6px',
            top: '50%',
            transform: 'translateY(-50%) rotate(135deg)',
            borderBottom: '1px solid',
            borderLeft: '1px solid'
          },
          classes: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2 rotate-135 border-b border-l"
        };
      default:
        return { 
          styles: defaultArrowStyles, 
          classes: defaultArrowClassNames 
        };
    }
  }, [position]);
  
  const { styles: arrowStyles, classes: arrowClassNames } = calculateArrowStylesAndClasses();

  return (
    <TourTooltipContainer
      tooltipId={tooltipId}
      titleId={titleId}
      contentId={contentId}
      descriptionId={descriptionId}
      onClose={onClose}
      currentStep={currentStep}
      totalSteps={totalSteps}
      arrowStyles={arrowStyles}
      arrowClassNames={arrowClassNames}
      className=""
      style={{}}
    >
      <TourTooltipPositioner
        ref={ref}
        targetElement={targetElement}
        position={position}
        animation={animation}
        transition={transition}
        spotlight={spotlight}
        tooltipRef={tooltipRef}
      >
        <div className="relative bg-popover text-popover-foreground rounded-lg shadow-lg p-4 w-80 pointer-events-auto border z-50">
          <TourTooltipContent
            title={title}
            content={content}
            media={media}
            currentStep={currentStep}
            totalSteps={totalSteps}
            titleId={titleId}
            contentId={contentId}
            descriptionId={descriptionId}
          />
          
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
      </TourTooltipPositioner>
    </TourTooltipContainer>
  );
});

TourTooltip.displayName = "TourTooltip";
