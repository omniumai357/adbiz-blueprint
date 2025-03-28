
import React from "react";

interface TourCompactViewProps {
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
  isRTL: boolean;
}

/**
 * TourCompactView Component
 * 
 * Renders a space-efficient view for smaller screens or when
 * space is at a premium. Focuses on essential content only.
 */
export const TourCompactView: React.FC<TourCompactViewProps> = ({
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
  isRTL
}) => {
  // Implementation stub - would need actual compact implementation
  return (
    <div 
      className="fixed bottom-4 inset-x-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 max-h-[30vh] overflow-auto"
      data-testid="tour-compact-view"
    >
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm">{content}</p>
      
      <div className="flex justify-between mt-2">
        <button 
          onClick={onPrev} 
          disabled={currentStep === 0}
          className="px-2 py-0.5 text-xs bg-gray-200 rounded"
        >
          {isRTL ? "Next" : "Previous"}
        </button>
        
        <span className="text-xs text-gray-500">{stepInfo}</span>
        
        <button 
          onClick={isLastStep ? onClose : onNext}
          className="px-2 py-0.5 text-xs bg-primary text-white rounded"
        >
          {isLastStep ? "Finish" : (isRTL ? "Previous" : "Next")}
        </button>
      </div>
    </div>
  );
};
