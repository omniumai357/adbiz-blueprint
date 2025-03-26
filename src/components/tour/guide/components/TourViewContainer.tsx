
import React, { useRef } from "react";
import { useTour } from "@/contexts/tour";
import { useDevice } from "@/hooks/use-mobile";
import { useTourInteractions } from "@/hooks/tour/useTourInteractions";
import { useTourDynamicContent } from "@/hooks/tour/useTourDynamicContent";
import { useUserContext } from "@/hooks/tour/useUserContext";
import { TourMobileView } from "../../TourMobileView";
import { TourDesktopView, TourDesktopViewHandle } from "../../TourDesktopView";
import { useKeyboardShortcuts } from "@/contexts/tour/KeyboardShortcutsContext";

interface TourViewContainerProps {
  targetElement: HTMLElement | null;
}

export const TourViewContainer: React.FC<TourViewContainerProps> = ({ targetElement }) => {
  const {
    currentStepData,
    currentStep,
    totalSteps,
    currentPath,
    availablePaths,
    nextStep,
    prevStep,
    endTour,
    setDynamicContent
  } = useTour();
  
  const { userId, userType } = useUserContext();
  const { deviceType, isMobile, isTablet, hasTouchCapability } = useDevice();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const desktopViewRef = useRef<TourDesktopViewHandle>(null);
  const { showKeyboardShortcutsHelp } = useKeyboardShortcuts();
  
  const { content } = useTourDynamicContent(currentStepData, setDynamicContent);
  
  const { handleNext, handlePrev, handleClose } = useTourInteractions(
    currentStepData,
    currentPath,
    availablePaths,
    currentStep,
    userId,
    userType,
    { nextStep, prevStep, endTour }
  );
  
  if (!currentStepData) {
    return null;
  }
  
  const highlightAnimation = currentStepData.animation?.highlight || "pulse";
  const entryAnimation = currentStepData.animation?.entry || "fade-in";
  
  const transition = currentStepData.transition || {
    type: "fade" as const,
    direction: "right" as const,
    duration: 300
  };
  
  const supportedTransition = {
    type: (['fade', 'slide', 'zoom', 'flip', 'none'].includes(transition.type) 
      ? transition.type 
      : 'fade') as 'fade' | 'slide' | 'zoom' | 'flip' | 'none',
    direction: transition.direction,
    duration: transition.duration
  };
  
  const spotlight = currentStepData.spotlight;
  
  // Enhanced device-specific rendering
  // Use mobile view for mobile devices and tablets in portrait mode
  const useMobileView = isMobile || (isTablet && hasTouchCapability);
  
  return useMobileView ? (
    <TourMobileView
      currentStepData={currentStepData}
      content={content}
      targetElement={targetElement}
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={handleNext}
      onPrev={handlePrev}
      onClose={handleClose}
      highlightAnimation={highlightAnimation}
      transition={supportedTransition}
      spotlight={spotlight}
      onShowKeyboardShortcuts={showKeyboardShortcutsHelp}
      deviceType={deviceType}
    />
  ) : (
    <TourDesktopView
      ref={desktopViewRef}
      targetElement={targetElement!}
      position={currentStepData.position?.includes('-') 
        ? currentStepData.position.split('-')[0] as 'top' | 'right' | 'bottom' | 'left' 
        : (currentStepData.position || 'bottom') as 'top' | 'right' | 'bottom' | 'left'}
      title={currentStepData.title}
      content={content}
      stepInfo={`${currentStep + 1} of ${totalSteps}`}
      onPrev={currentStep > 0 ? handlePrev : undefined}
      onNext={handleNext}
      onClose={handleClose}
      isLastStep={currentStep === totalSteps - 1}
      animation={entryAnimation}
      media={currentStepData.media}
      nextLabel={currentStepData.actions?.next?.label}
      prevLabel={currentStepData.actions?.prev?.label}
      skipLabel={currentStepData.actions?.skip?.label}
      transition={supportedTransition}
      spotlight={spotlight}
      currentStep={currentStep}
      totalSteps={totalSteps}
      showKeyboardShortcuts={showKeyboardShortcutsHelp}
      tooltipRef={tooltipRef}
      hasTouchCapability={hasTouchCapability}
    />
  );
};
