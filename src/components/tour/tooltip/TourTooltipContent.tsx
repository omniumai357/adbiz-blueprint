
import React from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/language-context";
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
  const { t } = useTranslation('tour');
  const { direction } = useLanguage();
  
  // Calculate progress percentage for the progress bar
  const progressValue = ((currentStep + 1) / totalSteps) * 100;
  
  // Create a more descriptive text for screen readers
  const getNavigationDescription = () => {
    let description = t('a11y.stepDescription', 'This is step {{current}} of {{total}}.', {
      current: currentStep + 1,
      total: totalSteps
    });
    
    // Add more details about the current step position
    if (currentStep === 0) {
      description += t('a11y.firstStep', 'This is the first step of the tour. ');
    } else if (currentStep === totalSteps - 1) {
      description += t('a11y.lastStep', 'This is the last step of the tour. ');
    } else {
      description += t('a11y.midStep', 'You are at step {{current}} of {{total}}. ', {
        current: currentStep + 1,
        total: totalSteps
      });
    }
    
    // Add navigation possibilities
    if (currentStep > 0) {
      description += t('a11y.canGoPrevious', 'You can navigate back to the previous step. ');
    }
    
    if (currentStep === totalSteps - 1) {
      description += t('a11y.canFinish', 'You can finish the tour by clicking Done. ');
    } else {
      description += t('a11y.canGoNext', 'You can navigate to the next step by clicking Next. ');
    }
    
    // Add keyboard shortcuts info
    description += t('a11y.keyboardHelp', 'Keyboard shortcuts: arrow keys to navigate, Enter or Space to activate buttons, and Escape to exit the tour. ');
    
    // Add skip navigation info
    description += t('a11y.skipHelp', 'You can press Tab+S at any time to skip the tour and go directly to the main content. ');
    
    // Add help shortcut info
    description += t('a11y.questionMarkHelp', 'Press question mark to display all available keyboard shortcuts.');
    
    return description;
  };
  
  // Get media description for screen readers
  const getMediaDescription = () => {
    if (!media) return '';
    
    const altText = media.alt || t('a11y.defaultMediaAlt', 'Visual aid for {{title}}', { title });
    const mediaType = media.type === 'video' ? 
      t('a11y.mediaVideo', 'Video showing') : 
      media.type === 'gif' ? 
        t('a11y.mediaGif', 'Animated GIF showing') : 
        t('a11y.mediaImage', 'Image showing');
    
    return `${mediaType}: ${altText}`;
  };
  
  return (
    <>
      {/* Content section with appropriate directionality */}
      <div 
        className="mb-4 mt-1" 
        dir={direction}
        lang={document.documentElement.lang}
      >
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
        aria-label={t('a11y.progressAriaLabel', 'Tour progress: {{current}} of {{total}} steps completed', {
          current: currentStep + 1,
          total: totalSteps
        })}
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
