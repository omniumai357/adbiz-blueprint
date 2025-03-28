
import React from "react";
import { Position } from "@/lib/tour/types";

interface TourTooltipProps {
  title: string;
  content: string;
  targetElement: HTMLElement | null;
  position: Position;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  currentStep: number;
  totalSteps: number;
  isLastStep: boolean;
  stepInfo: string;
  media?: {
    type: "image" | "video";
    url: string;
    alt?: string;
    animation?: string;
  };
  tooltipRef: React.RefObject<HTMLDivElement>;
  isRTL: boolean;
  transition?: {
    type: "fade" | "slide" | "zoom" | "flip" | "none";
    direction?: "up" | "down" | "left" | "right";
    duration?: number;
  };
}

/**
 * TourTooltip Component
 * 
 * Renders a tooltip near the target element with tour information.
 * This is the default desktop view for the tour.
 */
export const TourTooltip: React.FC<TourTooltipProps> = ({
  title,
  content,
  targetElement,
  position,
  onNext,
  onPrev,
  onClose,
  currentStep,
  totalSteps,
  isLastStep,
  stepInfo,
  media,
  tooltipRef,
  isRTL,
  transition
}) => {
  // Implementation stub - would need actual positioning logic and rendering
  return (
    <div 
      ref={tooltipRef}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-xs"
      data-testid="tour-tooltip"
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2">{content}</p>
      
      <div className="flex justify-between mt-4">
        <button 
          onClick={onPrev} 
          disabled={currentStep === 0}
          className="px-3 py-1 text-sm bg-gray-200 rounded"
        >
          {isRTL ? "Next" : "Previous"}
        </button>
        
        <span className="text-sm text-gray-500">{stepInfo}</span>
        
        <button 
          onClick={isLastStep ? onClose : onNext}
          className="px-3 py-1 text-sm bg-primary text-white rounded"
        >
          {isLastStep ? "Finish" : (isRTL ? "Previous" : "Next")}
        </button>
      </div>
    </div>
  );
};
