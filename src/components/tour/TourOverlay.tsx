
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TourOverlayProps {
  targetElement: HTMLElement | null;
  animation?: string;
  spotlight?: {
    intensity?: "low" | "medium" | "high";
    color?: string;
    pulseEffect?: boolean;
    fadeBackground?: boolean;
  };
  transition?: {
    duration?: number;
  };
}

export const TourOverlay: React.FC<TourOverlayProps> = ({ 
  targetElement,
  animation = "pulse",
  spotlight,
  transition
}) => {
  const [dimensions, setDimensions] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (targetElement) {
      // Delay showing the overlay to allow for animation
      const timer = setTimeout(() => setVisible(true), 50);
      
      const updateDimensions = () => {
        const rect = targetElement.getBoundingClientRect();
        setDimensions({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });
      };

      updateDimensions();
      
      // Add event listeners for responsive updates
      window.addEventListener('resize', updateDimensions);
      window.addEventListener('scroll', updateDimensions);
      
      // Scroll element into view with a small offset
      targetElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'center' 
      });

      return () => {
        window.removeEventListener('resize', updateDimensions);
        window.removeEventListener('scroll', updateDimensions);
        clearTimeout(timer);
      };
    }
  }, [targetElement]);

  if (!targetElement) return null;

  // Calculate spotlight styles based on configuration
  const getSpotlightStyles = () => {
    if (!spotlight) return {};
    
    const intensityMap = {
      low: { shadow: "0 0 15px 2px", blur: "60%" },
      medium: { shadow: "0 0 20px 5px", blur: "65%" },
      high: { shadow: "0 0 30px 10px", blur: "70%" },
    };
    
    const intensity = spotlight.intensity || "medium";
    const { shadow, blur } = intensityMap[intensity];
    const color = spotlight.color || "rgba(139, 92, 246, 0.7)";
    
    return {
      boxShadow: `${shadow} ${color}`,
      backdropFilter: spotlight.fadeBackground ? `brightness(${blur})` : "brightness(60%)",
    };
  };

  // Get the appropriate animation for the cutout area
  const getCutoutAnimation = () => {
    switch (animation) {
      case "pulse":
        return "animate-pulse border-primary";
      case "bounce":
        return "animate-bounce border-primary";
      case "glow":
        return "border-primary shadow-[0_0_10px_2px_rgba(139,92,246,0.7)]";
      case "ping":
        return "animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] border-primary";
      case "solid":
        return "border-primary";
      case "dashed":
        return "border-dashed border-primary animate-pulse";
      case "spotlight":
        return "border-primary shadow-[0_0_15px_5px_rgba(139,92,246,0.8)]";
      case "highlight-pulse":
        return "border-primary shadow-[0_0_12px_3px_rgba(139,92,246,0.6)] animate-pulse";
      case "focus-ring":
        return "border-primary shadow-[0_0_0_4px_rgba(139,92,246,0.3)]";
      default:
        return "animate-pulse border-primary";
    }
  };

  // Enhanced overlay with improved animations and transitions
  return (
    <div 
      className="fixed inset-0 z-50 pointer-events-none animate-fade-in"
      style={{ 
        backdropFilter: 'brightness(60%)', 
        zIndex: 9998,
        opacity: visible ? 1 : 0,
        transition: `opacity ${transition?.duration || 300}ms ease-in-out`,
        ...getSpotlightStyles()
      }}
    >
      {/* Enhanced cutout area with better animations */}
      <div
        className={cn(
          "absolute bg-transparent border-2 pointer-events-none transition-all",
          getCutoutAnimation()
        )}
        style={{
          top: dimensions.top,
          left: dimensions.left,
          width: dimensions.width,
          height: dimensions.height,
          borderRadius: '4px',
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65)',
          transition: `all ${transition?.duration || 300}ms ease-in-out`,
        }}
      />
    </div>
  );
};
