
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

interface TourMobileActionsProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onClose?: () => void;
  nextLabel?: string;
  prevLabel?: string;
  skipLabel?: string;
  deviceType?: 'mobile' | 'tablet' | 'desktop';
}

export const TourMobileActions: React.FC<TourMobileActionsProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onClose,
  nextLabel,
  prevLabel,
  skipLabel,
  deviceType = 'mobile'
}) => {
  const { isRTL } = useLanguage();
  
  // Determine if we should show the previous button
  const showPrevButton = currentStep > 0;
  
  // Determine if this is the last step
  const isLastStep = currentStep === totalSteps - 1;
  
  // Get button labels with defaults
  const nextButtonLabel = nextLabel || 'Next';
  const prevButtonLabel = prevLabel || 'Back';
  const skipButtonLabel = skipLabel || 'Skip';
  const finishButtonLabel = 'Finish';
  
  return (
    <div className="flex justify-between items-center w-full">
      <div>
        {showPrevButton && (
          <Button
            variant="outline"
            size={deviceType === 'mobile' ? 'sm' : 'default'}
            onClick={onPrev}
            className="gap-1"
          >
            {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            {prevButtonLabel}
          </Button>
        )}
      </div>
      
      <div className="flex gap-2">
        {!isLastStep && onClose && (
          <Button
            variant="ghost"
            size={deviceType === 'mobile' ? 'sm' : 'default'}
            onClick={onClose}
          >
            {skipButtonLabel}
          </Button>
        )}
        
        <Button
          variant="default"
          size={deviceType === 'mobile' ? 'sm' : 'default'}
          onClick={onNext}
          className="gap-1"
        >
          {isLastStep ? finishButtonLabel : nextButtonLabel}
          {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};
