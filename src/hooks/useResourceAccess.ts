
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export interface Resource {
  id: string;
  type: string;
  title: string;
}

export function useResourceAccess() {
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const { toast } = useToast();

  const handleResourceAccess = (resourceId: string, resourceType: string) => {
    try {
      let resourceTitle = "";
      
      // Map resource IDs to titles - this could be expanded or moved to a separate utility
      if (resourceId === "premium-strategy-guide") {
        resourceTitle = "Premium Marketing Strategy Guide";
      } else if (resourceId === "budget-marketing-guide") {
        resourceTitle = "Effective Marketing on a Budget";
      } else if (resourceId === "getting-started-guide") {
        resourceTitle = "Getting Started with Your Package";
      } else {
        resourceTitle = resourceId.split("-").map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(" ");
      }
      
      setSelectedResource({
        id: resourceId,
        type: resourceType,
        title: resourceTitle
      });
      
      setShowDownloadModal(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error accessing resource';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      console.error("Error accessing resource:", err);
    }
  };
  
  const closeDownloadModal = () => {
    setShowDownloadModal(false);
    setSelectedResource(null);
  };
  
  return {
    showDownloadModal,
    selectedResource,
    handleResourceAccess,
    closeDownloadModal
  };
}
