
import { useState, useEffect, useCallback } from 'react';
import { TourStep } from '@/contexts/tour/types';

interface ElementFinderResult {
  targetElement: HTMLElement | null;
  findElement: (selector: string) => HTMLElement | null;
  retryFindElement: (selector: string) => Promise<HTMLElement | null>;
  isElementVisible: (el: HTMLElement) => boolean;
}

/**
 * A hook that finds and tracks DOM elements for tour steps
 * 
 * @param isActive Whether the tour is active
 * @param stepData Current step data
 * @returns Object with target element and helper functions
 */
export function useTourElementFinder(
  isActive: boolean,
  stepData: TourStep | null
): ElementFinderResult {
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  // Function to find an element by selector
  const findElement = useCallback((selector: string): HTMLElement | null => {
    try {
      return document.querySelector(selector);
    } catch (error) {
      console.error('Error finding element:', error);
      return null;
    }
  }, []);

  // Function to retry finding an element with delay
  const retryFindElement = useCallback(
    async (selector: string, maxRetries = 5, delayMs = 200): Promise<HTMLElement | null> => {
      // Use target or elementId for the selector
      const el = findElement(selector);
      if (el) return el;

      if (maxRetries <= 0) {
        console.warn(`Element not found after retries: ${selector}`);
        return null;
      }

      return new Promise((resolve) => {
        setTimeout(async () => {
          const result = await retryFindElement(selector, maxRetries - 1, delayMs);
          resolve(result);
        }, delayMs);
      });
    },
    [findElement]
  );

  // Check if an element is visible
  const isElementVisible = useCallback((el: HTMLElement): boolean => {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    // Check if element is within viewport
    const isInViewport =
      rect.top <= windowHeight &&
      rect.left <= windowWidth &&
      rect.bottom >= 0 &&
      rect.right >= 0;

    // Check if element has size and isn't hidden
    const hasSize = rect.width > 0 && rect.height > 0;
    const computedStyle = window.getComputedStyle(el);
    const isVisible =
      computedStyle.display !== 'none' &&
      computedStyle.visibility !== 'hidden' &&
      computedStyle.opacity !== '0';

    return isInViewport && hasSize && isVisible;
  }, []);

  // Find and set the target element when step changes
  useEffect(() => {
    if (!isActive || !stepData) {
      setTargetElement(null);
      return;
    }

    // Use target or elementId - target is preferred
    const selector = stepData.target || stepData.elementId || '';
    if (!selector) {
      console.error('No target selector provided for step:', stepData.id);
      setTargetElement(null);
      return;
    }

    // Try to find the element with retry
    retryFindElement(selector).then((element) => {
      if (element) {
        setTargetElement(element);
      } else {
        console.error(`Could not find target element: ${selector}`);
        setTargetElement(null);
      }
    });

    // Clean up when component unmounts or step changes
    return () => {
      setTargetElement(null);
    };
  }, [isActive, stepData, retryFindElement]);

  return {
    targetElement,
    findElement,
    retryFindElement,
    isElementVisible,
  };
}
