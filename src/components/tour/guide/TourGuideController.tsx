import React, { useEffect, useState, useRef, useCallback } from "react";
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

export const TourGuideController: React.FC = () => {
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
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const desktopViewRef = useRef<TourDesktopViewHandle>(null);
  
  const [lastStepIndex, setLastStepIndex] = useState<number>(-1);

  const isMobile = useIsMobile();
  
  const { userId, userType } = useUserContext();
  
  useTourCompletionTracker(isActive, currentStep, totalSteps, currentPath);
  
  useTourKeyboardNavigation(
    isActive, 
    (event, navigationAction) => {
      if (navigationAction === 'show_shortcuts_help') {
        setShowKeyboardHelp(true);
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

  const showKeyboardShortcutsHelp = () => {
    setShowKeyboardHelp(true);
  };

  const closeKeyboardShortcutsHelp = () => {
    setShowKeyboardHelp(false);
    
    if (tooltipRef.current) {
      const focusableElement = tooltipRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      
      if (focusableElement) {
        focusableElement.focus();
      }
    }
  };

  useEffect(() => {
    if (isActive && currentStepData && lastStepIndex !== currentStep) {
      setLastStepIndex(currentStep);
      
      setTimeout(() => {
        if (!isMobile) {
          if (currentStep === 0) {
            focusElement('[data-tour-action="next"]');
          } else if (currentStep === totalSteps - 1) {
            focusElement('[data-tour-action="finish"]');
          } else if (currentStep > lastStepIndex && lastStepIndex !== -1) {
            focusElement('[data-tour-action="next"]');
          } else if (currentStep < lastStepIndex) {
            focusElement('[data-tour-action="previous"]');
          }
        }

        const liveRegion = document.getElementById('tour-announcer');
        if (liveRegion) {
          const stepNumber = currentStep + 1;
          liveRegion.textContent = `Step ${stepNumber} of ${totalSteps}: ${currentStepData.title}. ${content}`;
        }
      }, 150);
    }
  }, [isActive, currentStep, currentStepData, lastStepIndex, totalSteps, content, isMobile, focusElement]);

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
      
      document.body.classList.add('tour-active-focus-mode');
      
      let liveRegion = document.getElementById('tour-announcer');
      if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'tour-announcer';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
      }
      
      if (currentStepData) {
        liveRegion.textContent = `Tour started. Step 1 of ${totalSteps}: ${currentStepData.title}`;
      }
    } else {
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
        previousFocusRef.current = null;
      }
      
      document.body.classList.remove('tour-active-focus-mode');
      
      setShowKeyboardHelp(false);
      
      const liveRegion = document.getElementById('tour-announcer');
      if (liveRegion) {
        liveRegion.textContent = "Tour ended";
      }
    }
  }, [isActive, currentStepData, totalSteps]);

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
        announcement += '. Use arrow keys to navigate, Home and End to jump to first or last step, and Shift+? for keyboard shortcuts.';
      }
      
      liveRegion.textContent = announcement;
    }
  }, [isActive, currentStepData, currentStep, totalSteps, content, isMobile]);

  useEffect(() => {
    const styleId = 'tour-focus-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .tour-active-focus-mode :focus {
          outline: 3px solid #0ea5e9 !important;
          outline-offset: 2px !important;
          box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.25) !important;
          border-radius: 2px !important;
          transition: outline-color 0.2s ease-in-out !important;
          position: relative !important;
          z-index: 10 !important;
        }
        
        .tour-active-focus-mode :focus:not(:focus-visible) {
          outline: none !important;
          box-shadow: none !important;
        }
        
        .tour-active-focus-mode :focus-visible {
          outline: 3px solid #0ea5e9 !important;
          outline-offset: 2px !important;
          box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.25) !important;
          position: relative !important;
          z-index: 10 !important;
        }
        
        .tour-active-focus-mode [data-tour-action]:focus-visible::after {
          content: "";
          position: absolute;
          inset: -4px;
          border-radius: 4px;
          background: rgba(14, 165, 233, 0.1);
          z-index: -1;
          animation: pulse-focus 2s infinite;
        }
        
        @keyframes pulse-focus {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .tour-tooltip:focus-within {
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.4), 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
        }
        
        @media (forced-colors: active) {
          .tour-active-focus-mode :focus,
          .tour-active-focus-mode :focus-visible {
            outline: 3px solid CanvasText !important;
            outline-offset: 2px !important;
          }
        }
        
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
      `;
      document.head.appendChild(style);
    }
    
    return () => {
      const styleElement = document.getElementById(styleId);
      if (styleElement) {
        document.head.removeChild(styleElement);
      }
    };
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
      <TourPathVisualization 
        isActive={!!currentStepData.path?.enabled && !!targetElement && !!pathTargetElement}
        sourceElement={targetElement}
        targetElement={pathTargetElement}
        pathOptions={currentStepData.path}
      />

      {showKeyboardHelp && (
        <TourKeyboardShortcutsHelp onClose={closeKeyboardShortcutsHelp} />
      )}

      <div style={{ display: 'none' }} aria-hidden="true">
        {useEffect(() => {
          const handleNextEvent = () => handleNext();
          const handlePrevEvent = () => onPrev && handlePrev();
          const handleCloseEvent = () => handleClose();
          
          document.addEventListener('tour:next', handleNextEvent);
          document.addEventListener('tour:previous', handlePrevEvent);
          document.addEventListener('tour:escape', handleCloseEvent);
          
          return () => {
            document.removeEventListener('tour:next', handleNextEvent);
            document.removeEventListener('tour:previous', handlePrevEvent);
            document.removeEventListener('tour:escape', handleCloseEvent);
          };
        }, [handleNext, handlePrev, handleClose])}
      </div>

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
          onShowKeyboardShortcuts={() => setShowKeyboardHelp(true)}
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
