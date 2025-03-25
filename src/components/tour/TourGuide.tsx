import React, { useEffect, useState } from "react";
import { useTour } from "@/contexts/tour-context";
import { TourTooltip } from "./TourTooltip";
import { TourOverlay } from "./TourOverlay";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerFooter } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";

export const TourGuide: React.FC = () => {
  const {
    isActive,
    currentStepData,
    nextStep,
    prevStep,
    currentStep,
    totalSteps,
    endTour,
  } = useTour();
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const isMobile = useMediaQuery("(max-width: 640px)");

  // Track when elements become available in the DOM
  useEffect(() => {
    if (isActive && currentStepData) {
      const findElement = () => {
        const element = document.getElementById(currentStepData.elementId);
        if (element) {
          setTargetElement(element);
          clearInterval(checkInterval);
        }
      };

      findElement();
      // Keep checking until the element is found (for lazy-loaded components)
      const checkInterval = setInterval(findElement, 100);

      return () => clearInterval(checkInterval);
    } else {
      setTargetElement(null);
    }
  }, [isActive, currentStepData]);

  if (!isActive || !currentStepData) {
    return null;
  }

  // For mobile devices, use a drawer at the bottom of the screen
  if (isMobile) {
    return (
      <>
        <TourOverlay targetElement={targetElement} />
        <Drawer open={true} onOpenChange={(open) => !open && endTour()}>
          <DrawerContent>
            <DrawerHeader>
              <h3 className="text-lg font-semibold">{currentStepData.title}</h3>
            </DrawerHeader>
            <div className="px-4 pb-2">
              <p className="text-muted-foreground">{currentStepData.content}</p>
            </div>
            <DrawerFooter className="flex flex-row justify-between">
              <div className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {totalSteps}
              </div>
              <div className="flex gap-2">
                {currentStep > 0 && (
                  <Button variant="outline" size="sm" onClick={prevStep}>
                    Previous
                  </Button>
                )}
                <Button size="sm" onClick={nextStep}>
                  {currentStep === totalSteps - 1 ? "Finish" : "Next"}
                </Button>
              </div>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  // For desktop, use tooltips that point to elements
  return (
    <>
      <TourOverlay targetElement={targetElement} />
      {targetElement && (
        <TourTooltip
          targetElement={targetElement}
          position={currentStepData.position || "bottom"}
          title={currentStepData.title}
          content={currentStepData.content}
          stepInfo={`${currentStep + 1} of ${totalSteps}`}
          onPrev={currentStep > 0 ? prevStep : undefined}
          onNext={nextStep}
          onClose={endTour}
          isLastStep={currentStep === totalSteps - 1}
        />
      )}
    </>
  );
};
