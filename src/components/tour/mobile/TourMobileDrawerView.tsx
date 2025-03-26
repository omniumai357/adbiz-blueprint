
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerFooter } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { TourStep } from "@/contexts/tour-context";
import { TourMobileProgress } from "./TourMobileProgress";
import { TourMobileMedia } from "./TourMobileMedia";
import { TourMobileSwipeHint } from "./TourMobileSwipeHint";
import { TourMobileActions } from "./TourMobileActions";

interface TourMobileDrawerViewProps {
  currentStepData: TourStep;
  content: string;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  animationClass: string;
  touchHandlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
  };
  deviceType: "mobile" | "tablet" | "desktop";
}

export const TourMobileDrawerView: React.FC<TourMobileDrawerViewProps> = ({
  currentStepData,
  content,
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onClose,
  animationClass,
  touchHandlers,
  deviceType
}) => {
  const isSmallMobile = window.innerWidth < 380;
  const titleSize = isSmallMobile ? "text-lg" : "text-xl";
  const drawerHeight = isSmallMobile ? "max-h-[90vh]" : "max-h-[85vh]";
  const isTablet = deviceType === "tablet";

  return (
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
            deviceType={deviceType}
          />
        </div>
        
        <DrawerFooter>
          <TourMobileActions 
            currentStep={currentStep}
            totalSteps={totalSteps}
            onNext={onNext}
            onPrev={onPrev}
            onClose={onClose}
            nextLabel={currentStepData.actions?.next?.label}
            prevLabel={currentStepData.actions?.prev?.label}
            skipLabel={currentStepData.actions?.skip?.label}
            deviceType={deviceType}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
