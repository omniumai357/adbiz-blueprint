
import React from 'react';
import { useTour } from '@/contexts/tour';
import { useTourElementFinder } from '@/hooks/tour/useTourElementFinder';
import { useTourPosition } from '@/hooks/tour/useTourPosition';
import { TourMobileView } from '../../TourMobileView';
import { TourDesktopView } from '../../TourDesktopView';
import { useMediaQuery } from '@/hooks/ui/useMediaQuery';

interface TourViewContainerProps {
  targetElement: HTMLElement | null;
  isRTL: boolean;
  direction: 'ltr' | 'rtl';
}

export const TourViewContainer: React.FC<TourViewContainerProps> = ({
  targetElement,
  isRTL,
  direction
}) => {
  const {
    isActive,
    currentStepData,
    nextStep,
    prevStep,
    endTour,
    currentStep,
    totalSteps,
  } = useTour();
  
  const isMobile = useMediaQuery('(max-width: 768px)');
  const targetRect = targetElement?.getBoundingClientRect();
  const { position, arrowPosition } = useTourPosition(targetRect, currentStepData?.position || 'bottom');
  
  // Don't render if not active or no step data
  if (!isActive || !currentStepData) {
    return null;
  }
  
  const isLastStep = currentStep === totalSteps - 1;
  
  // Generate step info text
  const stepInfo = `${currentStep + 1} / ${totalSteps}`;
  
  if (isMobile) {
    return (
      <TourMobileView
        step={currentStepData}
        stepInfo={stepInfo}
        onNext={nextStep}
        onPrev={prevStep}
        onClose={endTour}
        isLastStep={isLastStep}
        currentStep={currentStep}
        totalSteps={totalSteps}
        targetElement={targetElement}
        isRTL={isRTL}
        direction={direction}
      />
    );
  }
  
  // Ensure we're passing all required properties to TourDesktopView
  return (
    <TourDesktopView
      position={position}
      arrowPosition={arrowPosition}
      title={currentStepData.title || "Tour Guide"}
      content={currentStepData.content || ""}
      stepInfo={stepInfo}
      onNext={nextStep}
      onPrev={prevStep}
      onClose={endTour}
      isLastStep={isLastStep}
      currentStep={currentStep}
      totalSteps={totalSteps}
      isRTL={isRTL}
      targetElement={targetElement || document.body}
      direction={direction}
    />
  );
};
