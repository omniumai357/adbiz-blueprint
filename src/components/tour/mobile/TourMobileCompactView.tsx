
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { TourMobileProgress } from "./TourMobileProgress";

interface TourMobileCompactViewProps {
  title: string;
  content?: string;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  nextLabel?: string;
  prevLabel?: string;
}

export const TourMobileCompactView: React.FC<TourMobileCompactViewProps> = ({
  title,
  content,
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onClose,
  nextLabel,
  prevLabel
}) => {
  const isSmallMobile = window.innerWidth < 380;
  const titleSize = isSmallMobile ? "text-lg" : "text-xl";

  return (
    <div 
      className={cn(
        "fixed bottom-4 left-2 right-2 bg-background rounded-lg shadow-lg z-50 p-4",
        "border border-border animate-slide-in-up"
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className={cn("font-semibold", titleSize)}>{title}</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 -mt-1 -mr-2">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <TourMobileProgress 
        currentStep={currentStep} 
        totalSteps={totalSteps} 
      />
      
      {content && (
        <p className="text-sm text-muted-foreground mt-2 mb-3 line-clamp-2">{content}</p>
      )}
      
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
  );
};
