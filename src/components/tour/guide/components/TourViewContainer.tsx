
import React from "react";
import { useTour } from "@/contexts/tour";
import { TourTooltip } from "../../tooltip/TourTooltip";
import { TourMobileCompactView } from "../../mobile/TourMobileCompactView";
import { useResponsiveTour } from "@/contexts/tour/ResponsiveTourContext";

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
    endTour
  } = useTour();
  
  // Additional responsive context if needed
  const { getOptimalPosition, isLandscape } = useResponsiveTour();
  
  if (!currentStepData) {
    return null;
  }
  
  // Determine if this is the last step
  const isLastStep = currentStep === totalSteps - 1;
  
  // Format step info text
  const stepInfo = `${currentStep + 1} of ${totalSteps}`;
  
  // Determine optimal position for tooltip
  const targetRect = targetElement?.getBoundingClientRect() || null;
  const optimalPosition = getOptimalPosition(targetRect);
  
  // Render the appropriate view based on device and orientation
  switch (preferredViewMode) {
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
      // Since there's an import error for TourDrawer, let's fallback to tooltip view
      console.warn('TourDrawer component not available, falling back to tooltip view');
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
    
    case 'fullscreen':
      // Since there's an import error for TourMobileView, let's fallback to compact view
      console.warn('TourMobileView component not available, falling back to compact view');
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
