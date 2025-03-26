
import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { useTooltipPosition } from "./tooltip/useTooltipPosition";
import { useTooltipAnimation } from "./tooltip/useTooltipAnimation";
import { TourTooltipActions } from "./tooltip/TourTooltipActions";
import { TourTooltipContent } from "./tooltip/TourTooltipContent";
import { TourTooltipContainer } from "./tooltip/TourTooltipContainer";

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
    <TourTooltipContainer
      ref={divRef}
      tooltipId={tooltipId}
      titleId={titleId}
      contentId={contentId}
      descriptionId={descriptionId}
      className={cn(animationClass, transitionClass)}
      style={combinedStyles}
      onClose={onClose}
      arrowStyles={arrowStyles}
      arrowClassNames={arrowClassNames}
      currentStep={currentStep}
      totalSteps={totalSteps}
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
    </TourTooltipContainer>
  );
});

TourTooltip.displayName = "TourTooltip";
