
import React from "react";
import { TourMedia } from "../tooltip/TourMedia";
import { TourStep } from "@/contexts/tour-context";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

interface TourMobileMediaProps {
  currentStepData: TourStep;
  className?: string;
}

export const TourMobileMedia: React.FC<TourMobileMediaProps> = ({ 
  currentStepData,
  className 
}) => {
  const isLandscape = useMediaQuery("(orientation: landscape)");
  
  if (!currentStepData.media) return null;
  
  // Calculate max height based on orientation
  const maxHeight = isLandscape ? "max-h-24" : "max-h-36";
  
  return (
    <div className={cn("mt-2 mb-4", className)}>
      <TourMedia 
        media={currentStepData.media} 
        title={currentStepData.title}
        className={cn("rounded-md mx-auto", maxHeight)}
      />
    </div>
  );
};
