
import React from "react";
import { TourStep } from "@/contexts/tour/types";
import { TourBottomSheetView } from "./TourBottomSheetView";
import { TourMobileCompactView } from "./TourMobileCompactView";

interface MobileTourViewProps {
  step: TourStep;
  isOpen: boolean;
  isLandscape: boolean;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  isLastStep: boolean;
  direction: "ltr" | "rtl";
}

/**
 * MobileTourView Component
 * 
 * A responsive component that chooses between bottom sheet or compact view
 * based on device orientation.
 */
export const MobileTourView: React.FC<MobileTourViewProps> = ({
  step,
  isOpen,
  isLandscape,
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onClose,
  isLastStep,
  direction
}) => {
  const isRTL = direction === "rtl";
  
  // Select the appropriate view based on orientation
  if (isLandscape) {
    return (
      <TourMobileCompactView
        title={step.title}
        content={step.content}
        currentStep={currentStep}
        totalSteps={totalSteps}
        onNext={onNext}
        onPrev={onPrev}
        onClose={onClose}
        isRTL={isRTL}
        media={step.media}
      />
    );
  }
  
  return (
    <TourBottomSheetView
      step={step}
      isOpen={isOpen}
      onClose={onClose}
      onNext={onNext}
      onPrev={onPrev}
      currentStep={currentStep}
      totalSteps={totalSteps}
      isLastStep={isLastStep}
      direction={direction}
    />
  );
};
