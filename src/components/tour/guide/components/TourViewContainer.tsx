
import React, { useState, useEffect, useRef } from "react";
import { useTour } from "@/contexts/tour";
import { TourDesktopView } from "../../TourDesktopView";
import { TourMobileView } from "../../TourMobileView";
import { useKeyboardShortcuts } from "@/contexts/tour/KeyboardShortcutsContext";
import { useDevice } from "@/hooks/use-mobile";

interface TourViewContainerProps {
  targetElement: HTMLElement | null;
  isRTL?: boolean;
  direction?: 'ltr' | 'rtl';
}

export const TourViewContainer: React.FC<TourViewContainerProps> = ({ 
  targetElement, 
  isRTL = false,
  direction = 'ltr'
}) => {
  const {
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    endTour,
    currentStepData,
    currentPathData,
  } = useTour();
  
  const { showKeyboardShortcutsHelp } = useKeyboardShortcuts();
  const { isMobile, hasTouchCapability } = useDevice();
  
  const [tooltipPosition, setTooltipPosition] = useState<"top" | "right" | "bottom" | "left">("bottom");
  const desktopViewRef = useRef(null);
  
  // Determine position based on step data and screen size
  useEffect(() => {
    if (currentStepData && currentPathData) {
      // Default position to bottom if not specified
      const position = currentStepData.position || "bottom";
      setTooltipPosition(position as "top" | "right" | "bottom" | "left");
    }
  }, [currentStepData, currentPathData]);

  if (!targetElement || !currentStepData) {
    return null;
  }

  // Create step info text
  const stepInfo = `Step ${currentStep + 1} of ${totalSteps}`;
  
  // Determine if current step is the last one
  const isLastStep = currentStep === totalSteps - 1;
  
  // Choose between mobile and desktop view
  if (isMobile) {
    return (
      <TourMobileView
        currentStepData={currentStepData}
        content={currentStepData.content || ""}
        targetElement={targetElement}
        currentStep={currentStep}
        totalSteps={totalSteps}
        onNext={nextStep}
        onPrev={currentStep > 0 ? prevStep : undefined}
        onClose={endTour}
        highlightAnimation={typeof currentStepData.animation === 'string' ? currentStepData.animation : 'fade-in'}
        transition={currentStepData.transition}
        spotlight={currentStepData.spotlight}
        onShowKeyboardShortcuts={showKeyboardShortcutsHelp}
        deviceType="mobile"
      />
    );
  }
  
  return (
    <TourDesktopView
      ref={desktopViewRef}
      targetElement={targetElement}
      position={tooltipPosition}
      title={currentStepData.title || "Tour"}
      content={currentStepData.content || ""}
      stepInfo={stepInfo}
      onNext={nextStep}
      onPrev={currentStep > 0 ? prevStep : undefined}
      onClose={endTour}
      isLastStep={isLastStep}
      currentStep={currentStep}
      totalSteps={totalSteps}
      showKeyboardShortcuts={showKeyboardShortcutsHelp}
      hasTouchCapability={hasTouchCapability}
      isRTL={isRTL}
      direction={direction}
    />
  );
};
