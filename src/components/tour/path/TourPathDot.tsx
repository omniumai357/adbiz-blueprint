
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TourPathDotProps {
  pathId: string;
  size?: number;
  color?: string;
  duration?: number;
  pulseEffect?: boolean;
  className?: string;
  ariaHidden?: boolean;
}

export const TourPathDot: React.FC<TourPathDotProps> = ({
  pathId,
  size = 8,
  color = "rgba(99, 102, 241, 0.8)",
  duration = 2000,
  pulseEffect = true,
  className,
  ariaHidden = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Delay the appearance slightly to sync with path animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!isVisible) return null;
  
  return (
    <circle
      r={size}
      fill={color}
      className={cn(
        pulseEffect ? "animate-pulse" : "",
        className
      )}
      aria-hidden={ariaHidden}
    >
      <animateMotion
        dur={`${duration}ms`}
        repeatCount="indefinite"
        path={`#${pathId}`}
      />
    </circle>
  );
};
