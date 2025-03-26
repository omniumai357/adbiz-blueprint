
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, X } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerFooter } from "@/components/ui/drawer";
import { TourOverlay } from "./TourOverlay";
import { TourStep } from "@/contexts/tour-context";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

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
  // Handle swipe gestures for mobile
  const handleTouchStart = React.useRef<number | null>(null);
  const handleTouchMove = React.useRef<number | null>(null);
  const [progressValue, setProgressValue] = React.useState(0);
  
  React.useEffect(() => {
    // Calculate progress percentage
    setProgressValue(((currentStep + 1) / totalSteps) * 100);
  }, [currentStep, totalSteps]);
  
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

  // Animation class mappings with enhanced options
  const animationClasses = {
    "fade-in": "animate-fade-in",
    "scale-in": "animate-scale-in",
    "slide-in": "animate-slide-in-right",
    "enter": "animate-enter",
    "float": "animate-float",
    "fade-up": "animate-fade-up",
    "zoom-in": "animate-zoom-in",
    "slide-up": "animate-slide-up",
    "slide-down": "animate-slide-down"
  };
  
  // Get animation class based on transition type
  const getAnimationClass = () => {
    if (!transition || transition.type === "none") return "animate-fade-in";
    
    const { type, direction = "up" } = transition;
    
    const mappings = {
      fade: "animate-fade-in",
      slide: `animate-slide-in-${direction}`,
      zoom: "animate-zoom-in",
      flip: "animate-flip"
    };
    
    return mappings[type] || "animate-fade-in";
  };

  // Render step dots to show progress
  const renderStepDots = () => {
    return (
      <div className="flex justify-center space-x-1 mt-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div 
            key={index}
            className={cn(
              "h-2 w-2 rounded-full transition-all duration-300",
              index === currentStep 
                ? "bg-primary scale-125" 
                : index < currentStep 
                  ? "bg-primary/60" 
                  : "bg-gray-300"
            )}
          />
        ))}
      </div>
    );
  };

  // Render media content if provided
  const renderMedia = () => {
    const media = currentStepData.media;
    if (!media) return null;
    
    const mediaAnimation = media.animation || "fade-in";
    const animationClass = animationClasses[mediaAnimation as keyof typeof animationClasses] || "animate-fade-in";
    
    switch (media.type) {
      case "image":
        return (
          <div className="mt-2 mb-4 flex justify-center">
            <img 
              src={media.url} 
              alt={media.alt || currentStepData.title} 
              className={cn("rounded-md max-h-36 object-contain", animationClass)}
            />
          </div>
        );
      case "video":
        return (
          <div className="mt-2 mb-4 flex justify-center">
            <video 
              src={media.url} 
              className={cn("rounded-md max-h-36 object-contain", animationClass)}
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
              className={cn("rounded-md max-h-36 object-contain", animationClass)}
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

  // Ensure target element is scrolled into view with a smooth animation when available
  React.useEffect(() => {
    if (targetElement && targetElement.scrollIntoView) {
      setTimeout(() => {
        targetElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center'
        });
      }, 100);
    }
  }, [targetElement, currentStep]);

  return (
    <>
      <TourOverlay 
        targetElement={targetElement} 
        animation={highlightAnimation}
        spotlight={spotlight}
        transition={transition}
      />
      <Drawer open={true} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className={cn("max-h-[85vh] overflow-auto", getAnimationClass())}>
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
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Progress bar */}
            <Progress value={progressValue} className="h-1 mb-4" />
            
            {/* Step dots for smaller tours */}
            {totalSteps <= 8 && renderStepDots()}
            
            {renderMedia()}
            
            <p className="leading-relaxed mt-3">{content}</p>
            
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
              <Button 
                size="sm" 
                onClick={onNext} 
                className={cn("animate-pulse-subtle", isLastStep ? "bg-green-500 hover:bg-green-600" : "")}
              >
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
