
import React from "react";
import { TourOverlay } from "./TourOverlay";
import { TourTooltip } from "./TourTooltip";
import { TourStep } from "@/contexts/tour-context";
import { scrollToElement } from "@/lib/utils/dom-utils";
import { Progress } from "@/components/ui/progress";

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
  
  const [progressValue, setProgressValue] = React.useState(0);
  const [isScrolling, setIsScrolling] = React.useState(false);
  
  // Update progress when step changes
  React.useEffect(() => {
    setProgressValue(((currentStep + 1) / totalSteps) * 100);
  }, [currentStep, totalSteps]);
  
  // Ensure target element is scrolled into view with a smooth animation
  React.useEffect(() => {
    if (targetElement && targetElement.id) {
      setIsScrolling(true);
      // Scroll element into view with smooth animation and offset
      const timeout = setTimeout(() => {
        scrollToElement(targetElement.id, 'smooth', { offsetY: 100 });
        // Reset scrolling state after animation completes
        setTimeout(() => setIsScrolling(false), 500);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [targetElement, currentStep]);

  // Default transition if none is provided
  const defaultTransition = {
    type: transition?.type || "fade",
    direction: transition?.direction || "right",
    duration: transition?.duration || 300
  };

  // Generate step indicator dots
  const renderStepDots = () => {
    return (
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-background/90 px-4 py-2 rounded-full shadow-md z-[9999]">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div 
            key={index}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
              index === currentStep 
                ? "bg-primary scale-125" 
                : index < currentStep 
                  ? "bg-primary/60" 
                  : "bg-gray-300"
            }`}
            aria-label={`Step ${index + 1} of ${totalSteps}`}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <TourOverlay 
        targetElement={targetElement} 
        animation={highlightAnimation}
        spotlight={spotlight}
        transition={defaultTransition}
      />
      
      {/* Overall tour progress - visible at top of screen */}
      <div className="fixed top-0 left-0 right-0 z-[9999] px-4 py-1 bg-background/90">
        <Progress value={progressValue} className="h-1" />
      </div>

      {targetElement && !isScrolling && (
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
      
      {/* Step indicator dots */}
      {totalSteps > 1 && renderStepDots()}
    </>
  );
};
