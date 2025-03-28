
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { TourStep } from '@/contexts/tour/types';
import { useResponsiveTour } from '@/contexts/tour/ResponsiveTourContext';
import { useTourResponsiveLayout } from '@/hooks/tour/useTourResponsiveLayout';

interface TourMobileMediaProps {
  currentStepData: TourStep;
  className?: string;
  maxHeight?: string;
}

/**
 * TourMobileMedia Component
 * 
 * Displays media content (images, videos, gifs) for mobile tour views
 * with responsive sizing and loading states.
 */
export const TourMobileMedia: React.FC<TourMobileMediaProps> = ({
  currentStepData,
  className,
  maxHeight = "max-h-40"
}) => {
  const { media } = currentStepData;
  const { isMobile, isLandscape } = useResponsiveTour();
  const { layoutDirection } = useTourResponsiveLayout();
  const [isLoading, setIsLoading] = useState(true);
  
  if (!media || !media.url) {
    return null;
  }
  
  // Determine optimal max height based on device orientation
  const getOptimalHeight = () => {
    if (!isMobile) return maxHeight;
    
    // Reduce height in landscape for small devices
    if (isLandscape) return "max-h-24";
    
    // Allow more height in portrait
    return maxHeight;
  };
  
  const handleLoad = () => {
    setIsLoading(false);
  };
  
  const mediaClassNames = cn(
    "rounded-md overflow-hidden flex justify-center",
    getOptimalHeight(),
    isLoading && "bg-muted animate-pulse min-h-[80px]",
    layoutDirection === "horizontal" ? "max-w-[40%]" : "w-full",
    className
  );
  
  // Fix: Correct type comparison for media types
  if (media.type === 'image' || media.type === 'gif') {
    return (
      <div className={mediaClassNames}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 border-4 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}
        <img 
          src={media.url} 
          alt={media.alt || currentStepData.title} 
          className={cn("object-contain", isLoading ? "opacity-0" : "opacity-100 transition-opacity")}
          onLoad={handleLoad}
          loading="eager"
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
          playsInline
          loop
          onLoadedData={handleLoad}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 border-4 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}
      </div>
    );
  }
  
  return null;
};
