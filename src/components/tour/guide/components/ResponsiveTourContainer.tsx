
import React, { useState, useEffect } from "react";
import { useTour } from "@/contexts/tour";
import { TourTooltip } from "../../tooltip/TourTooltip";
import { TourMobileCompactView } from "../../mobile/TourMobileCompactView";
import { TourBottomSheetView } from "../../mobile/TourBottomSheetView";
import { TourDrawerView } from "../../drawer/TourDrawerView";
import { useResponsiveTour } from "@/contexts/tour/ResponsiveTourContext";
import { TourSpotlight } from "./TourSpotlight";
import { Position } from "@/lib/tour/types";

interface ResponsiveTourContainerProps {
  targetElement: HTMLElement | null;
  children?: React.ReactNode;
}

/**
 * ResponsiveTourContainer Component
 * 
 * An optimized container that selects the appropriate tour view type
 * based on device, orientation, and user preferences
 */
export const ResponsiveTourContainer: React.FC<ResponsiveTourContainerProps> = ({
  targetElement,
  children
}) => {
  const {
    currentStepData,
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    endTour,
    isActive
  } = useTour();
  
  const {
    isMobile,
    isTablet,
    isLandscape,
    isRTL,
    direction,
    preferredViewMode,
    getOptimalPosition,
    minTouchTargetSize,
    isOrientationChanging
  } = useResponsiveTour();
  
  // State for mobile views
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  // Ensure drawer is open when tour is active
  useEffect(() => {
    if (isActive && (isMobile || isTablet)) {
      setIsDrawerOpen(true);
    } else {
      setIsDrawerOpen(false);
    }
  }, [isActive, isMobile, isTablet]);
  
  if (!currentStepData || !isActive) {
    return null;
  }
  
  // Determine if this is the last step
  const isLastStep = currentStep === totalSteps - 1;
  
  // Format step info text
  const stepInfo = `${currentStep + 1} of ${totalSteps}`;
  
  // Get optimal position for tooltip
  const targetRect = targetElement?.getBoundingClientRect() || null;
  const optimalPosition = getOptimalPosition(targetRect);
  
  // Map media object to the expected format
  const mapMediaForView = (media: any) => {
    if (!media) return undefined;
    
    return {
      type: media.type,
      url: media.source || media.url,
      alt: media.alt || currentStepData.title,
      animation: media.animation
    };
  };
  
  // During orientation changes, prevent view switching to avoid flickering
  if (isOrientationChanging) {
    return (
      <div className="tour-transition-placeholder" aria-live="polite" aria-atomic="true">
        <div className="tour-loading-indicator" />
      </div>
    );
  }
  
  // Add spotlight effect if configured
  const renderSpotlight = () => {
    if (!targetElement || !currentStepData.spotlight) return null;
    
    return (
      <TourSpotlight 
        targetElement={targetElement}
        intensity={currentStepData.spotlight.intensity || "medium"}
        color={currentStepData.spotlight.color}
        pulseEffect={currentStepData.spotlight.pulseEffect}
        fadeBackground={currentStepData.spotlight.fadeBackground}
      />
    );
  };
  
  // Determine view mode based on device and orientation
  const determineViewMode = (): 'tooltip' | 'drawer' | 'compact' | 'sheet' => {
    // If user has explicit preference, use it
    if (preferredViewMode !== 'fullscreen') {
      return preferredViewMode;
    }
    
    // Phone in portrait - use bottom sheet
    if (isMobile && !isLandscape) {
      return 'sheet';
    }
    
    // Phone in landscape - use compact view
    if (isMobile && isLandscape) {
      return 'compact';
    }
    
    // Tablet - use drawer in portrait, tooltip in landscape
    if (isTablet) {
      return isLandscape ? 'tooltip' : 'drawer';
    }
    
    // Default to tooltip for desktop
    return 'tooltip';
  };
  
  const viewMode = determineViewMode();
  
  // Render the appropriate view based on device and orientation
  switch (viewMode) {
    case 'tooltip':
      return (
        <>
          {renderSpotlight()}
          <TourTooltip
            targetElement={targetElement!}
            position={optimalPosition as Position}
            title={currentStepData.title}
            content={currentStepData.content}
            stepInfo={stepInfo}
            onPrev={currentStep > 0 ? prevStep : undefined}
            onNext={nextStep}
            onClose={endTour}
            isLastStep={isLastStep}
            animation={currentStepData.animation}
            media={mapMediaForView(currentStepData.media)}
            nextLabel={currentStepData.actions?.next?.text}
            prevLabel={currentStepData.actions?.prev?.text}
            skipLabel={currentStepData.actions?.skip?.text}
            currentStep={currentStep}
            totalSteps={totalSteps}
            isRTL={isRTL}
            direction={direction}
          />
        </>
      );
    
    case 'drawer':
      return (
        <>
          {renderSpotlight()}
          <TourDrawerView
            step={currentStepData}
            isOpen={isDrawerOpen}
            onClose={endTour}
            onNext={nextStep}
            onPrev={prevStep}
            currentStep={currentStep}
            totalSteps={totalSteps}
            isLastStep={isLastStep}
            isTablet={isTablet}
            isLandscape={isLandscape}
            direction={direction}
          />
        </>
      );
    
    case 'compact':
      return (
        <>
          {renderSpotlight()}
          <TourMobileCompactView
            title={currentStepData.title}
            content={currentStepData.content}
            currentStep={currentStep}
            totalSteps={totalSteps}
            onNext={nextStep}
            onPrev={prevStep}
            onClose={endTour}
            nextLabel={currentStepData.actions?.next?.text}
            prevLabel={currentStepData.actions?.prev?.text}
            media={mapMediaForView(currentStepData.media)}
          />
        </>
      );
    
    case 'sheet':
      return (
        <>
          {renderSpotlight()}
          <TourBottomSheetView
            step={currentStepData}
            isOpen={isDrawerOpen}
            onClose={endTour}
            onNext={nextStep}
            onPrev={prevStep}
            currentStep={currentStep}
            totalSteps={totalSteps}
            isLastStep={isLastStep}
            direction={direction}
          />
        </>
      );
    
    default:
      // Fallback to tooltip view
      return (
        <>
          {renderSpotlight()}
          <TourTooltip
            targetElement={targetElement!}
            position={optimalPosition as Position}
            title={currentStepData.title}
            content={currentStepData.content}
            stepInfo={stepInfo}
            onPrev={currentStep > 0 ? prevStep : undefined}
            onNext={nextStep}
            onClose={endTour}
            isLastStep={isLastStep}
            animation={currentStepData.animation}
            media={mapMediaForView(currentStepData.media)}
            nextLabel={currentStepData.actions?.next?.text}
            prevLabel={currentStepData.actions?.prev?.text}
            skipLabel={currentStepData.actions?.skip?.text}
            currentStep={currentStep}
            totalSteps={totalSteps}
            isRTL={isRTL}
            direction={direction}
          />
        </>
      );
  }
};
