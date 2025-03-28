
import React from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { TourMobileMedia } from "../mobile/TourMobileMedia";
import { TourMobileProgress } from "../mobile/TourMobileProgress";
import { TourMobileActions } from "../mobile/TourMobileActions";
import { TourStep } from "@/contexts/tour/types";
import { cn } from "@/lib/utils";

interface TourDrawerViewProps {
  step: TourStep;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  currentStep: number;
  totalSteps: number;
  isLastStep: boolean;
  isTablet: boolean;
  isLandscape: boolean;
  direction: 'ltr' | 'rtl';
}

export const TourDrawerView: React.FC<TourDrawerViewProps> = ({
  step,
  isOpen,
  onClose,
  onNext,
  onPrev,
  currentStep,
  totalSteps,
  isLastStep,
  isTablet,
  isLandscape,
  direction
}) => {
  // Choose side of drawer based on tablet and orientation
  const side = isTablet && !isLandscape ? 'right' : 'bottom';
  
  // For tablets in landscape, we adjust width
  const sideWidth = isTablet && isLandscape ? 'w-1/3' : '';

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        side={side} 
        className={cn(
          "p-0 overflow-hidden",
          isTablet ? "max-w-md" : "w-full",
          sideWidth
        )}
        dir={direction}
      >
        <SheetHeader className="p-4 border-b">
          <div className="flex justify-between items-center">
            <SheetTitle className="text-xl font-medium">{step.title}</SheetTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <TourMobileProgress currentStep={currentStep} totalSteps={totalSteps} />
        </SheetHeader>
        
        <div className="px-4 py-6 overflow-y-auto max-h-[60vh]">
          {step.media && (
            <TourMobileMedia currentStepData={step} className="mb-4" />
          )}
          
          <SheetDescription className="text-base text-foreground">
            <div dangerouslySetInnerHTML={{ __html: step.content || '' }} />
          </SheetDescription>
        </div>
        
        <div className="border-t p-4">
          <TourMobileActions 
            currentStep={currentStep}
            totalSteps={totalSteps}
            onNext={onNext}
            onPrev={onPrev}
            onClose={onClose}
            nextLabel={step.actions?.next?.text}
            prevLabel={step.actions?.prev?.text}
            skipLabel={step.actions?.skip?.text}
            deviceType={isTablet ? "tablet" : "mobile"}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
