
import React from 'react';
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { TourMobileMedia } from "./TourMobileMedia";
import { TourMobileProgress } from "./TourMobileProgress";
import { TourMobileActions } from "./TourMobileActions";
import { TourStep } from "@/contexts/tour/types";

interface TourBottomSheetViewProps {
  step: TourStep;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  currentStep: number;
  totalSteps: number;
  isLastStep: boolean;
  direction: 'ltr' | 'rtl';
}

export const TourBottomSheetView: React.FC<TourBottomSheetViewProps> = ({
  step,
  isOpen,
  onClose,
  onNext,
  onPrev,
  currentStep,
  totalSteps,
  isLastStep,
  direction
}) => {
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent dir={direction} className="max-h-[85vh]">
        <DrawerHeader className="pb-2">
          <div className="flex justify-between items-center">
            <DrawerTitle className="text-lg font-medium">{step.title}</DrawerTitle>
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
        </DrawerHeader>
        
        <div className="px-4 overflow-y-auto">
          {step.media && (
            <TourMobileMedia currentStepData={step} className="mb-3" />
          )}
          
          <DrawerDescription className="text-sm text-foreground">
            <div dangerouslySetInnerHTML={{ __html: step.content || '' }} />
          </DrawerDescription>
        </div>
        
        <DrawerFooter>
          <TourMobileActions 
            currentStep={currentStep}
            totalSteps={totalSteps}
            onNext={onNext}
            onPrev={onPrev}
            onClose={onClose}
            nextLabel={step.actions?.next?.text}
            prevLabel={step.actions?.prev?.text}
            skipLabel={step.actions?.skip?.text}
            deviceType="mobile"
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
