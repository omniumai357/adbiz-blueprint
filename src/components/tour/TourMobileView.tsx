
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { TourStep } from '@/contexts/tour/types';

export interface TourMobileViewProps {
  step: TourStep;
  stepInfo: string;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  isLastStep: boolean;
  currentStep: number;
  totalSteps: number;
  targetElement: HTMLElement | null;
  isRTL: boolean;
  direction: 'ltr' | 'rtl';
}

export const TourMobileView: React.FC<TourMobileViewProps> = ({
  step,
  stepInfo,
  onNext,
  onPrev,
  onClose,
  isLastStep,
  currentStep,
  totalSteps,
  targetElement,
  isRTL,
  direction,
}) => {
  // Extract necessary data from step
  const { title, content } = step;
  
  // Determine animation class
  const animationClass = step.animation ? `animate-${step.animation}` : 'animate-fade-in';
  
  // Determine next/prev button labels
  const nextLabel = step.actions?.next?.text || 'Next';
  const prevLabel = step.actions?.prev?.text || 'Back';
  const showPrevButton = currentStep > 0 && !(step.actions?.prev?.hidden);
  
  // Build classnames for the container
  const containerClassNames = [
    'fixed bottom-0 left-0 right-0 z-50',
    'bg-background border-t border-border shadow-lg',
    'p-4 sm:p-6 transition-all duration-300',
    animationClass,
  ].join(' ');
  
  return (
    <div className={containerClassNames} dir={direction}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{stepInfo}</span>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={onClose}
            aria-label="Close tour"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="mb-6 prose-sm prose-slate dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
      
      <div className="flex justify-between">
        <div>
          {showPrevButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={onPrev}
              className="gap-1"
            >
              {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              {prevLabel}
            </Button>
          )}
        </div>
        
        <Button
          variant="default"
          size="sm"
          onClick={onNext}
          className="gap-1"
        >
          {isLastStep ? 'Finish' : nextLabel}
          {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};
