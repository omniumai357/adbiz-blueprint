
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { TourTooltip } from "./TourTooltip";

export interface TourDesktopViewHandle {
  focusElement: (selector: string) => boolean;
  focusElementByIndex: (index: number) => boolean;
}

// Re-export TourTooltip as TourDesktopView for naming consistency with proper ref forwarding
export const TourDesktopView = forwardRef<TourDesktopViewHandle, React.ComponentProps<typeof TourTooltip>>((props, ref) => {
  const innerRef = useRef<HTMLDivElement>(null);
  
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
      if (innerRef.current) {
        try {
          const focusableElements = Array.from(
            innerRef.current.querySelectorAll(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
          ).filter(
            (el) => !el.hasAttribute('disabled') && 
                    !el.getAttribute('aria-hidden') && 
                    el.getBoundingClientRect().width > 0
          ) as HTMLElement[];
          
          if (focusableElements.length > index && index >= 0) {
            focusableElements[index].focus();
            return true;
          }
        } catch (e) {
          console.error(`Failed to focus element at index ${index}:`, e);
        }
      }
      return false;
    }
  }));
  
  return <TourTooltip {...props} ref={innerRef} />;
});

TourDesktopView.displayName = "TourDesktopView";
