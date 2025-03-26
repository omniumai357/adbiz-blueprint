
import { useMemo } from "react";

type TransitionType = "fade" | "slide" | "zoom" | "flip" | "none";
type TransitionDirection = "up" | "down" | "left" | "right";

export const useTooltipAnimation = (
  animation?: string,
  transition?: {
    type: TransitionType;
    direction?: TransitionDirection;
    duration?: number;
  }
) => {
  const animationClasses = useMemo(() => ({
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
  }), []);
  
  // Get main animation class
  const animationClass = animation 
    ? animationClasses[animation as keyof typeof animationClasses] || "animate-fade-in"
    : "animate-fade-in";
  
  // Get transition class based on transition type and direction
  const getTransitionClass = () => {
    if (!transition || transition.type === "none") return "";
    
    const { type, direction = "right" } = transition;
    
    const transitionMappings = {
      fade: "animate-fade-in",
      slide: `animate-slide-in-${direction}`,
      zoom: "animate-scale-in",
      flip: "animate-flip",
    };
    
    return transitionMappings[type] || "";
  };
  
  const transitionClass = getTransitionClass();
  
  // Get spotlight styles if provided
  const getSpotlightStyles = (spotlight?: {
    intensity?: "low" | "medium" | "high";
    color?: string;
    pulseEffect?: boolean;
    fadeBackground?: boolean;
  }) => {
    if (!spotlight) return {};
    
    const intensityMap = {
      low: "0 0 15px 2px",
      medium: "0 0 20px 5px",
      high: "0 0 30px 8px",
    };
    
    const shadowSize = intensityMap[spotlight.intensity || "medium"];
    const shadowColor = spotlight.color || "rgba(139, 92, 246, 0.7)";
    
    return {
      boxShadow: `${shadowSize} ${shadowColor}`,
      animation: spotlight.pulseEffect ? "pulse 2s infinite" : "none",
    };
  };
  
  return {
    animationClass,
    transitionClass,
    getSpotlightStyles
  };
};
