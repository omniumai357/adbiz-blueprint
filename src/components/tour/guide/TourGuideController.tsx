
import React, { useEffect, useState, useRef } from "react";
import { useTour } from "@/contexts/tour";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTourElementFinder } from "@/hooks/tour/useTourElementFinder";
import { useTourDynamicContent } from "@/hooks/tour/useTourDynamicContent";
import { useTourInteractions } from "@/hooks/tour/useTourInteractions";
import { useUserContext } from "@/hooks/tour/useUserContext";
import { useTourCompletionTracker } from "@/hooks/tour/useTourCompletionTracker";
import { useTourKeyboardNavigation } from "@/hooks/tour/useTourKeyboardNavigation";
import { TourMobileView } from "../TourMobileView";
import { TourDesktopView } from "../TourDesktopView";
import { TourPathVisualization } from "./TourPathVisualization";

export const TourGuideController: React.FC = () => {
  const {
    isActive,
    currentStepData,
    nextStep,
    prevStep,
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
  
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const isMobile = useIsMobile();
  
  const { userId, userType } = useUserContext();
  
  useTourCompletionTracker(isActive, currentStep, totalSteps, currentPath);
  
  useTourKeyboardNavigation(isActive, (event) => {
    handleKeyNavigation(event as any);
  });
  
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

  useEffect(() => {
    if (
      isActive && 
      currentStepData?.path?.enabled && 
      currentStepData?.path?.targetElementId
    ) {
      const targetId = currentStepData.path.targetElementId;
      const element = document.getElementById(targetId);
      
      if (element) {
        setPathTargetElement(element);
      } else {
        try {
          const potentialElement = document.querySelector(
            `#${targetId}, .${targetId}, [data-tour-id="${targetId}"]`
          );
          if (potentialElement instanceof HTMLElement) {
            setPathTargetElement(potentialElement);
          }
        } catch (e) {
          console.warn(`Path target element not found: ${targetId}`);
          setPathTargetElement(null);
        }
      }
    } else {
      setPathTargetElement(null);
    }
  }, [isActive, currentStepData]);

  useEffect(() => {
    if (isActive) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [isActive]);

  useEffect(() => {
    if (isActive && currentStepData) {
      let liveRegion = document.getElementById('tour-announcer');
      if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'tour-announcer';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
      }
      
      const stepNumber = currentStep + 1;
      let announcement = `Step ${stepNumber} of ${totalSteps}: ${currentStepData.title}. ${content}`;
      
      if (isMobile) {
        announcement += '. You can swipe left to continue or swipe right to go back.';
      } else {
        announcement += '. Use arrow keys to navigate.';
      }
      
      liveRegion.textContent = announcement;
    }
  }, [isActive, currentStepData, currentStep, totalSteps, content, isMobile]);

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
      <TourPathVisualization 
        isActive={!!currentStepData.path?.enabled && !!targetElement && !!pathTargetElement}
        sourceElement={targetElement}
        targetElement={pathTargetElement}
        pathOptions={currentStepData.path}
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
        />
      ) : (
        <TourDesktopView
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
        />
      )}
    </>
  );
};
