
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

  return (
    <TourTooltipContainer
      tooltipId={tooltipId}
      titleId={titleId}
      contentId={contentId}
      descriptionId={descriptionId}
      onClose={onClose}
      currentStep={currentStep}
      totalSteps={totalSteps}
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
        <div 
          className="relative bg-popover text-popover-foreground rounded-lg shadow-lg p-4 w-80 pointer-events-auto border z-50"
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={`${contentId} ${descriptionId}`}
          id={tooltipId}
        >
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
