
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export type FileFormat = "pdf" | "png" | "video" | "audio" | "epub" | "mobi" | "mp4" | "webinar";

interface UseDownloadOptionsProps {
  purchaseId: string;
  packageName: string;
  resourceType?: "package" | "ebook" | "tutorial";
  resourceTitle?: string;
  onClose?: () => void;
}

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
