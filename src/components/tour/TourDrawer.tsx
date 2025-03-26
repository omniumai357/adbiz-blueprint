
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, X } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerFooter } from "@/components/ui/drawer";

interface TourDrawerProps {
  title: string;
  content: string;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

export const TourDrawer: React.FC<TourDrawerProps> = ({
  title,
  content,
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onClose
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

  return (
    <Drawer open={true} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[85vh] overflow-auto">
        <div className="absolute right-4 top-3">
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <DrawerHeader className="pt-8 pb-2">
          <h3 className="text-xl font-semibold">{title}</h3>
        </DrawerHeader>
        
        <div 
          className="px-4 pb-4 text-muted-foreground animate-fade-in"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
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
                Previous
              </Button>
            )}
          </div>
          <Button size="sm" onClick={onNext}>
            {currentStep === totalSteps - 1 ? "Finish" : "Next"}
            {currentStep < totalSteps - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
