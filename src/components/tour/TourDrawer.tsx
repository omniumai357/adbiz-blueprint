
import React from "react";
import { Button } from "@/components/ui/button";
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
  return (
    <Drawer open={true} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        <DrawerHeader>
          <h3 className="text-lg font-semibold">{title}</h3>
        </DrawerHeader>
        <div className="px-4 pb-2">
          <p className="text-muted-foreground">{content}</p>
        </div>
        <DrawerFooter className="flex flex-row justify-between">
          <div className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {totalSteps}
          </div>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" size="sm" onClick={onPrev}>
                Previous
              </Button>
            )}
            <Button size="sm" onClick={onNext}>
              {currentStep === totalSteps - 1 ? "Finish" : "Next"}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
