
import React from "react";
import { TourOverlay } from "./TourOverlay";
import { TourTooltip } from "./TourTooltip";
import { TourStep } from "@/contexts/tour-context";
import { scrollToElement } from "@/lib/utils/dom-utils";

interface TourDesktopViewProps {
  currentStepData: TourStep;
  content: string;
  targetElement: HTMLElement | null;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  highlightAnimation: string;
  entryAnimation: string;
  exitAnimation?: string;
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
}

export const TourDesktopView: React.FC<TourDesktopViewProps> = ({
  currentStepData,
  content,
  targetElement,
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onClose,
  highlightAnimation,
  entryAnimation,
  exitAnimation,
  transition,
  spotlight
}) => {
  const isLastStep = currentStep === totalSteps - 1;
  const nextLabel = currentStepData.actions?.next?.label;
  const prevLabel = currentStepData.actions?.prev?.label;
  const skipLabel = currentStepData.actions?.skip?.label;
  
  // Ensure target element is scrolled into view with a smooth animation
  React.useEffect(() => {
    if (targetElement && targetElement.id) {
      // Scroll element into view with smooth animation and offset
      setTimeout(() => {
        scrollToElement(targetElement.id, 'smooth');
      }, 100);
    }
  }, [targetElement, currentStep]);

  // Default transition if none is provided
  const defaultTransition = {
    type: transition?.type || "fade",
    direction: transition?.direction || "right",
    duration: transition?.duration || 300
  };

  return (
    <>
      <TourOverlay 
        targetElement={targetElement} 
        animation={highlightAnimation}
        spotlight={spotlight}
        transition={defaultTransition}
      />
      {targetElement && (
        <TourTooltip
          targetElement={targetElement}
          position={currentStepData.position || "bottom"}
          title={currentStepData.title}
          content={content}
          media={currentStepData.media}
          stepInfo={`${currentStep + 1} of ${totalSteps}`}
          onPrev={currentStep > 0 ? onPrev : undefined}
          onNext={onNext}
          onClose={onClose}
          nextLabel={nextLabel}
          prevLabel={prevLabel}
          skipLabel={skipLabel}
          isLastStep={isLastStep}
          animation={entryAnimation}
          transition={defaultTransition}
          spotlight={spotlight}
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
      )}
    </>
  );
};
