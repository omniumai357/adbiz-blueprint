
import React from "react";
import { KeyboardShortcutsProvider } from "@/contexts/tour/KeyboardShortcutsContext";
import { TourGuideControllerInner } from "./TourGuideControllerInner";

/**
 * TourGuideController is the main component that orchestrates the tour experience.
 * It has been refactored into smaller components to improve maintainability.
 */
export const TourGuideController: React.FC = () => {
  return (
    <KeyboardShortcutsProvider>
      <TourGuideControllerInner />
    </KeyboardShortcutsProvider>
  );
};
