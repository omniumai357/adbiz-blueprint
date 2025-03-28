
import React, { useState, useEffect } from "react";
import { useTour } from "@/contexts/tour";
import { TourTooltip } from "../../tooltip/TourTooltip";
import { TourMobileCompactView } from "../../mobile/TourMobileCompactView";
import { TourBottomSheetView } from "../../mobile/TourBottomSheetView";
import { TourDrawerView } from "../../drawer/TourDrawerView";
import { useResponsiveTour } from "@/contexts/tour/ResponsiveTourContext";
import { useDevice } from "@/hooks/use-device";

interface TourViewContainerProps {
  targetElement: HTMLElement | null;
  children?: React.ReactNode;
  isRTL: boolean;
  direction: 'ltr' | 'rtl';
  preferredViewMode: 'tooltip' | 'drawer' | 'compact' | 'fullscreen';
  isMobile: boolean;
  isTablet: boolean;
  minTouchTargetSize: number;
}

export const TourViewContainer: React.FC<TourViewContainerProps> = ({
  targetElement,
  children,
  isRTL,
  direction,
  preferredViewMode,
  isMobile,
  isTablet,
  minTouchTargetSize
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
  
  const { getOptimalPosition, isLandscape } = useResponsiveTour();
  const { deviceType, isPortrait } = useDevice();
  
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
  
  // Determine view mode based on device and orientation
  const getBestViewMode = (): 'tooltip' | 'drawer' | 'compact' | 'sheet' => {
    // Phone in portrait - use bottom sheet
    if (isMobile && isPortrait) {
      return 'sheet';
    }
    
    // Phone in landscape - use compact view
    if (isMobile && !isPortrait) {
      return 'compact';
    }
    
    // Tablet - use drawer
    if (isTablet) {
      return 'drawer';
    }
    
    // Default to tooltip for desktop
    return 'tooltip';
  };
  
  const viewMode = getBestViewMode();
  
  // Render the appropriate view based on device and orientation
  switch (viewMode) {
    case 'tooltip':
      return (
        <TourTooltip
          targetElement={targetElement!}
          position={optimalPosition}
          title={currentStepData.title}
          content={currentStepData.content}
          stepInfo={stepInfo}
          onPrev={currentStep > 0 ? prevStep : undefined}
          onNext={nextStep}
          onClose={endTour}
          isLastStep={isLastStep}
          animation={currentStepData.animation}
          media={currentStepData.media}
          nextLabel={currentStepData.actions?.next?.text}
          prevLabel={currentStepData.actions?.prev?.text}
          skipLabel={currentStepData.actions?.skip?.text}
          currentStep={currentStep}
          totalSteps={totalSteps}
          isRTL={isRTL}
          direction={direction}
        />
      );
    
    case 'drawer':
      return (
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
      );
    
    case 'compact':
      return (
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
        />
      );
    
    case 'sheet':
      return (
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
      );
    
    default:
      // Fallback to tooltip view
      return (
        <TourTooltip
          targetElement={targetElement!}
          position={optimalPosition}
          title={currentStepData.title}
          content={currentStepData.content}
          stepInfo={stepInfo}
          onPrev={currentStep > 0 ? prevStep : undefined}
          onNext={nextStep}
          onClose={endTour}
          isLastStep={isLastStep}
          animation={currentStepData.animation}
          media={currentStepData.media}
          nextLabel={currentStepData.actions?.next?.text}
          prevLabel={currentStepData.actions?.prev?.text}
          skipLabel={currentStepData.actions?.skip?.text}
          currentStep={currentStep}
          totalSteps={totalSteps}
          isRTL={isRTL}
          direction={direction}
        />
      );
  }
};
