
import { useCallback, useState, useEffect } from 'react';

/**
 * Hook to find DOM elements targeted by tour steps
 */
export function useTourElementFinder(targetSelector: string) {
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [findAttempts, setFindAttempts] = useState(0);
  const MAX_FIND_ATTEMPTS = 10;
  
  // Attempt to find the target element
  const findTargetElement = useCallback((selector: string): HTMLElement | null => {
    if (!selector) return null;
    
    // Try querySelector first
    let element = document.querySelector(selector) as HTMLElement | null;
    
    // If not found, try getElementById
    if (!element && selector.charAt(0) !== '#' && selector.charAt(0) !== '.') {
      element = document.getElementById(selector);
    }
    
    return element;
  }, []);
  
  // Use effect to find target element and its dimensions
  useEffect(() => {
    if (!targetSelector) {
      setTargetElement(null);
      setTargetRect(null);
      setFindAttempts(0);
      return;
    }
    
    // Find target element immediately
    const element = findTargetElement(targetSelector);
    
    if (element) {
      setTargetElement(element);
      setTargetRect(element.getBoundingClientRect());
      setFindAttempts(0);
      return;
    }
    
    // If element not found, try again with a delay
    // This is useful for elements that are loaded async or appear after animations
    if (findAttempts < MAX_FIND_ATTEMPTS) {
      const timeoutId = setTimeout(() => {
        setFindAttempts(prev => prev + 1);
      }, 300);
      
      return () => clearTimeout(timeoutId);
    } else {
      console.warn(`Element with selector '${targetSelector}' not found after ${MAX_FIND_ATTEMPTS} attempts.`);
      setFindAttempts(0);
    }
  }, [targetSelector, findAttempts, findTargetElement]);
  
  // Update rect on window resize
  useEffect(() => {
    if (!targetElement) return;
    
    const updateRect = () => {
      setTargetRect(targetElement.getBoundingClientRect());
    };
    
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect);
    
    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
    };
  }, [targetElement]);

  return {
    targetElement,
    targetRect,
    findTargetElement
  };
}
