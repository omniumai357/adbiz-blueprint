
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
    handleKeyNavigation,
  } = useTour();
  
  const { targetElement } = useTourElementFinder(isActive, currentStepData);
  const isMobile = useMediaQuery("(max-width: 640px)");

  // Add keyboard navigation event listener
  useEffect(() => {
    if (!isActive) return;
    
    // Use a keydown listener for the document to handle keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isActive) {
        // Convert DOM KeyboardEvent to React KeyboardEvent (simplified) for our handler
        handleKeyNavigation(e as unknown as React.KeyboardEvent);
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    
    // Clean up the event listener
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActive, handleKeyNavigation]);

  if (!isActive || !currentStepData) {
    return null;
  }

  // For mobile devices, use a drawer at the bottom of the screen
  if (isMobile) {
    return (
      <>
        <TourOverlay 
          targetElement={targetElement} 
          animation={currentStepData.animation?.highlight}
        />
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
      <TourOverlay 
        targetElement={targetElement} 
        animation={currentStepData.animation?.highlight}
      />
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
          animation={currentStepData.animation?.entry}
        />
      )}
    </>
  );
};
