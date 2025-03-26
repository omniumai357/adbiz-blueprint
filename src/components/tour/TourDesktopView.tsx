
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { TourTooltip } from "./TourTooltip";

export interface TourDesktopViewHandle {
  focusElement: (selector: string) => boolean;
  focusElementByIndex: (index: number) => boolean;
  getFirstFocusableElement: () => HTMLElement | null;
  getLastFocusableElement: () => HTMLElement | null;
  getFocusableElements: () => HTMLElement[];
}

// Re-export TourTooltip as TourDesktopView for naming consistency with proper ref forwarding
export const TourDesktopView = forwardRef<TourDesktopViewHandle, React.ComponentProps<typeof TourTooltip>>((props, ref) => {
  const innerRef = useRef<HTMLDivElement>(null);
  
  // Get all focusable elements within the tooltip
  const getFocusableElements = () => {
    if (!innerRef.current) return [];
    
    return Array.from(
      innerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(
      (el) => !el.hasAttribute('disabled') && 
              !el.getAttribute('aria-hidden') && 
              el.getBoundingClientRect().width > 0
    ) as HTMLElement[];
  };
  
  // Expose the focus methods to the parent component
  useImperativeHandle(ref, () => ({
    focusElement: (selector: string) => {
      if (innerRef.current) {
        try {
          const element = innerRef.current.querySelector(selector) as HTMLElement;
          if (element) {
            element.focus();
            return true;
          }
        } catch (e) {
          console.error(`Failed to focus element with selector ${selector}:`, e);
        }
      }
      return false;
    },
    focusElementByIndex: (index: number) => {
      const focusableElements = getFocusableElements();
      
      if (focusableElements.length > index && index >= 0) {
        try {
          focusableElements[index].focus();
          return true;
        } catch (e) {
          console.error(`Failed to focus element at index ${index}:`, e);
        }
      }
      return false;
    },
    getFirstFocusableElement: () => {
      const elements = getFocusableElements();
      return elements.length > 0 ? elements[0] : null;
    },
    getLastFocusableElement: () => {
      const elements = getFocusableElements();
      return elements.length > 0 ? elements[elements.length - 1] : null;
    },
    getFocusableElements
  }));
  
  return <TourTooltip {...props} ref={innerRef} />;
});

TourDesktopView.displayName = "TourDesktopView";
