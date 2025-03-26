
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
    endTour();
  };
  
  // Handle next step with analytics
  const handleNext = () => {
    handleInteraction('next_button_clicked');
    nextStep();
  };
  
  // Handle previous step with analytics
  const handlePrev = () => {
    handleInteraction('prev_button_clicked');
    prevStep();
  };

  if (!isActive || !currentStepData) {
    return null;
  }

  // For mobile devices, use a drawer at the bottom of the screen
  if (isMobile) {
    return (
      <>
        <TourOverlay 
          targetElement={targetElement} 
          animation={currentStepData.animation?.highlight}
        />
        <TourDrawer 
          title={currentStepData.title}
          content={currentStepData.content}
          currentStep={currentStep}
          totalSteps={totalSteps}
          onNext={handleNext}
          onPrev={handlePrev}
          onClose={handleClose}
        />
      </>
    );
  }

  // For desktop, use tooltips that point to elements
  return (
    <>
      <TourOverlay 
        targetElement={targetElement} 
        animation={currentStepData.animation?.highlight}
      />
      {targetElement && (
        <TourTooltip
          targetElement={targetElement}
          position={currentStepData.position || "bottom"}
          title={currentStepData.title}
          content={currentStepData.content}
          stepInfo={`${currentStep + 1} of ${totalSteps}`}
          onPrev={currentStep > 0 ? handlePrev : undefined}
          onNext={handleNext}
          onClose={handleClose}
          isLastStep={currentStep === totalSteps - 1}
          animation={currentStepData.animation?.entry}
        />
      )}
    </>
  );
};
