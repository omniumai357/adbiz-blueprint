
import React, { createContext, useContext, useState, useEffect } from "react";
import { useResponsive } from "@/hooks/useResponsive";
import { useDevice } from "@/hooks/use-device";
import { Position } from "@/lib/tour/types";

interface ResponsiveTourContextType {
  // Device detection
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
  
  // Screen dimensions
  screenWidth: number;
  screenHeight: number;
  
  // Orientation state
  isOrientationChanging: boolean;
  handleOrientationChange: () => void;
  
  // View preferences
  preferredViewMode: "tooltip" | "drawer" | "compact" | "fullscreen";
  setPreferredViewMode: (mode: "tooltip" | "drawer" | "compact" | "fullscreen") => void;
  
  // Touch optimization
  minTouchTargetSize: number;
  
  // Position helpers
  getOptimalPosition: (targetRect: DOMRect | null) => Position;
}

const defaultContext: ResponsiveTourContextType = {
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  isLandscape: false,
  isPortrait: true,
  screenWidth: typeof window !== "undefined" ? window.innerWidth : 1024,
  screenHeight: typeof window !== "undefined" ? window.innerHeight : 768,
  isOrientationChanging: false,
  handleOrientationChange: () => {},
  preferredViewMode: "tooltip",
  setPreferredViewMode: () => {},
  minTouchTargetSize: 44, // Standard minimum touch target size
  getOptimalPosition: () => "bottom",
};

const ResponsiveTourContext = createContext<ResponsiveTourContextType>(defaultContext);

export const useResponsiveTour = () => useContext(ResponsiveTourContext);

export const ResponsiveTourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const device = useDevice();
  
  const [preferredViewMode, setPreferredViewMode] = useState<"tooltip" | "drawer" | "compact" | "fullscreen">("tooltip");
  const [isOrientationChanging, setIsOrientationChanging] = useState(false);
  const [screenDimensions, setScreenDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
    height: typeof window !== "undefined" ? window.innerHeight : 768,
  });
  
  // Update screen dimensions on resize
  useEffect(() => {
    const handleResize = () => {
      setScreenDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  // Helper function to handle orientation changes
  const handleOrientationChange = () => {
    setIsOrientationChanging(true);
    
    // Reset after animation frame to prevent flickering
    setTimeout(() => {
      setIsOrientationChanging(false);
    }, 300);
  };
  
  // Calculate optimal position based on target element position
  const getOptimalPosition = (targetRect: DOMRect | null): Position => {
    if (!targetRect) return "bottom";
    
    const { top, left, width, height } = targetRect;
    const { width: screenWidth, height: screenHeight } = screenDimensions;
    
    // Calculate center point of target
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Determine if there's more space above or below
    const spaceAbove = top;
    const spaceBelow = screenHeight - (top + height);
    const spaceLeft = left;
    const spaceRight = screenWidth - (left + width);
    
    // For mobile devices, prefer bottom or top
    if (isMobile || isTablet) {
      return spaceBelow > spaceAbove ? "bottom" : "top";
    }
    
    // For desktop, find the side with most space
    const spaces = [
      { position: "top" as Position, space: spaceAbove },
      { position: "bottom" as Position, space: spaceBelow },
      { position: "left" as Position, space: spaceLeft },
      { position: "right" as Position, space: spaceRight },
    ];
    
    // Sort by available space and return the position with most space
    spaces.sort((a, b) => b.space - a.space);
    return spaces[0].position;
  };
  
  const value = {
    isMobile,
    isTablet,
    isDesktop,
    isLandscape: device.isLandscape,
    isPortrait: device.isPortrait,
    screenWidth: screenDimensions.width,
    screenHeight: screenDimensions.height,
    isOrientationChanging,
    handleOrientationChange,
    preferredViewMode,
    setPreferredViewMode,
    minTouchTargetSize: 44,
    getOptimalPosition,
  };
  
  return (
    <ResponsiveTourContext.Provider value={value}>
      {children}
    </ResponsiveTourContext.Provider>
  );
};
