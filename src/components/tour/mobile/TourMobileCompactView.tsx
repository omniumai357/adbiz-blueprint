
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { TourMobileProgress } from "./TourMobileProgress";
import { TourMobileActions } from "./TourMobileActions";
import { useDevice } from "@/hooks/use-device";

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
  const { dimensions, isLandscape } = useDevice();
  const [expanded, setExpanded] = useState(false);
  
  // Use more compact layout for small screens or landscape orientation
  const isSmallMobile = dimensions.width < 380;
  const titleSize = isSmallMobile ? "text-lg" : "text-xl";

  // Position differently based on orientation
  const positionClass = isLandscape 
    ? "fixed top-4 right-4 max-w-sm" 
    : "fixed bottom-4 left-2 right-2";

  // Adjust content display based on orientation and space
  const contentClass = expanded || isLandscape
    ? "line-clamp-none"
    : "line-clamp-2";

  return (
    <div 
      className={cn(
        positionClass,
        "bg-background rounded-lg shadow-lg z-50 p-4",
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
        <div className="space-y-3 mt-2">
          <p 
            className={cn("text-sm text-muted-foreground", contentClass)}
            onClick={() => !isLandscape && setExpanded(!expanded)}
          >
            {content}
          </p>
          
          {!isLandscape && content.length > 120 && !expanded && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs py-0 h-6 px-2"
              onClick={() => setExpanded(true)}
            >
              Show more
            </Button>
          )}
        </div>
      )}
      
      <TourMobileActions
        currentStep={currentStep}
        totalSteps={totalSteps}
        onNext={onNext}
        onPrev={onPrev}
        onClose={onClose}
        nextLabel={nextLabel}
        prevLabel={prevLabel}
        deviceType="mobile"
        className={isLandscape ? "pt-1" : "pt-3"}
      />
    </div>
  );
};
