
import React from "react";
import { TourMedia } from "./TourMedia";
import { TourStepIndicators } from "./TourStepIndicators";
import { Progress } from "@/components/ui/progress";

interface TourTooltipContentProps {
  title: string;
  content: string;
  currentStep: number;
  totalSteps: number;
  media?: {
    type: "image" | "video" | "gif";
    url: string;
    alt?: string;
    animation?: string;
  };
  titleId: string;
  contentId: string;
  descriptionId: string;
}

export const TourTooltipContent: React.FC<TourTooltipContentProps> = ({
  title,
  content,
  currentStep,
  totalSteps,
  media,
  titleId,
  contentId,
  descriptionId,
}) => {
  // Calculate progress percentage for the progress bar
  const progressValue = ((currentStep + 1) / totalSteps) * 100;
  
  return (
    <>
      {/* Content section */}
      <div className="mb-4 mt-1">
        <h3 id={titleId} className="font-medium text-lg">{title}</h3>
        
        {/* Media content */}
        {media && <TourMedia media={media} title={title} />}
        
        <p 
          id={contentId} 
          className="text-sm text-muted-foreground mt-2 leading-relaxed"
        >
          {content}
        </p>
        
        {/* Description for screen readers */}
        <span 
          id={descriptionId} 
          className="sr-only"
        >
          This is step {currentStep + 1} of {totalSteps}. 
          {currentStep > 0 ? 'You can navigate back to the previous step.' : ''}
          {currentStep === totalSteps - 1 
            ? 'This is the last step of the tour. You can finish the tour by clicking Done.' 
            : 'You can navigate to the next step by clicking Next.'
          }
        </span>
      </div>
      
      {/* Progress bar */}
      <Progress 
        value={progressValue} 
        className="h-1 mb-2" 
        aria-label={`Tour progress: ${currentStep + 1} of ${totalSteps} steps completed`}
      />
      
      {/* Step indicators (dots) */}
      {totalSteps <= 8 && (
        <TourStepIndicators 
          currentStep={currentStep} 
          totalSteps={totalSteps} 
        />
      )}
    </>
  );
};
