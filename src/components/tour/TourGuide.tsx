
import React from "react";
import { useTour } from "@/contexts/tour-context";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useTourElementFinder } from "@/hooks/tour/useTourElementFinder";
import { useTourDynamicContent } from "@/hooks/tour/useTourDynamicContent";
import { useTourInteractions } from "@/hooks/tour/useTourInteractions";
import { useUserContext } from "@/hooks/tour/useUserContext";
import { useTourCompletionTracker } from "@/hooks/tour/useTourCompletionTracker";
import { useTourKeyboardNavigation } from "@/hooks/tour/useTourKeyboardNavigation";
import { TourMobileView } from "./TourMobileView";
import { TourDesktopView } from "./TourDesktopView";

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
    currentPath,
    availablePaths,
    setDynamicContent,
  } = useTour();
  
  // Find target element for the current step
  const { targetElement } = useTourElementFinder(isActive, currentStepData);
  
  // Check if we're on a mobile device
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  // Get user context for analytics
  const { userId, userType } = useUserContext();
  
  // Track tour completion
  useTourCompletionTracker(isActive, currentStep, totalSteps, currentPath);
  
  // Handle keyboard navigation
  useTourKeyboardNavigation(isActive, handleKeyNavigation);
  
  // Process dynamic content
  const { content } = useTourDynamicContent(currentStepData, setDynamicContent);
  
  // Handle tour interactions with analytics
  const { handleNext, handlePrev, handleClose } = useTourInteractions(
    currentStepData,
    currentPath,
    availablePaths,
    currentStep,
    userId,
    userType,
    { nextStep, prevStep, endTour }
  );

  // Don't render anything if tour is not active or no current step
  if (!isActive || !currentStepData) {
    return null;
  }

  // Get the appropriate animation settings
  const highlightAnimation = currentStepData.animation?.highlight || "pulse";
  const entryAnimation = currentStepData.animation?.entry || "fade-in";
  const exitAnimation = currentStepData.animation?.exit;
  const transitionType = currentStepData.animation?.transition || "slide";
  const transitionDuration = currentStepData.animation?.duration || 300;
  
  // Extract spotlight settings if present
  const spotlight = currentStepData.spotlight;
  
  // Create transition object for components
  const transition = {
    type: transitionType as "fade" | "slide" | "zoom" | "flip" | "none",
    direction: "right" as "up" | "down" | "left" | "right",
    duration: transitionDuration
  };

  // For mobile devices, use a drawer at the bottom of the screen
  if (isMobile) {
    return (
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
        transition={transition}
        spotlight={spotlight}
      />
    );
  }

  // For desktop, use tooltips that point to elements
  return (
    <TourDesktopView
      currentStepData={currentStepData}
      content={content}
      targetElement={targetElement}
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={handleNext}
      onPrev={handlePrev}
      onClose={handleClose}
      highlightAnimation={highlightAnimation}
      entryAnimation={entryAnimation}
      exitAnimation={exitAnimation}
      transition={transition}
      spotlight={spotlight}
    />
  );
};
