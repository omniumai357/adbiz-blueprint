
import React from "react";
import { TourGuideController } from "./guide/TourGuideController";

/**
 * TourGuide component that serves as the main entry point for the tour functionality
 * This component has been refactored to be a thin wrapper around the TourGuideController
 * which handles the core tour logic and rendering
 */
export const TourGuide: React.FC = () => {
  return (
    <div 
      role="region" 
      aria-label="Application tour" 
      className="tour-guide-root"
    >
      <TourGuideController />
    </div>
  );
};
