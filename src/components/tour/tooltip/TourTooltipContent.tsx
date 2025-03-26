
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
  
  // Create a more descriptive text for screen readers
  const getNavigationDescription = () => {
    let description = `This is step ${currentStep + 1} of ${totalSteps}. `;
    
    // Add more details about the current step position
    if (currentStep === 0) {
      description += 'This is the first step of the tour. ';
    } else if (currentStep === totalSteps - 1) {
      description += 'This is the last step of the tour. ';
    } else {
      description += `You are at step ${currentStep + 1} of ${totalSteps}. `;
    }
    
    // Add navigation possibilities
    if (currentStep > 0) {
      description += 'You can navigate back to the previous step. ';
    }
    
    if (currentStep === totalSteps - 1) {
      description += 'You can finish the tour by clicking Done. ';
    } else {
      description += 'You can navigate to the next step by clicking Next. ';
    }
    
    // Add keyboard shortcuts info
    description += 'Keyboard shortcuts: arrow keys to navigate, Enter or Space to activate buttons, and Escape to exit the tour. ';
    
    // Add skip navigation info
    description += 'You can press Tab+S at any time to skip the tour and go directly to the main content. ';
    
    // Add help shortcut info
    description += 'Press question mark to display all available keyboard shortcuts.';
    
    return description;
  };
  
  // Get media description for screen readers
  const getMediaDescription = () => {
    if (!media) return '';
    
    const altText = media.alt || `Visual aid for ${title}`;
    const mediaType = media.type === 'video' ? 'Video showing' : 
                     media.type === 'gif' ? 'Animated GIF showing' : 'Image showing';
    
    return `${mediaType}: ${altText}`;
  };
  
  return (
    <>
      {/* Content section */}
      <div className="mb-4 mt-1">
        <h3 id={titleId} className="font-medium text-lg">{title}</h3>
        
        {/* Media content */}
        {media && (
          <>
            <TourMedia media={media} title={title} />
            {/* Hidden description of media for screen readers */}
            <span className="sr-only">{getMediaDescription()}</span>
          </>
        )}
        
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
          {getNavigationDescription()}
        </span>
      </div>
      
      {/* Progress bar */}
      <Progress 
        value={progressValue} 
        className="h-1 mb-2" 
        aria-label={`Tour progress: ${currentStep + 1} of ${totalSteps} steps completed`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progressValue}
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
