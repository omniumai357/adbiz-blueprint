
import React from "react";
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
};

export const TourMedia: React.FC<TourMediaProps> = ({ media, title, className }) => {
  if (!media) return null;
  
  const mediaAnimation = media.animation || "fade-in";
  const animationClass = animationClasses[mediaAnimation as keyof typeof animationClasses] || "animate-fade-in";
  
  switch (media.type) {
    case "image":
      return (
        <div className="mt-2 mb-3 flex justify-center">
          <img 
            src={media.url} 
            alt={media.alt || title} 
            className={cn("rounded-md max-h-32 max-w-full object-contain", animationClass, className)}
          />
        </div>
      );
    case "video":
      return (
        <div className="mt-2 mb-3 flex justify-center">
          <video 
            src={media.url} 
            className={cn("rounded-md max-h-32 max-w-full object-contain", animationClass, className)}
            controls
            muted
            autoPlay
            loop
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
          />
        </div>
      );
    default:
      return null;
  }
};
