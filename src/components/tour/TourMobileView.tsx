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
import { useDevice } from "@/hooks/use-mobile";

import { TourMobileCompactView } from "./mobile/TourMobileCompactView";
import { TourMobileDrawerView } from "./mobile/TourMobileDrawerView";

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

  const useCompactView = useMediaQuery("(max-height: 500px) and (orientation: landscape)") || 
                         (actualDeviceType === "tablet" && useMediaQuery("(orientation: landscape)"));

  return (
    <>
      <TourOverlay 
        targetElement={targetElement} 
        animation={highlightAnimation}
        spotlight={spotlight}
        transition={transition}
      />
      
      {useCompactView ? (
        <TourMobileCompactView 
          title={currentStepData.title}
          content={content}
          currentStep={currentStep}
          totalSteps={totalSteps}
          onNext={onNext}
          onPrev={onPrev}
          onClose={onClose}
          nextLabel={currentStepData.actions?.next?.label}
          prevLabel={currentStepData.actions?.prev?.label}
        />
      ) : (
        <TourMobileDrawerView
          currentStepData={currentStepData}
          content={content}
          currentStep={currentStep}
          totalSteps={totalSteps}
          onNext={onNext}
          onPrev={onPrev}
          onClose={onClose}
          animationClass={animationClass}
          touchHandlers={touchHandlers}
          deviceType={actualDeviceType}
        />
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
