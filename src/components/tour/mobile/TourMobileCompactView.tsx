
import React from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useTourGestures } from "@/hooks/tour/useTourGestures";

interface TourMobileCompactViewProps {
  title: string;
  content: string;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  nextLabel?: string;
  prevLabel?: string;
  isRTL?: boolean;
  media?: {
    type: 'image' | 'video';
    url: string;
    alt?: string;
  };
}

/**
 * TourMobileCompactView Component
 * 
 * A space-efficient view for mobile devices in landscape orientation
 * where vertical space is limited.
 */
export const TourMobileCompactView: React.FC<TourMobileCompactViewProps> = ({
  title,
  content,
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onClose,
  nextLabel = "Next",
  prevLabel = "Previous",
  isRTL = false,
  media
}) => {
  const isLastStep = currentStep === totalSteps - 1;
  const showPrevButton = currentStep > 0;
  
  // Swap directions for RTL layout
  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;
  
  // Use gesture hooks for better touch interaction
  const { touchHandlers } = useTourGestures({
    onSwipeLeft: !isRTL ? onNext : onPrev,
    onSwipeRight: !isRTL ? onPrev : onNext,
    threshold: 30, // Lower threshold for smaller component
    vibrate: true
  });
  
  return (
    <div className="fixed bottom-2 right-2 z-50 max-w-[350px] w-full sm:w-auto">
      <Card 
        className="shadow-lg border border-border"
        {...touchHandlers}
      >
        <CardHeader className="p-3 pb-0 flex flex-row items-center">
          <CardTitle className="text-base flex-grow">{title}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 rounded-full p-0"
            onClick={onClose}
            aria-label="Close tour"
          >
            <X className="h-3.5 w-3.5" />
            <span className="sr-only">Close</span>
          </Button>
        </CardHeader>
        
        <div className="flex flex-row p-3">
          {media && (
            <div className="pr-2 flex-shrink-0 w-1/3">
              {media.type === 'image' ? (
                <img 
                  src={media.url} 
                  alt={media.alt || title} 
                  className="rounded-sm object-cover h-[80px] w-full"
                />
              ) : (
                <video 
                  src={media.url} 
                  controls 
                  className="rounded-sm h-[80px] w-full"
                />
              )}
            </div>
          )}
          
          <CardContent className="p-0 text-sm max-h-[80px] overflow-y-auto flex-grow">
            {content}
          </CardContent>
        </div>
        
        <CardFooter className="p-3 pt-0 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {currentStep + 1} of {totalSteps}
          </div>
          
          <div className="flex items-center gap-1">
            {showPrevButton && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={onPrev}
              >
                <PrevIcon className="h-3 w-3 mr-1" />
                {prevLabel}
              </Button>
            )}
            
            <Button
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={isLastStep ? onClose : onNext}
            >
              {isLastStep ? "Finish" : nextLabel}
              {!isLastStep && <NextIcon className="h-3 w-3 ml-1" />}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
