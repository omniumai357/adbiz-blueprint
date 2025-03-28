
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTourGestures } from '@/hooks/tour/useTourGestures';
import { useLanguage } from '@/contexts/language-context';
import { TourMobileProgress } from './TourMobileProgress';

interface TourMobileCompactViewProps {
  title: string;
  content: string;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  isRTL?: boolean;
  media?: {
    type: "image" | "video" | "gif";
    url: string;
    alt?: string;
  };
  nextLabel?: string;
  prevLabel?: string;
}

export const TourMobileCompactView: React.FC<TourMobileCompactViewProps> = ({
  title,
  content,
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onClose,
  isRTL: propIsRTL,
  media,
  nextLabel,
  prevLabel
}) => {
  const { isRTL: contextIsRTL } = useLanguage();
  const isRTL = propIsRTL !== undefined ? propIsRTL : contextIsRTL;
  
  // Set gesture handlers (with RTL support)
  const swipeLeftHandler = !isRTL ? onNext : onPrev;
  const swipeRightHandler = !isRTL ? onPrev : onNext;
  
  // Setup swipe gestures
  const { touchHandlers } = useTourGestures({
    onSwipeLeft: swipeLeftHandler,
    onSwipeRight: swipeRightHandler,
    threshold: 30, // Lower threshold for compact view
    preventScrollOnSwipe: false,
    vibrate: true
  });
  
  // Get button labels
  const nextButtonLabel = nextLabel || 'Next';
  const prevButtonLabel = prevLabel || 'Back';
  
  // Determine if we should show the previous button
  const showPrevButton = currentStep > 0;
  
  // Determine if this is the last step
  const isLastStep = currentStep === totalSteps - 1;
  
  return (
    <div
      className="fixed bottom-3 left-3 right-3 bg-background border rounded-lg shadow-lg overflow-hidden max-h-[40vh] touch-manipulation"
      {...touchHandlers}
    >
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="text-base font-semibold truncate pr-2">{title}</h3>
        <div className="flex items-center gap-2">
          <TourMobileProgress currentStep={currentStep} totalSteps={totalSteps} />
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-7 w-7 ml-1"
          >
            <X className="h-3.5 w-3.5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </div>
      
      <div className="p-3 overflow-y-auto max-h-[calc(40vh-6rem)]">
        <div className="text-sm prose-sm prose-slate dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
      
      <div className="flex justify-between items-center p-2 border-t">
        <div>
          {showPrevButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={onPrev}
              className="gap-1 h-7 text-xs px-2"
            >
              {isRTL ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
              {prevButtonLabel}
            </Button>
          )}
        </div>
        
        <Button
          variant="default"
          size="sm"
          onClick={onNext}
          className="gap-1 h-7 text-xs px-2"
        >
          {isLastStep ? 'Finish' : nextButtonLabel}
          {isRTL ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </Button>
      </div>
    </div>
  );
};
