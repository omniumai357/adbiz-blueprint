
import React, { useRef } from "react";
import { useTour } from "@/contexts/tour";
import { useTourElementFinder } from "@/hooks/tour/useTourElementFinder";
import { useTourKeyboardNavigation } from "@/hooks/tour/useTourKeyboardNavigation";
import { useKeyboardShortcuts } from "@/contexts/tour/KeyboardShortcutsContext";
import { TourAccessibilityManager } from "./components/TourAccessibilityManager";
import { TourPathVisualizationManager } from "./components/TourPathVisualizationManager";
import { TourShortcutsHelp } from "./components/TourShortcutsHelp";
import { TourEventManager } from "./components/TourEventManager";
import { TourViewContainer } from "./components/TourViewContainer";
import { TourAnalyticsTracker } from "./components/TourAnalyticsTracker";
import { useLanguage } from "@/contexts/language-context";

export const TourGuideControllerInner: React.FC = () => {
  const {
    isActive,
    currentStepData,
    nextStep,
    prevStep,
    goToStep
  } = useTour();
  
  const { showKeyboardShortcutsHelp } = useKeyboardShortcuts();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { direction, isRTL } = useLanguage();
  
  const { targetElement } = useTourElementFinder(isActive, currentStepData);
  
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
      // This would need an endTour function
    } else if (navigationAction === 'show_shortcuts_help') {
      showKeyboardShortcutsHelp();
    }
  };
  
  useTourKeyboardNavigation(
    isActive, 
    handleKeyNavigation,
    {
      enableHomeEndKeys: true,
      enablePageKeys: true,
      pageKeyJumpSize: 3,
      enableShortcutsHelp: true
    }
  );

  if (!isActive || !currentStepData) {
    return null;
  }

  return (
    <>
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
      
      {/* Render the appropriate view (mobile or desktop) */}
      <TourViewContainer 
        targetElement={targetElement}
        isRTL={isRTL}
        direction={direction}
      />
    </>
  );
};
