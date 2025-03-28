
import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { TourStep } from "@/contexts/tour/types";
import { useTourGestures } from "@/hooks/tour/useTourGestures";

interface TourBottomSheetViewProps {
  step: TourStep;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  currentStep: number;
  totalSteps: number;
  isLastStep: boolean;
  direction: "ltr" | "rtl";
  title?: string;
  content?: string;
  nextLabel?: string;
  prevLabel?: string;
}

/**
 * TourBottomSheetView Component
 * 
 * A mobile-optimized sheet that slides up from the bottom of the screen.
 * Designed specifically for portrait orientation on phones.
 */
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
  title: propTitle,
  content: propContent,
  nextLabel = "Next",
  prevLabel = "Previous"
}) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  
  // Sync sheet state with the isOpen prop
  useEffect(() => {
    // Slight delay to ensure smooth animation
    const timer = setTimeout(() => {
      setSheetOpen(isOpen);
    }, 50);
    
    return () => clearTimeout(timer);
  }, [isOpen]);
  
  // Handle sheet close
  const handleSheetClose = () => {
    setSheetOpen(false);
    onClose();
  };
  
  // Use props or fallback to step properties
  const title = propTitle || step.title;
  const content = propContent || step.content;
  
  // Extract media from step if available
  const media = step.media ? {
    type: step.media.type,
    url: step.media.url,
    alt: step.media.alt || step.title
  } : undefined;
  
  // Create RTL-aware navigation
  const isRTL = direction === "rtl";
  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;
  
  // Use gesture hooks for better touch interaction
  const { touchHandlers } = useTourGestures({
    onSwipeLeft: !isRTL ? onNext : onPrev,
    onSwipeRight: !isRTL ? onPrev : onNext,
    preventScrollOnSwipe: true,
    vibrate: true
  });
  
  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetContent 
        side="bottom" 
        className="rounded-t-xl p-0 overflow-hidden max-h-[90vh] focus:outline-none"
      >
        <div 
          className="flex flex-col h-full focus:outline-none"
          {...touchHandlers}
        >
          {/* Header with close button */}
          <SheetHeader className="px-4 pt-4 pb-2 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl">{title}</SheetTitle>
              <Button variant="ghost" size="icon" onClick={handleSheetClose} className="h-8 w-8">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <div className="flex items-center justify-center -mt-1">
              <div className="w-10 h-1 bg-muted rounded-full" />
            </div>
          </SheetHeader>
          
          {/* Media content */}
          {media && (
            <div className="px-4 pt-4">
              {media.type === "image" ? (
                <img 
                  src={media.url} 
                  alt={media.alt} 
                  className="rounded-lg w-full object-cover max-h-[200px]" 
                />
              ) : media.type === "video" ? (
                <video 
                  src={media.url} 
                  controls 
                  className="rounded-lg w-full max-h-[200px]" 
                />
              ) : null}
            </div>
          )}
          
          {/* Content */}
          <div className="px-4 py-4 overflow-y-auto flex-grow">
            <div className="prose prose-sm dark:prose-invert">
              {content}
            </div>
          </div>
          
          {/* Swipe hint indicator */}
          <div className="flex justify-center items-center py-2 text-xs text-muted-foreground">
            <span className="flex items-center">
              {currentStep > 0 && (
                <>
                  <PrevIcon className="h-3 w-3 mr-1" />
                  <span className="mr-2">Swipe right for previous</span>
                </>
              )}
              <span className="mx-2">
                {currentStep + 1} of {totalSteps}
              </span>
              {!isLastStep && (
                <>
                  <span className="ml-2">Swipe left for next</span>
                  <NextIcon className="h-3 w-3 ml-1" />
                </>
              )}
            </span>
          </div>
          
          {/* Footer with navigation buttons */}
          <SheetFooter className="px-4 py-3 border-t flex-shrink-0">
            <div className="flex items-center justify-between w-full">
              <div className="flex-1">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onPrev}
                    className="flex items-center gap-1"
                  >
                    <PrevIcon className="h-4 w-4" />
                    {prevLabel}
                  </Button>
                )}
              </div>
              
              <div className="flex-1 flex justify-end">
                <Button
                  size="sm"
                  onClick={isLastStep ? handleSheetClose : onNext}
                  className="flex items-center gap-1"
                >
                  {isLastStep ? (
                    <>
                      Finish
                      <X className="h-4 w-4 ml-1" />
                    </>
                  ) : (
                    <>
                      {nextLabel}
                      <NextIcon className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};
