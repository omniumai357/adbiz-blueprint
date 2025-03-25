
import React, { useEffect, useState } from "react";
import { useTour } from "@/contexts/tour-context";
import { TourTooltip } from "./TourTooltip";
import { TourOverlay } from "./TourOverlay";
import { TourDrawer } from "./TourDrawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useTourElementFinder } from "@/hooks/tour/useTourElementFinder";

export const TourGuide: React.FC = () => {
  const {
    isActive,
    currentStepData,
    nextStep,
    prevStep,
    currentStep,
    totalSteps,
    endTour,
  } = useTour();
  
  const { targetElement } = useTourElementFinder(isActive, currentStepData);
  const isMobile = useMediaQuery("(max-width: 640px)");

  if (!isActive || !currentStepData) {
    return null;
  }

  // For mobile devices, use a drawer at the bottom of the screen
  if (isMobile) {
    return (
      <>
        <TourOverlay targetElement={targetElement} />
        <TourDrawer 
          title={currentStepData.title}
          content={currentStepData.content}
          currentStep={currentStep}
          totalSteps={totalSteps}
          onNext={nextStep}
          onPrev={prevStep}
          onClose={endTour}
        />
      </>
    );
  }

  // For desktop, use tooltips that point to elements
  return (
    <>
      <TourOverlay targetElement={targetElement} />
      {targetElement && (
        <TourTooltip
          targetElement={targetElement}
          position={currentStepData.position || "bottom"}
          title={currentStepData.title}
          content={currentStepData.content}
          stepInfo={`${currentStep + 1} of ${totalSteps}`}
          onPrev={currentStep > 0 ? prevStep : undefined}
          onNext={nextStep}
          onClose={endTour}
          isLastStep={currentStep === totalSteps - 1}
        />
      )}
    </>
  );
};
