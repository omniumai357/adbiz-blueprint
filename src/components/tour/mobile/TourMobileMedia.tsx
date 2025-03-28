
import React from "react";
import { TourMedia } from "../tooltip/TourMedia";
import { TourStep } from "@/contexts/tour/types";
import { cn } from "@/lib/utils";
import { useResponsive } from "@/hooks/useResponsive";

interface TourMobileMediaProps {
  currentStepData: TourStep;
  className?: string;
}

export const TourMobileMedia: React.FC<TourMobileMediaProps> = ({ 
  currentStepData,
  className 
}) => {
  const { isLandscape } = useResponsive();
  
  if (!currentStepData.media) return null;
  
  // Calculate max height based on orientation
  const maxHeight = isLandscape ? "max-h-24" : "max-h-36";
  
  // Convert the media format to the one expected by TourMedia
  const mediaForTooltip = {
    type: currentStepData.media.type,
    url: currentStepData.media.source, // Map source to url
    alt: currentStepData.media.alt || currentStepData.title,
    animation: currentStepData.media.animation
  };
  
  return (
    <div className={cn("mt-2 mb-4", className)}>
      <TourMedia 
        media={mediaForTooltip} 
        title={currentStepData.title}
        className={cn("rounded-md mx-auto", maxHeight)}
      />
    </div>
  );
};
