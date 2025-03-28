
import React from "react";
import { TourGuideController } from "./guide/TourGuideController";
import { ResponsiveTourProvider } from "@/contexts/tour/ResponsiveTourContext";

/**
 * TourGuide component that serves as the main entry point for the tour functionality
 * This component has been refactored to use the ResponsiveTourProvider
 */
export const TourGuide: React.FC = () => {
  return (
    <div 
      role="region" 
      aria-label="Application tour" 
      className="tour-guide-root"
    >
      <ResponsiveTourProvider>
        <TourGuideController />
      </ResponsiveTourProvider>
    </div>
  );
};
