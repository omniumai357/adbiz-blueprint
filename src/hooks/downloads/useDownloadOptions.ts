
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export type FileFormat = "pdf" | "png" | "video" | "audio" | "epub" | "mobi" | "mp4" | "webinar";

/**
 * Props for the useDownloadOptions hook
 */
export interface UseDownloadOptionsProps {
  /**
   * ID of the purchase
   */
  purchaseId: string;
  
  /**
   * Name of the package
   */
  packageName: string;
  
  /**
   * Type of resource being downloaded
   */
  resourceType?: "package" | "ebook" | "tutorial";
  
  /**
   * Title of the resource
   */
  resourceTitle?: string;
  
  /**
   * Callback function to be called when the download dialog is closed
   */
  onClose?: () => void;
}

/**
 * Hook for managing download options for packages and resources
 * 
 * Handles:
 * - Format selection logic
 * - Download simulation
 * - Success/failure notifications
 * 
 * @param props - Configuration props for the download
 * @returns State and handlers for the download options UI
 */
export function useDownloadOptions({
  purchaseId,
  packageName,
  resourceType = "package",
  resourceTitle,
  onClose
}: UseDownloadOptionsProps) {
  const [selectedFormat, setSelectedFormat] = useState<FileFormat>(
    resourceType === "ebook" ? "pdf" : 
    resourceType === "tutorial" ? "mp4" : 
    "pdf"
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  /**
   * Gets the appropriate format options based on resource type
   */
  const getFormatOptions = () => {
    if (resourceType === "ebook") {
      return [
        { value: "pdf", label: "PDF Document", icon: "FileText" },
        { value: "epub", label: "EPUB (for most e-readers)", icon: "BookOpen" },
        { value: "mobi", label: "MOBI (for Kindle)", icon: "BookOpen" },
      ];
    }
    
    if (resourceType === "tutorial") {
      return [
        { value: "mp4", label: "MP4 Video (HD quality)", icon: "FileVideo" },
        { value: "webinar", label: "Webinar Recording", icon: "PlayCircle" },
      ];
    }
    
    return [
      { value: "pdf", label: "PDF Document", icon: "FileText" },
      { value: "png", label: "PNG Image", icon: "FileImage" },
      { value: "video", label: "Video File", icon: "FileVideo" },
      { value: "audio", label: "Audio File", icon: "FileAudio" },
    ];
  };

  /**
   * Handles the download process
   * - Simulates a download with a delay
   * - Shows success/failure notifications
   * - Calls onClose callback when complete
   */
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      // In a real implementation, this would call your backend to generate and return the appropriate file
      // For this demo, we'll simulate a download
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful download
      const resourceName = resourceType === "ebook" 
        ? (resourceTitle || "E-book") 
        : resourceType === "tutorial"
        ? (resourceTitle || "Tutorial")
        : `${packageName} package`;
        
      toast({
        title: resourceType === "tutorial" ? "Tutorial Access Granted" : "Download successful",
        description: resourceType === "tutorial" 
          ? `You can now access ${resourceName} in ${selectedFormat.toUpperCase()} format.`
          : `Your ${resourceName} has been downloaded in ${selectedFormat.toUpperCase()} format.`,
      });
      
      setIsDownloading(false);
      
      // Call the onClose function if it exists
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download failed",
        description: "There was an error downloading your resource. Please try again.",
        variant: "destructive",
      });
      setIsDownloading(false);
    }
  };

  return {
    selectedFormat,
    setSelectedFormat,
    isDownloading,
    handleDownload,
    formatOptions: getFormatOptions(),
    buttonText: resourceType === "tutorial" ? "Access Tutorial" : "Download"
  };
}
