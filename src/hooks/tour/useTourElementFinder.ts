
import { useState, useEffect } from "react";
import { TourStep } from "@/contexts/tour/types";
import { getBestTooltipPosition } from "@/lib/utils/dom-utils";

/**
 * Hook to find and track tour target elements in the DOM
 * 
 * @param isActive Whether the tour is active
 * @param currentStepData Current tour step data
 * @returns Object containing the target element and optimized position
 */
export function useTourElementFinder(
  isActive: boolean,
  currentStepData: TourStep | null
) {
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [optimizedPosition, setOptimizedPosition] = useState<"top" | "right" | "bottom" | "left" | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 20; // Try for 2 seconds (100ms intervals)

  // Track when elements become available in the DOM
  useEffect(() => {
    if (isActive && currentStepData) {
      let checkInterval: number | null = null;
      let currentRetries = 0;
      
      const findElement = () => {
        // Try with ID first (preferred method)
        let element = document.getElementById(currentStepData.elementId);
        
        // If not found, try with CSS selector as a fallback
        if (!element) {
          try {
            const potentialElement = document.querySelector(`#${currentStepData.elementId}, .${currentStepData.elementId}, [data-tour-id="${currentStepData.elementId}"]`);
            if (potentialElement instanceof HTMLElement) {
              element = potentialElement;
            }
          } catch (e) {
            // Silent fail for invalid selectors
          }
        }
        
        if (element) {
          setTargetElement(element);
          
          // Determine optimal position based on viewport
          const preferredPosition = currentStepData.position || 'bottom';
          
          // Handle extended position types by converting to supported ones
          const basePosition = preferredPosition.includes('-') 
            ? preferredPosition.split('-')[0] as 'top' | 'right' | 'bottom' | 'left'
            : preferredPosition as 'top' | 'right' | 'bottom' | 'left';
            
          const bestPosition = getBestTooltipPosition(element, basePosition);
          setOptimizedPosition(bestPosition);
          
          // Clear interval since element was found
          if (checkInterval !== null) {
            clearInterval(checkInterval);
            checkInterval = null;
          }
        } else {
          // Track retries
          currentRetries++;
          setRetryCount(currentRetries);
          
          // Stop checking after max retries
          if (currentRetries >= MAX_RETRIES && checkInterval !== null) {
            clearInterval(checkInterval);
            checkInterval = null;
            console.warn(`Tour element with ID "${currentStepData.elementId}" not found after ${MAX_RETRIES} attempts`);
          }
        }
      };

      // Try finding immediately
      findElement();
      
      // Then keep checking until found (for lazy-loaded components)
      checkInterval = window.setInterval(findElement, 100);

      return () => {
        if (checkInterval !== null) {
          clearInterval(checkInterval);
        }
        setRetryCount(0);
        setTargetElement(null);
        setOptimizedPosition(null);
      };
    } else {
      setTargetElement(null);
      setOptimizedPosition(null);
      setRetryCount(0);
    }
  }, [isActive, currentStepData]);

  return { 
    targetElement,
    optimizedPosition: optimizedPosition || (currentStepData?.position?.includes('-') 
      ? currentStepData.position.split('-')[0] as 'top' | 'right' | 'bottom' | 'left'
      : (currentStepData?.position || 'bottom') as 'top' | 'right' | 'bottom' | 'left'),
    elementFound: targetElement !== null,
    isSearching: retryCount > 0 && retryCount < MAX_RETRIES && targetElement === null
  };
}
