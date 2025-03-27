
import React, { useEffect, useRef } from 'react';
import { useTour } from '@/contexts/tour';
import { useTourElementFinder } from '@/hooks/tour/useTourElementFinder';
import { useTourPosition } from '@/hooks/tour/useTourPosition';
import { TourMobileView } from '../../TourMobileView';
import { TourDesktopView } from '../../TourDesktopView';
import { useMediaQuery } from '@/hooks/ui/useMediaQuery';
import { TourStep } from '@/contexts/tour/types';

export const TourViewContainer: React.FC = () => {
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
  const { targetElement, targetRect } = useTourElementFinder(currentStepData?.target || '');
  const { position, arrowPosition } = useTourPosition(targetRect, currentStepData?.position || 'bottom');
  
  // Tracking the first render
  const firstRenderRef = useRef(true);
  
  // Determine the current direction based on the language
  const isRTL = document.documentElement.dir === 'rtl';
  const direction = isRTL ? 'rtl' : 'ltr';
  
  // Scroll into view if needed
  useEffect(() => {
    if (isActive && targetElement && !firstRenderRef.current) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
    
    firstRenderRef.current = false;
  }, [isActive, targetElement, currentStep]);
  
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
  
  return (
    <TourDesktopView
      step={currentStepData}
      position={position}
      arrowPosition={arrowPosition}
      stepInfo={stepInfo}
      onNext={nextStep}
      onPrev={prevStep}
      onClose={endTour}
      isLastStep={isLastStep}
      isRTL={isRTL}
      targetElement={targetElement}
      direction={direction}
    />
  );
};
