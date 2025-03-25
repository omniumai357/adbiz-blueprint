import { useState, useEffect } from "react";
import { TourStep } from "@/contexts/tour-context";

/**
 * Hook to find and track tour target elements in the DOM
 * 
 * @param isActive Whether the tour is active
 * @param currentStepData Current tour step data
 * @returns Object containing the target element
 */
export function useTourElementFinder(
  isActive: boolean,
  currentStepData: TourStep | null
) {
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  // Track when elements become available in the DOM
  useEffect(() => {
    if (isActive && currentStepData) {
      const findElement = () => {
        const element = document.getElementById(currentStepData.elementId);
        if (element) {
          setTargetElement(element);
          clearInterval(checkInterval);
        }
      };

      findElement();
      // Keep checking until the element is found (for lazy-loaded components)
      const checkInterval = setInterval(findElement, 100);

      return () => clearInterval(checkInterval);
    } else {
      setTargetElement(null);
    }
  }, [isActive, currentStepData]);

  return { targetElement };
}
