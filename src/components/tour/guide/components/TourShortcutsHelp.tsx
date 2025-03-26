
import React from "react";
import { useKeyboardShortcuts } from "@/contexts/tour/KeyboardShortcutsContext";
import { TourKeyboardShortcutsHelp } from "../TourKeyboardShortcutsHelp";

export const TourShortcutsHelp: React.FC = () => {
  const { showKeyboardHelp, closeKeyboardShortcutsHelp } = useKeyboardShortcuts();
  
  if (!showKeyboardHelp) {
    return null;
  }
  
  return <TourKeyboardShortcutsHelp onClose={closeKeyboardShortcutsHelp} />;
};
