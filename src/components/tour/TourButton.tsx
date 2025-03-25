
import React from "react";
import { useTour } from "@/contexts/tour-context";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TourButtonProps {
  pathId?: string;
  className?: string;
}

export const TourButton: React.FC<TourButtonProps> = ({ 
  pathId, 
  className 
}) => {
  const { startTour, availablePaths } = useTour();
  
  // If no pathId is provided, use the first available path
  const handleStartTour = () => {
    const tourPathId = pathId || (availablePaths.length > 0 ? availablePaths[0].id : null);
    if (tourPathId) {
      startTour(tourPathId);
    }
  };

  if (availablePaths.length === 0) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className={className}
            onClick={handleStartTour}
            aria-label="Start guided tour"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Start guided tour</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
