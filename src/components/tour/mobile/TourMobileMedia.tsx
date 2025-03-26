
import React from "react";
import { TourMedia } from "../tooltip/TourMedia";
import { TourStep } from "@/contexts/tour-context";

interface TourMobileMediaProps {
  currentStepData: TourStep;
}

export const TourMobileMedia: React.FC<TourMobileMediaProps> = ({ currentStepData }) => {
  if (!currentStepData.media) return null;
  
  return (
    <TourMedia 
      media={currentStepData.media} 
      title={currentStepData.title} 
    />
  );
};
