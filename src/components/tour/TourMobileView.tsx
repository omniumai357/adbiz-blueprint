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
import { useIsMobile } from "@/hooks/use-mobile";
import { useDevice } from "@/hooks/use-device";

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
  onShowKeyboardShortcuts?: () => void;
  deviceType?: "mobile" | "tablet" | "desktop";
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
  spotlight,
  onShowKeyboardShortcuts,
  deviceType = "mobile"
}) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { deviceType: detectedDeviceType, hasTouchCapability } = useDevice();
  const actualDeviceType = deviceType || detectedDeviceType;
  const isSmallMobile = useMediaQuery("(max-width: 380px)");
  
  const { touchHandlers } = useTourGestures({
    onSwipeLeft: !isAnimating ? onNext : undefined,
    onSwipeRight: !isAnimating && currentStep > 0 ? onPrev : undefined,
    preventDefaultOnSwipe: true,
  });
  
  const { animationClass } = useTooltipAnimation(
    currentStepData.animation?.entry || "fade-in",
    transition
  );
  
  useEffect(() => {
    setIsAnimating(true);
    const timeout = setTimeout(() => {
      setIsAnimating(false);
    }, transition?.duration || 300);
    
    return () => clearTimeout(timeout);
  }, [currentStep, transition]);
  
  useEffect(() => {
    if (targetElement && targetElement.scrollIntoView) {
      setIsScrolling(true);
      const timeout = setTimeout(() => {
        targetElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center'
        });
        setTimeout(() => setIsScrolling(false), 500);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [targetElement, currentStep]);

  const nextLabel = currentStepData.actions?.next?.label;
  const prevLabel = currentStepData.actions?.prev?.label;
  const skipLabel = currentStepData.actions?.skip?.label;

  const titleSize = isSmallMobile ? "text-lg" : "text-xl";
  const drawerHeight = isSmallMobile ? "max-h-[90vh]" : "max-h-[85vh]";

  const isTablet = actualDeviceType === "tablet";
  const useCompactView = useMediaQuery("(max-height: 500px) and (orientation: landscape)") || 
                         (isTablet && useMediaQuery("(orientation: landscape)"));

  return (
    <>
      <TourOverlay 
        targetElement={targetElement} 
        animation={highlightAnimation}
        spotlight={spotlight}
        transition={transition}
      />
      
      {useCompactView ? (
        <div 
          className={cn(
            "fixed bottom-4 left-2 right-2 bg-background rounded-lg shadow-lg z-50 p-4",
            "border border-border animate-slide-in-up"
          )}
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className={cn("font-semibold", titleSize)}>{currentStepData.title}</h3>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 -mt-1 -mr-2">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <TourMobileProgress 
            currentStep={currentStep} 
            totalSteps={totalSteps} 
          />
          
          <div className="flex justify-end space-x-2 mt-4">
            {currentStep > 0 && (
              <Button variant="outline" size="sm" onClick={onPrev}>
                {prevLabel || "Previous"}
              </Button>
            )}
            <Button size="sm" onClick={onNext}>
              {currentStep === totalSteps - 1 ? (nextLabel || "Finish") : (nextLabel || "Next")}
            </Button>
          </div>
        </div>
      ) : (
        <Drawer open={true} onOpenChange={(open) => !open && onClose()}>
          <DrawerContent className={cn(
            drawerHeight, 
            "overflow-auto", 
            animationClass,
            isTablet ? "tablet-optimized-drawer max-w-[800px] mx-auto" : ""
          )}>
            <div className="absolute right-4 top-3">
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <DrawerHeader className={cn("pt-8 pb-2", isTablet ? "px-6" : "")}>
              <h3 className={cn("font-semibold", titleSize)}>{currentStepData.title}</h3>
            </DrawerHeader>
            
            <div 
              className={cn("px-4 pb-4 text-muted-foreground", isTablet ? "px-6" : "")}
              {...touchHandlers}
            >
              <TourMobileProgress 
                currentStep={currentStep} 
                totalSteps={totalSteps} 
                variant={isTablet ? "full" : "standard"}
              />
              
              <TourMobileMedia 
                currentStepData={currentStepData}
                className={isTablet ? "mt-4 mb-6" : ""}
              />
              
              <p className={cn(
                "leading-relaxed mt-3",
                isTablet ? "text-base" : "text-sm"
              )}>
                {content}
              </p>
              
              <TourMobileSwipeHint 
                currentStep={currentStep} 
                totalSteps={totalSteps} 
                onNext={onNext} 
                onPrev={onPrev}
                deviceType={actualDeviceType}
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
                deviceType={actualDeviceType}
              />
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
