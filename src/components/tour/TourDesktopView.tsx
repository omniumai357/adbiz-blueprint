
import React from "react";
import { TourOverlay } from "./TourOverlay";
import { TourTooltip } from "./TourTooltip";
import { TourStep } from "@/contexts/tour-context";

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
  entryAnimation
}) => {
  const isLastStep = currentStep === totalSteps - 1;
  const nextLabel = currentStepData.actions?.next?.label;
  const prevLabel = currentStepData.actions?.prev?.label;
  const skipLabel = currentStepData.actions?.skip?.label;

  return (
    <>
      <TourOverlay 
        targetElement={targetElement} 
        animation={highlightAnimation}
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
        />
      )}
    </>
  );
};
