
import React, { useRef, useEffect } from "react";
import { useTour } from "@/contexts/tour";
import { useTourElementFinder } from "@/hooks/tour/useTourElementFinder";
import { useTourKeyboardNavigation } from "@/hooks/tour/useTourKeyboardNavigation";
import { useKeyboardShortcuts } from "@/contexts/tour/KeyboardShortcutsContext";
import { TourAccessibilityManager } from "./components/TourAccessibilityManager";
import { TourPathVisualizationManager } from "./components/TourPathVisualizationManager";
import { TourShortcutsHelp } from "./components/TourShortcutsHelp";
import { TourEventManager } from "./components/TourEventManager";
import { TourViewRenderer } from "./components/TourViewRenderer";
import { TourAnalyticsTracker } from "./components/TourAnalyticsTracker";
import { useLanguage } from "@/contexts/language-context";
import { useResponsiveTour } from "@/contexts/tour/ResponsiveTourContext";
import { Position } from "@/lib/tour/types";
import { logger } from "@/lib/utils/logging";
import { TourLiveAnnouncer } from "../accessibility/TourLiveAnnouncer";
import { TourFocusManager } from "../accessibility/TourFocusManager";

export const TourGuideControllerInner: React.FC = () => {
  const {
    isActive,
    currentStepData,
    nextStep,
    prevStep,
    totalSteps,
    currentStep,
    endTour
  } = useTour();
  
  const { showKeyboardShortcutsHelp } = useKeyboardShortcuts();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { direction, isRTL } = useLanguage();
  
  // Use our enhanced responsive tour context
  const {
    isMobile,
    isTablet,
    isLandscape,
    preferredViewMode,
    minTouchTargetSize,
    shouldUseDrawer,
    shouldUseCompactView,
    isOrientationChanging,
    handleOrientationChange
  } = useResponsiveTour();
  
  const { targetElement } = useTourElementFinder(currentStepData?.target || '');
  
  // Log device information for debugging
  useEffect(() => {
    if (isActive && currentStepData) {
      logger.debug('Tour active with device info', {
        context: 'TourGuideController',
        data: { 
          isMobile,
          isTablet, 
          isLandscape,
          preferredViewMode,
          currentStep: currentStep + 1,
          totalSteps
        }
      });
    }
  }, [isActive, currentStepData, isMobile, isTablet, isLandscape, preferredViewMode, currentStep, totalSteps]);
  
  // Handle orientation changes
  useEffect(() => {
    if (isActive && isOrientationChanging) {
      // Perform any cleanup or adjustments needed during orientation changes
      logger.debug('Handling orientation change in tour', {
        context: 'TourGuideController'
      });
    }
  }, [isActive, isOrientationChanging]);
  
  // Define a handleKeyNavigation function with RTL awareness
  const handleKeyNavigation = (event: React.KeyboardEvent | KeyboardEvent, navigationAction?: string) => {
    if (!navigationAction) return;
    
    // RTL-aware arrow key handling
    if (navigationAction === 'next_keyboard_shortcut') {
      isRTL ? prevStep() : nextStep();
    } else if (navigationAction === 'previous_keyboard_shortcut') {
      isRTL ? nextStep() : prevStep();
    } else if (navigationAction === 'next_from_element') {
      nextStep();
    } else if (navigationAction === 'escape') {
      endTour();
    } else if (navigationAction === 'show_shortcuts_help') {
      showKeyboardShortcutsHelp();
    }
  };
  
  useTourKeyboardNavigation(
    isActive, 
    handleKeyNavigation
  );

  if (!isActive || !currentStepData) {
    return null;
  }

  // Calculate if this is the last step
  const isLastStep = currentStep === totalSteps - 1;
  
  // Format step info text
  const stepInfo = `${currentStep + 1} of ${totalSteps}`;

  return (
    <>
      {/* Enhanced accessibility components */}
      <TourLiveAnnouncer 
        isActive={isActive} 
        currentStepData={currentStepData} 
      />
      
      <TourFocusManager 
        isActive={isActive} 
        currentStepData={currentStepData} 
      />
      
      {/* Track analytics */}
      <TourAnalyticsTracker />
      
      {/* Manage accessibility features */}
      <TourAccessibilityManager tooltipRef={tooltipRef} />
      
      {/* Handle path visualization */}
      <TourPathVisualizationManager targetElement={targetElement} />
      
      {/* Display keyboard shortcuts help */}
      <TourShortcutsHelp />
      
      {/* Handle event listeners */}
      <TourEventManager />
      
      {/* Render the appropriate view based on device and orientation */}
      <TourViewRenderer 
        step={currentStepData}
        targetElement={targetElement}
        isRTL={isRTL}
        direction={direction}
        currentStep={currentStep}
        totalSteps={totalSteps}
        onNext={nextStep}
        onPrev={prevStep}
        onClose={endTour}
        isLastStep={isLastStep}
        stepInfo={stepInfo}
        tooltipRef={tooltipRef}
        isMobile={isMobile}
        isTablet={isTablet}
        isLandscape={isLandscape}
        useDrawer={shouldUseDrawer()}
        useCompactView={shouldUseCompactView()}
        preferredViewMode={preferredViewMode}
        isOrientationChanging={isOrientationChanging}
      />
    </>
  );
};
