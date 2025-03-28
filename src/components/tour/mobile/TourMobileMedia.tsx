
import React from 'react';
import { cn } from '@/lib/utils';
import { TourStep } from '@/contexts/tour/types';

interface TourMobileMediaProps {
  currentStepData: TourStep;
  className?: string;
}

export const TourMobileMedia: React.FC<TourMobileMediaProps> = ({
  currentStepData,
  className
}) => {
  const { media } = currentStepData;
  
  if (!media || !media.url) {
    return null;
  }
  
  const mediaClassNames = cn(
    "rounded-md overflow-hidden max-h-40 flex justify-center",
    className
  );
  
  if (media.type === 'image') {
    return (
      <div className={mediaClassNames}>
        <img 
          src={media.url} 
          alt={media.alt || currentStepData.title} 
          className="object-contain"
        />
      </div>
    );
  }
  
  if (media.type === 'video') {
    return (
      <div className={mediaClassNames}>
        <video 
          src={media.url}
          className="object-contain"
          controls
          muted
          autoPlay
          loop
        />
      </div>
    );
  }
  
  if (media.type === 'gif') {
    return (
      <div className={mediaClassNames}>
        <img 
          src={media.url} 
          alt={media.alt || currentStepData.title} 
          className="object-contain"
        />
      </div>
    );
  }
  
  return null;
};
