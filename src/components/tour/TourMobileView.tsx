
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerFooter } from "@/components/ui/drawer";
import { TourOverlay } from "./TourOverlay";
import { TourStep } from "@/contexts/tour-context";
import { cn } from "@/lib/utils";
import { useTourGestures } from "@/hooks/tour/useTourGestures";
import { TourMobileProgress } from "./mobile/TourMobileProgress";
import { TourMobileMedia } from "./mobile/TourMobileMedia";
import { TourMobileSwipeHint } from "./mobile/TourMobileSwipeHint";
import { TourMobileActions } from "./mobile/TourMobileActions";
import { useTooltipAnimation } from "./tooltip/useTooltipAnimation";

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
  transition?: {
    type: "fade" | "slide" | "zoom" | "flip" | "none";
    direction?: "up" | "down" | "left" | "right";
    duration?: number;
  };
  spotlight?: {
    intensity?: "low" | "medium" | "high";
    color?: string;
    pulseEffect?: boolean;
    fadeBackground?: boolean;
  };
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
  highlightAnimation,
  transition,
  spotlight
}) => {
  const [isScrolling, setIsScrolling] = useState(false);
  
  // Initialize gesture handlers
  const { touchHandlers } = useTourGestures({
    onSwipeLeft: onNext,
    onSwipeRight: currentStep > 0 ? onPrev : undefined,
  });
  
  // Get animation class
  const { animationClass } = useTooltipAnimation(
    currentStepData.animation?.entry || "fade-in",
    transition
  );
  
  // Ensure target element is scrolled into view with a smooth animation
  useEffect(() => {
    if (targetElement && targetElement.scrollIntoView) {
      setIsScrolling(true);
      const timeout = setTimeout(() => {
        targetElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center'
        });
        // Reset scrolling state after animation completes
        setTimeout(() => setIsScrolling(false), 500);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [targetElement, currentStep]);

  // Extract action labels
  const nextLabel = currentStepData.actions?.next?.label;
  const prevLabel = currentStepData.actions?.prev?.label;
  const skipLabel = currentStepData.actions?.skip?.label;

  return (
    <>
      <TourOverlay 
        targetElement={targetElement} 
        animation={highlightAnimation}
        spotlight={spotlight}
        transition={transition}
      />
      <Drawer open={true} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className={cn("max-h-[85vh] overflow-auto", animationClass)}>
          <div className="absolute right-4 top-3">
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <DrawerHeader className="pt-8 pb-2">
            <h3 className="text-xl font-semibold">{currentStepData.title}</h3>
          </DrawerHeader>
          
          <div 
            className="px-4 pb-4 text-muted-foreground"
            {...touchHandlers}
          >
            {/* Progress indicators */}
            <TourMobileProgress 
              currentStep={currentStep} 
              totalSteps={totalSteps} 
            />
            
            {/* Media content */}
            <TourMobileMedia currentStepData={currentStepData} />
            
            {/* Step content */}
            <p className="leading-relaxed mt-3">{content}</p>
            
            {/* Swipe indicators */}
            <TourMobileSwipeHint 
              currentStep={currentStep} 
              totalSteps={totalSteps} 
              onNext={onNext} 
              onPrev={onPrev} 
            />
          </div>
          
          <DrawerFooter>
            <TourMobileActions 
              currentStep={currentStep}
              totalSteps={totalSteps}
              onNext={onNext}
              onPrev={onPrev}
              onClose={onClose}
              nextLabel={nextLabel}
              prevLabel={prevLabel}
              skipLabel={skipLabel}
            />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
