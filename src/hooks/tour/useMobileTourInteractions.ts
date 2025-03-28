
import { useCallback } from 'react';
import { useTourGestures } from './useTourGestures';
import { useResponsiveTour } from '@/contexts/tour/ResponsiveTourContext';

/**
 * Options for the mobile tour interactions hook
 */
interface MobileTourInteractionsOptions {
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  currentStep: number;
  totalSteps: number;
  enableHaptics?: boolean;
  enableSwipeNavigation?: boolean;
  preventScrolling?: boolean;
}

/**
 * Hook that provides comprehensive mobile interaction handling for tour components
 */
export function useMobileTourInteractions({
  onNext,
  onPrev,
  onClose,
  currentStep,
  totalSteps,
  enableHaptics = true,
  enableSwipeNavigation = true,
  preventScrolling = true
}: MobileTourInteractionsOptions) {
  const { isRTL, isLandscape } = useResponsiveTour();
  
  // Handle previous/next based on current step
  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      onPrev();
    }
  }, [currentStep, onPrev]);
  
  const handleNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      onNext();
    } else {
      onClose();
    }
  }, [currentStep, totalSteps, onNext, onClose]);
  
  // Set gesture handlers (with RTL support)
  const swipeLeftHandler = !isRTL ? handleNext : handlePrev;
  const swipeRightHandler = !isRTL ? handlePrev : handleNext;
  
  // Configure gesture handling based on options
  const { touchHandlers } = useTourGestures({
    onSwipeLeft: enableSwipeNavigation ? swipeLeftHandler : undefined,
    onSwipeRight: enableSwipeNavigation ? swipeRightHandler : undefined,
    onSwipeDown: isLandscape ? undefined : onClose,
    threshold: isLandscape ? 30 : 50, // Lower threshold for landscape mode
    preventScrollOnSwipe: preventScrolling,
    vibrate: enableHaptics,
    longPressDelay: 700
  });
  
  return {
    // Event handlers
    touchHandlers,
    handleNext,
    handlePrev,
    handleClose: onClose,
    
    // Navigation state
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === totalSteps - 1,
    currentStep,
    totalSteps,
    
    // Direction helpers
    isRTL,
    isLandscape,
    
    // Accessibility helpers
    getStepLabel: (step: number) => `Step ${step + 1} of ${totalSteps}`,
    getProgressPercentage: () => ((currentStep + 1) / totalSteps) * 100
  };
}
