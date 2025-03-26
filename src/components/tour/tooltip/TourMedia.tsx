
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TourMediaProps {
  media: {
    type: "image" | "video" | "gif";
    url: string;
    alt?: string;
    animation?: string;
  };
  title: string;
  className?: string;
}

const animationClasses = {
  "fade-in": "animate-fade-in",
  "scale-in": "animate-scale-in",
  "slide-in": "animate-slide-in-right",
  "enter": "animate-enter",
  "float": "animate-float",
  "fade-up": "animate-fade-up",
  "zoom-in": "animate-[scale-in_0.3s_ease-out]",
  "bounce": "animate-[bounce_0.5s_ease-in-out]",
  "slide-up": "animate-[slide-up_0.3s_ease-out]",
  "slide-down": "animate-[slide-down_0.3s_ease-out]",
  "pulse": "animate-pulse",
  "spin": "animate-spin",
  "reveal": "animate-[clip-reveal_1s_ease-out]",
  "blur-in": "animate-[blur-in_0.5s_ease-out]",
  "flip": "animate-[flip_0.7s_ease-out]",
  "rotate-in": "animate-[rotate-in_0.5s_ease-out]",
  "swing": "animate-[swing_1s_ease-in-out]"
};

export const TourMedia: React.FC<TourMediaProps> = ({ media, title, className }) => {
  if (!media) return null;
  
  const mediaAnimation = media.animation || "fade-in";
  const animationClass = animationClasses[mediaAnimation as keyof typeof animationClasses] || "animate-fade-in";
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(media.type !== "video");
  const [playbackError, setPlaybackError] = useState(false);
  
  useEffect(() => {
    // Reset state when media changes
    setIsLoaded(media.type !== "video");
    setPlaybackError(false);
  }, [media.url, media.type]);
  
  const handleLoad = () => {
    setIsLoaded(true);
  };
  
  const handleError = () => {
    setPlaybackError(true);
    console.error(`Failed to load tour media: ${media.url}`);
  };
  
  // Skeleton loader while content is loading
  const renderSkeleton = () => (
    <div className="mt-2 mb-3 flex justify-center">
      <div 
        className={cn(
          "rounded-md max-h-32 max-w-full bg-gray-200 animate-pulse",
          media.type === "video" ? "aspect-video" : "aspect-square", 
          className
        )}
        style={{ minWidth: "120px", minHeight: "80px" }}
      />
    </div>
  );
  
  // Error state
  if (playbackError) {
    return (
      <div className="mt-2 mb-3 flex justify-center">
        <div className="rounded-md max-h-32 max-w-full flex items-center justify-center border border-gray-300 bg-gray-50 p-2 text-sm text-gray-500">
          Media unavailable
        </div>
      </div>
    );
  }
  
  // Show skeleton until loaded
  if (!isLoaded) {
    return renderSkeleton();
  }
  
  switch (media.type) {
    case "image":
      return (
        <div className="mt-2 mb-3 flex justify-center">
          <img 
            src={media.url} 
            alt={media.alt || title} 
            className={cn("rounded-md max-h-32 max-w-full object-contain", animationClass, className)}
            onLoad={handleLoad}
            onError={handleError}
          />
        </div>
      );
    case "video":
      return (
        <div className="mt-2 mb-3 flex justify-center">
          <video 
            ref={videoRef}
            src={media.url} 
            className={cn("rounded-md max-h-32 max-w-full object-contain", animationClass, className)}
            controls
            muted
            autoPlay
            loop
            onLoadedData={handleLoad}
            onError={handleError}
          />
        </div>
      );
    case "gif":
      return (
        <div className="mt-2 mb-3 flex justify-center">
          <img 
            src={media.url} 
            alt={media.alt || title} 
            className={cn("rounded-md max-h-32 max-w-full object-contain", animationClass, className)}
            onLoad={handleLoad}
            onError={handleError}
          />
        </div>
      );
    default:
      return null;
  }
};
