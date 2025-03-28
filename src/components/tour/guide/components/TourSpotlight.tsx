
import React, { useEffect, useState } from "react";
import { useResponsiveTour } from "@/contexts/tour/ResponsiveTourContext";

interface TourSpotlightProps {
  targetElement: HTMLElement;
  intensity?: "light" | "medium" | "strong" | "high" | "low";  // Updated to accept both naming conventions
  color?: string;
  pulseEffect?: boolean;
  fadeBackground?: boolean;
}

/**
 * TourSpotlight Component
 * 
 * Creates a spotlight effect that highlights the target element
 * during a tour, with responsive behavior for different devices.
 */
export const TourSpotlight: React.FC<TourSpotlightProps> = ({
  targetElement,
  intensity = "medium",
  color = "rgba(255, 255, 255, 0.1)",
  pulseEffect = false,
  fadeBackground = true
}) => {
  const [rect, setRect] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const { isMobile, isTablet } = useResponsiveTour();
  
  // Calculate opacity based on intensity
  const getOpacityValue = () => {
    switch (intensity) {
      case "light": return 0.5;
      case "low": return 0.5;  // Map "low" to same value as "light"
      case "medium": return 0.7;
      case "strong": return 0.85;
      case "high": return 0.85;  // Map "high" to same value as "strong"
      default: return 0.7;
    }
  };
  
  // Get the spotlight color with appropriate opacity
  const spotlightColor = color || `rgba(0, 0, 0, ${getOpacityValue()})`;
  
  // Initialize spotlight position
  useEffect(() => {
    if (targetElement) {
      // Set animation state when target changes
      const updateSpotlightPosition = () => {
        const rect = targetElement.getBoundingClientRect();
        
        // For mobile, add some padding to make the spotlight more visible
        const padding = isMobile ? 8 : (isTablet ? 12 : 5);
        
        setRect({
          top: rect.top - padding,
          left: rect.left + window.scrollX,
          width: rect.width + (padding * 2),
          height: rect.height + (padding * 2)
        });
      };
      
      // Update position immediately
      updateSpotlightPosition();
      
      // Add event listeners for responsive updates
      window.addEventListener('resize', updateSpotlightPosition);
      window.addEventListener('scroll', updateSpotlightPosition);
      
      // Clean up event listeners
      return () => {
        window.removeEventListener('resize', updateSpotlightPosition);
        window.removeEventListener('scroll', updateSpotlightPosition);
      };
    }
  }, [targetElement, isMobile, isTablet]);
  
  // Generate spotlight styles
  const spotlightStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 40,
    pointerEvents: 'none',
    // Use radial gradient for the spotlight effect
    background: `
      radial-gradient(
        circle at ${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px,
        transparent ${Math.max(rect.width, rect.height) / 2}px,
        ${spotlightColor} ${Math.max(rect.width, rect.height) / 2 + 20}px
      )
    `
  };
  
  // Add pulse animation if enabled
  const animationClass = pulseEffect ? 'animate-pulse' : '';
  
  return (
    <div 
      className={`tour-spotlight ${animationClass}`} 
      style={spotlightStyles}
      aria-hidden="true"
    />
  );
};
