
import React from "react";
import { useTour } from "@/contexts/tour";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import { TourDiscoveryButton } from "./TourDiscoveryButton";
import { useDevice } from "@/hooks/use-device";
import { logger } from "@/utils/logger";

interface TourHeaderButtonProps {
  className?: string;
  ariaLabel?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}

export const TourHeaderButton: React.FC<TourHeaderButtonProps> = ({ 
  className = "",
  ariaLabel = "Start guided tour",
  position = "bottom-right"
}) => {
  const location = useLocation();
  const { availablePaths } = useTour();
  const { isMobile, isTablet } = useDevice();
  
  // Determine positioning CSS classes
  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-24 right-6", // Below header
    "top-left": "top-24 left-6"    // Below header
  };
  
  // Apply appropriate shadow and animation based on device
  const buttonStyle = isMobile
    ? "shadow-md animate-pulse-subtle"
    : "shadow-lg hover:shadow-xl transition-shadow duration-300 animate-pulse-subtle";
  
  // Check if there's a tour for the current page
  const hasTourForCurrentPage = availablePaths.some(path => {
    if (location.pathname.includes("checkout") && path.id.includes("checkout")) {
      return true;
    } else if (location.pathname === "/" && path.id.includes("home")) {
      return true;
    } else if (location.pathname.includes("services") && path.id.includes("services")) {
      return true;
    } else if (location.pathname.includes("contact") && path.id.includes("contact")) {
      return true;
    }
    return false;
  });
  
  // Log availability of tours
  logger.debug('Tour availability check', {
    context: 'TourHeaderButton',
    data: {
      currentPath: location.pathname,
      hasTourForCurrentPage,
      availableTourCount: availablePaths.length
    }
  });
  
  // Only show the button if there's a relevant tour
  if (!hasTourForCurrentPage) {
    return null;
  }

  return (
    <div className={`fixed ${positionClasses[position]} z-40 ${buttonStyle} rounded-full ${className}`}>
      <TourDiscoveryButton 
        variant="icon" 
        className={`h-${isMobile ? '10' : '12'} w-${isMobile ? '10' : '12'} rounded-full bg-primary text-white hover:bg-primary/90`} 
        showLabel={!isMobile && !isTablet}
        size={isMobile ? "sm" : "default"}
      />
    </div>
  );
};
