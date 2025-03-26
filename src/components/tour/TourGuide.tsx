
import React, { useEffect, useState } from "react";
import { useTour } from "@/contexts/tour-context";
import { TourTooltip } from "./TourTooltip";
import { TourOverlay } from "./TourOverlay";
import { TourDrawer } from "./TourDrawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useTourElementFinder } from "@/hooks/tour/useTourElementFinder";
import { useTourAnalytics } from "@/hooks/tour/useTourAnalytics";
import { useAuth } from "@/contexts/auth-context";
import { useAuthUser } from "@/hooks/queries/useAuthUser";

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
  } = useTour();
  
  const { targetElement } = useTourElementFinder(isActive, currentStepData);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const analytics = useTourAnalytics();
  
  // Try to get user information from auth context first
  let userId: string | undefined;
  let userType: string | undefined;
  
  try {
    // Use the auth context if available
    const { user, profile } = useAuth();
    userId = user?.id;
    userType = profile?.role || 'anonymous';
  } catch (error) {
    // Fallback to useAuthUser if auth context isn't available
    const { data: authData } = useAuthUser();
    userId = authData?.user?.id;
    userType = 'anonymous'; // Default user type when profile isn't available
  }

  // Track when a tour is completed
  useEffect(() => {
    if (isActive && currentStep === totalSteps - 1 && currentPath) {
      // Store the completed tour in localStorage
      const completedTours = JSON.parse(localStorage.getItem('completedTours') || '[]');
      if (!completedTours.includes(currentPath)) {
        completedTours.push(currentPath);
        localStorage.setItem('completedTours', JSON.stringify(completedTours));
      }
    }
  }, [isActive, currentStep, totalSteps, currentPath]);

  // Handle custom interactions with tour elements
  const handleInteraction = (interactionType: string) => {
    if (!currentStepData || !currentPath) return;
    
    const pathData = availablePaths.find(path => path.id === currentPath);
    if (!pathData) return;
    
    analytics.trackStepInteraction(
      pathData,
      currentStepData,
      currentStep,
      interactionType,
      userId,
      userType
    );
  };

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

  // Handle tour closing with analytics
  const handleClose = () => {
    handleInteraction('close_button_clicked');
    
    // Check if the step has custom actions defined
    if (currentStepData?.actions?.skip?.onClick) {
      currentStepData.actions.skip.onClick();
    }
    
    endTour();
  };
  
  // Handle next step with analytics
  const handleNext = () => {
    handleInteraction('next_button_clicked');
    
    // Check if the step has custom actions defined
    if (currentStepData?.actions?.next?.onClick) {
      currentStepData.actions.next.onClick();
    }
    
    nextStep();
  };
  
  // Handle previous step with analytics
  const handlePrev = () => {
    handleInteraction('prev_button_clicked');
    
    // Check if the step has custom actions defined
    if (currentStepData?.actions?.prev?.onClick) {
      currentStepData.actions.prev.onClick();
    }
    
    prevStep();
  };

  if (!isActive || !currentStepData) {
    return null;
  }

  // Get the appropriate animation settings
  const highlightAnimation = currentStepData.animation?.highlight || "pulse";
  const entryAnimation = currentStepData.animation?.entry || "fade-in";
  
  // Get custom button labels if provided
  const nextLabel = currentStepData.actions?.next?.label;
  const prevLabel = currentStepData.actions?.prev?.label;
  const skipLabel = currentStepData.actions?.skip?.label;

  // For mobile devices, use a drawer at the bottom of the screen
  if (isMobile) {
    return (
      <>
        <TourOverlay 
          targetElement={targetElement} 
          animation={highlightAnimation}
        />
        <TourDrawer 
          title={currentStepData.title}
          content={currentStepData.content}
          media={currentStepData.media}
          currentStep={currentStep}
          totalSteps={totalSteps}
          onNext={handleNext}
          onPrev={handlePrev}
          onClose={handleClose}
          nextLabel={nextLabel}
          prevLabel={prevLabel}
          skipLabel={skipLabel}
          isLastStep={currentStep === totalSteps - 1}
        />
      </>
    );
  }

  // For desktop, use tooltips that point to elements
  return (
    <>
      <TourOverlay 
        targetElement={targetElement} 
        animation={highlightAnimation}
      />
      {targetElement && (
        <TourTooltip
          targetElement={targetElement}
          position={currentStepData.position || "bottom"}
          title={currentStepData.title}
          content={currentStepData.content}
          media={currentStepData.media}
          stepInfo={`${currentStep + 1} of ${totalSteps}`}
          onPrev={currentStep > 0 ? handlePrev : undefined}
          onNext={handleNext}
          onClose={handleClose}
          nextLabel={nextLabel}
          prevLabel={prevLabel}
          skipLabel={skipLabel}
          isLastStep={currentStep === totalSteps - 1}
          animation={entryAnimation}
        />
      )}
    </>
  );
};
