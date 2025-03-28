
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { TourStep } from '@/contexts/tour/types';
import { useTourGestures } from '@/hooks/tour/useTourGestures';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { TourMobileProgress } from './TourMobileProgress';

interface TourBottomSheetViewProps {
  step: TourStep;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  currentStep: number;
  totalSteps: number;
  isLastStep: boolean;
  direction: 'ltr' | 'rtl';
  nextLabel?: string;
  prevLabel?: string;
}

export const TourBottomSheetView: React.FC<TourBottomSheetViewProps> = ({
  step,
  isOpen,
  onClose,
  onNext,
  onPrev,
  currentStep,
  totalSteps,
  isLastStep,
  direction,
  nextLabel,
  prevLabel
}) => {
  const isRTL = direction === 'rtl';
  
  // Set gesture handlers (with RTL support)
  const swipeLeftHandler = !isRTL ? onNext : onPrev;
  const swipeRightHandler = !isRTL ? onPrev : onNext;
  
  // Setup swipe gestures
  const { touchHandlers } = useTourGestures({
    onSwipeLeft: swipeLeftHandler,
    onSwipeRight: swipeRightHandler,
    onSwipeDown: onClose,
    threshold: 50,
    preventScrollOnSwipe: false,
    vibrate: true
  });
  
  // Check if the previous button should be shown
  const showPrevButton = currentStep > 0 && !(step.actions?.prev?.hidden === true);
  
  // Get button labels
  const nextButtonLabel = nextLabel || 'Next';
  const prevButtonLabel = prevLabel || 'Back';
  
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        side="bottom" 
        className="p-0 rounded-t-xl" 
        dir={direction}
      >
        <div {...touchHandlers} className="touch-manipulation">
          {/* Drag handle for bottom sheet */}
          <div className="w-12 h-1.5 bg-muted mx-auto mt-2 rounded-full" />
          
          <SheetHeader className="p-4">
            <div className="flex justify-between items-center">
              <SheetTitle className="text-xl font-medium">{step.title}</SheetTitle>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onClose}
                className="h-8 w-8 mr-0"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <TourMobileProgress currentStep={currentStep} totalSteps={totalSteps} />
          </SheetHeader>
          
          <div className="p-4 pb-6 overflow-y-auto max-h-[60vh]">
            {step.media && (
              <div className="mb-4 flex justify-center">
                {step.media.type === 'image' && (
                  <img 
                    src={step.media.url} 
                    alt={step.media.alt || step.title} 
                    className="rounded-md max-h-36 object-contain"
                  />
                )}
                {step.media.type === 'video' && (
                  <video 
                    src={step.media.url}
                    className="rounded-md max-h-36 object-contain"
                    controls
                    muted
                    autoPlay
                    loop
                  />
                )}
              </div>
            )}
            
            <div className="text-base text-foreground prose-sm prose-slate dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: step.content || '' }} />
            </div>
          </div>
          
          <div className="flex justify-between p-4 border-t">
            <div>
              {showPrevButton && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onPrev}
                  className="gap-1"
                >
                  {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                  {prevButtonLabel}
                </Button>
              )}
            </div>
            
            <Button
              variant="default"
              size="sm"
              onClick={onNext}
              className="gap-1"
            >
              {isLastStep ? 'Finish' : nextButtonLabel}
              {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
