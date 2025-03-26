
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TourOverlayProps {
  targetElement: HTMLElement | null;
  animation?: string;
}

export const TourOverlay: React.FC<TourOverlayProps> = ({ 
  targetElement,
  animation = "pulse" 
}) => {
  const [dimensions, setDimensions] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (targetElement) {
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
      };
    }
  }, [targetElement]);

  if (!targetElement) return null;

  // Enhanced overlay with improved animations
  return (
    <div 
      className="fixed inset-0 z-50 pointer-events-none animate-fade-in"
      style={{ backdropFilter: 'brightness(60%)', zIndex: 9998 }}
    >
      {/* Enhanced cutout area with better animations */}
      <div
        className={cn(
          "absolute bg-transparent border-2 pointer-events-none transition-all duration-300",
          {
            "animate-pulse border-primary": animation === "pulse",
            "animate-bounce border-primary": animation === "bounce",
            "border-primary shadow-[0_0_10px_2px_rgba(139,92,246,0.7)]": animation === "glow",
            "animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] border-primary": animation === "ping",
            "border-primary": animation === "solid",
            "border-dashed border-primary animate-pulse": animation === "dashed",
          }
        )}
        style={{
          top: dimensions.top,
          left: dimensions.left,
          width: dimensions.width,
          height: dimensions.height,
          borderRadius: '4px',
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65)',
        }}
      />
    </div>
  );
};
