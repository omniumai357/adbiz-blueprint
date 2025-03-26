
import React from "react";
import { useTour } from "@/contexts/tour-context";
import { Button } from "@/components/ui/button";
import { HelpCircle, BookOpen } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useLocation } from "react-router-dom";

interface TourDiscoveryButtonProps {
  variant?: "icon" | "text" | "menu";
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "default" | "lg";
}

export const TourDiscoveryButton: React.FC<TourDiscoveryButtonProps> = ({ 
  variant = "icon",
  className = "",
  showLabel = false,
  size = "default"
}) => {
  const location = useLocation();
  const { startTour, availablePaths } = useTour();
  
  // Determine available tours based on current location
  const currentPathTours = availablePaths.filter(path => {
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
  
  // Fallback to all available paths if no specific tours for current page
  const displayTours = currentPathTours.length > 0 ? currentPathTours : availablePaths;
  
  // If there are no tours available, don't render anything
  if (displayTours.length === 0) {
    return null;
  }

  // Simple icon button with tooltip for a single tour
  if (variant === "icon" || displayTours.length === 1) {
    const tourPathId = displayTours[0]?.id;
    const tourName = displayTours[0]?.name || "Guided Tour";
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size={size === "default" ? "icon" : size}
              className={`${className} animate-pulse-subtle`}
              onClick={() => tourPathId && startTour(tourPathId)}
              aria-label={`Start ${tourName}`}
            >
              <HelpCircle className="h-4 w-4" aria-hidden="true" />
              {showLabel && <span className="ml-2">Tour Guide</span>}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Start guided tour</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  // Dropdown menu for multiple tour options
  if (variant === "menu") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size={size} 
            className={className}
            aria-label="Tour options"
          >
            <BookOpen className="h-4 w-4 mr-2" aria-hidden="true" />
            Tours
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {displayTours.map((tour) => (
            <DropdownMenuItem 
              key={tour.id}
              onClick={() => startTour(tour.id)}
            >
              {tour.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  
  // Text button (for footer/nav)
  return (
    <Button
      variant="ghost"
      size={size}
      className={className}
      onClick={() => displayTours[0] && startTour(displayTours[0].id)}
      aria-label={`Start ${displayTours[0]?.name || "Guided Tour"}`}
    >
      <HelpCircle className="h-4 w-4 mr-2" aria-hidden="true" />
      Guided Tour
    </Button>
  );
};
