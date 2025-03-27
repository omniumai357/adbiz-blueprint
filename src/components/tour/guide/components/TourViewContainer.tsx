
import React, { useRef } from "react";
import { useTour } from "@/contexts/tour";
import { useDevice } from "@/hooks/use-mobile";
import { useTourInteractions } from "@/hooks/tour/useTourInteractions";
import { useTourDynamicContent } from "@/hooks/tour/useTourDynamicContent";
import { useUserContext } from "@/hooks/tour/useUserContext";
import { TourMobileView } from "../../TourMobileView";
import { TourDesktopView, TourDesktopViewHandle } from "../../TourDesktopView";
import { useKeyboardShortcuts } from "@/contexts/tour/KeyboardShortcutsContext";
import { TourPath } from "@/contexts/tour/types";

export interface TourViewContainerProps {
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
  
  // Extract the currentPathId safely
  const currentPathId = typeof currentPath === 'string' ? 
    currentPath : 
    currentPath ? currentPath.id : null;
  
  const { content } = useTourDynamicContent(currentStepData, setDynamicContent);
  
  const { handleNext, handlePrev, handleClose } = useTourInteractions(
    currentStepData,
    currentPathId,
    availablePaths,
    currentStep,
    userId,
    userType,
    { nextStep, prevStep, endTour }
  );
  
  if (!currentStepData) {
    return null;
  }
  
  // Handle the animation property which can be string or object
  const animationObj = typeof currentStepData.animation === 'string' ?
    { highlight: "pulse", entry: currentStepData.animation } :
    currentStepData.animation || { highlight: "pulse", entry: "fade-in" };
    
  const highlightAnimation = animationObj.highlight || "pulse";
  const entryAnimation = animationObj.entry || "fade-in";
  
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
      deviceType={deviceType as "mobile" | "tablet" | "desktop"}
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
      isRTL={isRTL}
      direction={direction}
    />
  );
};
