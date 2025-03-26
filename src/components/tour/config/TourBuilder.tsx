
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { TourConfigPanel } from "./TourConfigPanel";
import { useTour } from "@/contexts/tour-context";
import { toast } from "sonner";

interface TourBuilderProps {
  isAdmin?: boolean;
}

export const TourBuilder: React.FC<TourBuilderProps> = ({ 
  isAdmin = false 
}) => {
  const [configOpen, setConfigOpen] = useState(false);
  const { 
    availablePaths, 
    startTour
  } = useTour();
  
  // Only show for admins or in development mode
  if (!isAdmin && process.env.NODE_ENV !== "development") {
    return null;
  }
  
  const handleSaveTours = (paths: typeof availablePaths) => {
    // In a real app, this would save to a backend service
    // For now, we'll just show a success message
    console.log("Saving tour paths:", paths);
    
    toast.success("Tour configuration saved successfully!");
    setConfigOpen(false);
    
    // In a real implementation, we would need to update the context
    // with the new paths. For now, we're just demonstrating the UI.
  };
  
  const handleTestTour = (pathId: string) => {
    startTour(pathId);
    setConfigOpen(false);
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="fixed bottom-4 right-4 z-50"
        onClick={() => setConfigOpen(true)}
      >
        <Settings className="h-4 w-4 mr-2" />
        Configure Tours
      </Button>
      
      <TourConfigPanel
        isOpen={configOpen}
        onClose={() => setConfigOpen(false)}
        availablePaths={availablePaths}
        onSave={handleSaveTours}
        onTest={handleTestTour}
      />
    </>
  );
};
