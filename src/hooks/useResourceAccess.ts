
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

/**
 * Resource interface for handling downloadable content
 */
export interface Resource {
  /** Unique identifier for the resource */
  id: string;
  
  /** Type of resource (e.g., 'ebook', 'tutorial', 'package') */
  type: string;
  
  /** Human-readable title of the resource */
  title: string;
}

/**
 * Hook for managing access to protected resources
 * 
 * Provides functionality to:
 * - Handle resource access requests
 * - Generate appropriate resource titles
 * - Show a download modal for the selected resource
 * - Handle error cases
 * 
 * @returns Object with state and handlers for resource access
 * 
 * @example
 * const {
 *   showDownloadModal,
 *   selectedResource,
 *   handleResourceAccess,
 *   closeDownloadModal
 * } = useResourceAccess();
 * 
 * // Handle a resource access request
 * handleResourceAccess('premium-strategy-guide', 'ebook');
 * 
 * // In your component, render the download modal when showDownloadModal is true
 * {showDownloadModal && (
 *   <ResourceDownloadModal
 *     resource={selectedResource}
 *     onClose={closeDownloadModal}
 *   />
 * )}
 */
export function useResourceAccess() {
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const { toast } = useToast();

  /**
   * Handles a request to access a resource
   * 
   * Maps resource IDs to human-readable titles and shows the download modal
   * 
   * @param resourceId - The ID of the resource being accessed
   * @param resourceType - The type of resource (e.g., 'ebook', 'tutorial')
   */
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
        // Generate a title from the ID if no specific mapping exists
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
  
  /**
   * Closes the download modal and resets the selected resource
   */
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
