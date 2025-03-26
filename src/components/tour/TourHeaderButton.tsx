
import React from "react";
import { useTour } from "@/contexts/tour";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import { TourDiscoveryButton } from "./TourDiscoveryButton";

interface TourHeaderButtonProps {
  className?: string;
  ariaLabel?: string;
}

export const TourHeaderButton: React.FC<TourHeaderButtonProps> = ({ 
  className = "",
  ariaLabel = "Start guided tour"
}) => {
  const location = useLocation();
  const { availablePaths } = useTour();
  
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
  
  // Only show the button if there's a relevant tour
  if (!hasTourForCurrentPage) {
    return null;
  }

  return (
    <div className={`fixed bottom-6 right-6 z-40 shadow-lg rounded-full ${className}`}>
      <TourDiscoveryButton 
        variant="icon" 
        className="h-12 w-12 rounded-full bg-primary text-white hover:bg-primary/90 shadow-md" 
        showLabel={false}
      />
    </div>
  );
};
