
import { useEffect, useCallback } from "react";

/**
 * Hook to handle keyboard navigation for tours
 * 
 * @param isActive Whether the tour is active
 * @param handleKeyNavigation Function to handle keyboard navigation events
 */
export function useTourKeyboardNavigation(
  isActive: boolean,
  handleKeyNavigation: (e: React.KeyboardEvent) => void
) {
  // Add keyboard navigation event listener
  useEffect(() => {
    if (!isActive) return;
    
    // Use a keydown listener for the document to handle keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isActive) {
        // Convert DOM KeyboardEvent to React KeyboardEvent (simplified) for our handler
        handleKeyNavigation(e as unknown as React.KeyboardEvent);
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    
    // Clean up the event listener
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActive, handleKeyNavigation]);
}
