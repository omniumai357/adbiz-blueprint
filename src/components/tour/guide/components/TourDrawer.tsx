
import React from "react";

interface TourDrawerProps {
  title: string;
  content: string;
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
  isLandscape: boolean;
  isRTL: boolean;
}

/**
 * TourDrawer Component
 * 
 * Renders a drawer that slides up from the bottom of the screen.
 * Optimized for mobile devices and touch interactions.
 */
export const TourDrawer: React.FC<TourDrawerProps> = ({
  title,
  content,
  onNext,
  onPrev,
  onClose,
  currentStep,
  totalSteps,
  isLastStep,
  stepInfo,
  media,
  isLandscape,
  isRTL
}) => {
  // Implementation stub - would need actual drawer implementation
  return (
    <div 
      className="fixed inset-x-0 bottom-0 bg-white dark:bg-gray-800 rounded-t-lg shadow-lg p-4 max-h-[50vh] overflow-auto"
      data-testid="tour-drawer"
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
