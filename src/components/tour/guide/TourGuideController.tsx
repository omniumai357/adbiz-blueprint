
import React, { useState, useRef, useCallback } from "react";
import { useTour } from "@/contexts/tour";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTourElementFinder } from "@/hooks/tour/useTourElementFinder";
import { useTourDynamicContent } from "@/hooks/tour/useTourDynamicContent";
import { useTourInteractions } from "@/hooks/tour/useTourInteractions";
import { useUserContext } from "@/hooks/tour/useUserContext";
import { useTourCompletionTracker } from "@/hooks/tour/useTourCompletionTracker";
import { useTourKeyboardNavigation } from "@/hooks/tour/useTourKeyboardNavigation";
import { useTourFocusTrap } from "@/hooks/tour/useTourFocusTrap";
import { TourMobileView } from "../TourMobileView";
import { TourDesktopView, TourDesktopViewHandle } from "../TourDesktopView";
import { TourPathVisualization } from "./TourPathVisualization";
import { TourKeyboardShortcutsHelp } from "./TourKeyboardShortcutsHelp";
import { KeyboardShortcutsProvider, useKeyboardShortcuts } from "@/contexts/tour/KeyboardShortcutsContext";
import { TourLiveAnnouncer } from "../accessibility/TourLiveAnnouncer";
import { TourFocusStyles } from "../accessibility/TourFocusStyles";
import { TourEventListeners } from "../events/TourEventListeners";
import { TourFocusManager } from "../accessibility/TourFocusManager";
import { TourPathManager } from "../path/TourPathManager";
import { TourStepFocusManager } from "../accessibility/TourStepFocusManager";

const TourGuideControllerInner: React.FC = () => {
  const {
    isActive,
    currentStepData,
    nextStep,
    prevStep,
    goToStep,
    currentStep,
    totalSteps,
    endTour,
    handleKeyNavigation,
    currentPath,
    availablePaths,
    setDynamicContent,
    visibleSteps,
  } = useTour();
  
  const { targetElement } = useTourElementFinder(isActive, currentStepData);
  
  const [pathTargetElement, setPathTargetElement] = useState<HTMLElement | null>(null);
  const [lastStepIndex, setLastStepIndex] = useState<number>(-1);
  const { showKeyboardHelp, showKeyboardShortcutsHelp, closeKeyboardShortcutsHelp } = useKeyboardShortcuts();

  const tooltipRef = useRef<HTMLDivElement>(null);
  const desktopViewRef = useRef<TourDesktopViewHandle>(null);
  
  const isMobile = useIsMobile();
  const { userId, userType } = useUserContext();
  
  useTourCompletionTracker(isActive, currentStep, totalSteps, currentPath);
  
  useTourKeyboardNavigation(
    isActive, 
    (event, navigationAction) => {
      if (navigationAction === 'show_shortcuts_help') {
        showKeyboardShortcutsHelp();
      } else {
        handleKeyNavigation(event as any);
      }
    },
    {
      enableHomeEndKeys: true,
      enablePageKeys: true,
      pageKeyJumpSize: 3,
      enableShortcutsHelp: true
    }
  );
  
  const { focusElement, focusElementByIndex } = useTourFocusTrap(isActive, tooltipRef, true);
  
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

  const handlePathTargetChange = useCallback((element: HTMLElement | null) => {
    setPathTargetElement(element);
  }, []);

  if (!isActive || !currentStepData) {
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

  return (
    <>
      <TourFocusStyles />
      
      <TourFocusManager 
        isActive={isActive} 
        currentStepData={currentStepData} 
      />
      
      <TourLiveAnnouncer 
        isActive={isActive} 
        currentStepData={currentStepData} 
      />
      
      <TourStepFocusManager 
        isActive={isActive}
        currentStepData={currentStepData}
        lastStepIndex={lastStepIndex}
        setLastStepIndex={setLastStepIndex}
        focusElement={focusElement}
      />
      
      <TourPathManager 
        isActive={isActive}
        currentStepData={currentStepData}
        onPathTargetChange={handlePathTargetChange}
      />
      
      <TourPathVisualization 
        isActive={!!currentStepData.path?.enabled && !!targetElement && !!pathTargetElement}
        sourceElement={targetElement}
        targetElement={pathTargetElement}
        pathOptions={currentStepData.path}
      />

      {showKeyboardHelp && (
        <TourKeyboardShortcutsHelp onClose={closeKeyboardShortcutsHelp} />
      )}

      <TourEventListeners 
        handleNext={handleNext}
        handlePrev={handlePrev}
        handleClose={handleClose}
      />

      {isMobile ? (
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
        />
      )}
    </>
  );
};

// Wrap the component with the KeyboardShortcutsProvider
export const TourGuideController: React.FC = () => {
  return (
    <KeyboardShortcutsProvider>
      <TourGuideControllerInner />
    </KeyboardShortcutsProvider>
  );
};
