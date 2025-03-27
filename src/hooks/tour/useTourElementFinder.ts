
import { useCallback, useState, useEffect } from 'react';
import { TourStep } from '@/contexts/tour/types';

/**
 * Hook to find DOM elements targeted by tour steps
 */
export function useTourElementFinder(isActive: boolean, currentStep: TourStep | null) {
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [findAttempts, setFindAttempts] = useState(0);
  const MAX_FIND_ATTEMPTS = 10;
  
  // Attempt to find the target element
  const findTargetElement = useCallback((step: TourStep): HTMLElement | null => {
    if (!step) return null;
    
    // Get target selector
    const targetSelector = step.target;
    
    // If no selector provided, return null
    if (!targetSelector) return null;
    
    // Try querySelector first
    let element = document.querySelector(targetSelector) as HTMLElement | null;
    
    // If not found, try getElementById
    if (!element && targetSelector.charAt(0) !== '#' && targetSelector.charAt(0) !== '.') {
      element = document.getElementById(targetSelector);
    }
    
    // If still not found and elementId is provided, try that
    if (!element && step.elementId) {
      element = document.getElementById(step.elementId);
    }
    
    return element;
  }, []);
  
  // Use effect to find target element when active or step changes
  useEffect(() => {
    if (!isActive || !currentStep) {
      setTargetElement(null);
      setFindAttempts(0);
      return;
    }
    
    // Find target element immediately
    const element = findTargetElement(currentStep);
    
    if (element) {
      setTargetElement(element);
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
      console.warn(`Element with selector '${currentStep.target}' or id '${currentStep.elementId}' not found after ${MAX_FIND_ATTEMPTS} attempts.`);
      setFindAttempts(0);
    }
  }, [isActive, currentStep, findAttempts, findTargetElement]);
  
  return {
    targetElement,
    findTargetElement
  };
}
