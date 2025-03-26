
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, X } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerFooter } from "@/components/ui/drawer";
import { TourOverlay } from "./TourOverlay";
import { TourStep } from "@/contexts/tour-context";

interface TourMobileViewProps {
  currentStepData: TourStep;
  content: string;
  targetElement: HTMLElement | null;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  highlightAnimation: string;
}

export const TourMobileView: React.FC<TourMobileViewProps> = ({
  currentStepData,
  content,
  targetElement,
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onClose,
  highlightAnimation
}) => {
  // Handle swipe gestures for mobile
  const handleTouchStart = React.useRef<number | null>(null);
  const handleTouchMove = React.useRef<number | null>(null);
  
  const onTouchStart = (e: React.TouchEvent) => {
    handleTouchStart.current = e.targetTouches[0].clientX;
  };
  
  const onTouchMove = (e: React.TouchEvent) => {
    handleTouchMove.current = e.targetTouches[0].clientX;
  };
  
  const onTouchEnd = () => {
    if (!handleTouchStart.current || !handleTouchMove.current) return;
    
    const diff = handleTouchStart.current - handleTouchMove.current;
    const threshold = 50; // Minimum swipe distance
    
    if (diff > threshold) {
      // Swiped left - go next
      onNext();
    } else if (diff < -threshold) {
      // Swiped right - go previous
      if (currentStep > 0) {
        onPrev();
      }
    }
    
    // Reset values
    handleTouchStart.current = null;
    handleTouchMove.current = null;
  };

  // Render media content if provided
  const renderMedia = () => {
    const media = currentStepData.media;
    if (!media) return null;
    
    switch (media.type) {
      case "image":
        return (
          <div className="mt-2 mb-4 flex justify-center">
            <img 
              src={media.url} 
              alt={media.alt || currentStepData.title} 
              className="rounded-md max-h-36 object-contain"
            />
          </div>
        );
      case "video":
        return (
          <div className="mt-2 mb-4 flex justify-center">
            <video 
              src={media.url} 
              className="rounded-md max-h-36 object-contain" 
              controls
              muted
              autoPlay
              loop
            />
          </div>
        );
      case "gif":
        return (
          <div className="mt-2 mb-4 flex justify-center">
            <img 
              src={media.url} 
              alt={media.alt || currentStepData.title} 
              className="rounded-md max-h-36 object-contain"
            />
          </div>
        );
      default:
        return null;
    }
  };

  const isLastStep = currentStep === totalSteps - 1;
  const nextLabel = currentStepData.actions?.next?.label;
  const prevLabel = currentStepData.actions?.prev?.label;
  const skipLabel = currentStepData.actions?.skip?.label;

  return (
    <>
      <TourOverlay 
        targetElement={targetElement} 
        animation={highlightAnimation}
      />
      <Drawer open={true} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className="max-h-[85vh] overflow-auto">
          <div className="absolute right-4 top-3">
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <DrawerHeader className="pt-8 pb-2">
            <h3 className="text-xl font-semibold">{currentStepData.title}</h3>
          </DrawerHeader>
          
          <div 
            className="px-4 pb-4 text-muted-foreground animate-fade-in"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {renderMedia()}
            
            <p className="leading-relaxed">{content}</p>
            
            <div className="flex justify-center mt-4 text-sm text-muted-foreground font-medium">
              <span className="inline-flex items-center">
                {currentStep > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onPrev}
                    className="mr-2 h-8 px-2 text-xs"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Swipe right
                  </Button>
                )}
                <span className="px-2">
                  {currentStep + 1} / {totalSteps}
                </span>
                {currentStep < totalSteps - 1 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onNext}
                    className="ml-2 h-8 px-2 text-xs"
                  >
                    Swipe left
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </span>
            </div>
          </div>
          
          <DrawerFooter className="flex flex-row justify-between pt-2 pb-4">
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="outline" size="sm" onClick={onPrev}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {prevLabel || "Previous"}
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              {!isLastStep && (
                <Button variant="ghost" size="sm" onClick={onClose}>
                  {skipLabel || "Skip"}
                </Button>
              )}
              <Button size="sm" onClick={onNext}>
                {isLastStep ? 
                  (nextLabel || "Finish") : 
                  (nextLabel || "Next")}
                {!isLastStep && <ChevronRight className="h-4 w-4 ml-1" />}
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
