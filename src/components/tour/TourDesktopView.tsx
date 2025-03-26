import React, { forwardRef, useImperativeHandle } from "react";
import { TourTooltip } from "./tooltip/TourTooltip";

export interface TourDesktopViewHandle {
  focusFirstInteractiveElement: () => void;
  focusCloseButton: () => void;
}

export interface TourDesktopViewProps {
  targetElement: HTMLElement;
  position?: "top" | "right" | "bottom" | "left";
  title: string;
  content: string;
  stepInfo: string;
  onPrev?: () => void;
  onNext: () => void;
  onClose: () => void;
  isLastStep: boolean;
  animation?: string;
  media?: {
    type: "image" | "video" | "gif";
    url: string;
    alt?: string;
    animation?: string;
  };
  nextLabel?: string;
  prevLabel?: string;
  skipLabel?: string;
  transition?: {
    type: "fade" | "slide" | "zoom" | "flip" | "none";
    direction?: "up" | "down" | "left" | "right";
    duration?: number;
  };
  spotlight?: {
    intensity?: "low" | "medium" | "high";
    color?: string;
    pulseEffect?: boolean;
    fadeBackground?: boolean;
  };
  currentStep: number;
  totalSteps: number;
  showKeyboardShortcuts?: () => void;
  tooltipRef?: React.RefObject<HTMLDivElement>;
  hasTouchCapability?: boolean;
}

export const TourDesktopView = forwardRef<TourDesktopViewHandle, TourDesktopViewProps>(
  (props, ref) => {
    const tooltipRef = React.useRef<HTMLDivElement>(null);
    
    // Expose methods to parent components
    useImperativeHandle(ref, () => ({
      focusFirstInteractiveElement: () => {
        if (tooltipRef.current) {
          const firstButton = tooltipRef.current.querySelector('button') as HTMLButtonElement;
          if (firstButton) {
            firstButton.focus();
          }
        }
      },
      focusCloseButton: () => {
        if (tooltipRef.current) {
          const closeButton = tooltipRef.current.querySelector('[data-tour-action="close"]') as HTMLButtonElement;
          if (closeButton) {
            closeButton.focus();
          }
        }
      }
    }));

    return (
      <TourTooltip
        ref={tooltipRef}
        {...props}
      />
    );
  }
);

TourDesktopView.displayName = "TourDesktopView";
