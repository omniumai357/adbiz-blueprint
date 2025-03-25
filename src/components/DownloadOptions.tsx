
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Download, FileImage, FileText, FileVideo, FileAudio, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/ui/use-toast";

type FileFormat = "pdf" | "png" | "video" | "audio" | "epub" | "mobi";

interface DownloadOptionsProps {
  purchaseId: string;
  packageName: string;
  resourceType?: "package" | "ebook";
  resourceTitle?: string;
}

const DownloadOptions = ({ 
  purchaseId, 
  packageName, 
  resourceType = "package",
  resourceTitle
}: DownloadOptionsProps) => {
  const [selectedFormat, setSelectedFormat] = useState<FileFormat>(resourceType === "ebook" ? "pdf" : "pdf");
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const getFormatOptions = () => {
    if (resourceType === "ebook") {
      return [
        { value: "pdf", label: "PDF Document", icon: FileText },
        { value: "epub", label: "EPUB (for most e-readers)", icon: BookOpen },
        { value: "mobi", label: "MOBI (for Kindle)", icon: BookOpen },
      ];
    }
    
    return [
      { value: "pdf", label: "PDF Document", icon: FileText },
      { value: "png", label: "PNG Image", icon: FileImage },
      { value: "video", label: "Video File", icon: FileVideo },
      { value: "audio", label: "Audio File", icon: FileAudio },
    ];
  };

  const formatOptions = getFormatOptions();

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      // In a real implementation, this would call your backend to generate and return the appropriate file
      // For this demo, we'll simulate a download
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful download
      const resourceName = resourceType === "ebook" 
        ? (resourceTitle || "E-book") 
        : `${packageName} package`;
        
      toast({
        title: "Download successful",
        description: `Your ${resourceName} has been downloaded in ${selectedFormat.toUpperCase()} format.`,
      });
      
      setIsDownloading(false);
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          <span>Download {resourceType === "ebook" ? "E-book" : "Purchase"}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Download Your {resourceType === "ebook" ? "E-book" : "Purchase"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-muted-foreground mb-4">
            Choose your preferred file format for downloading{" "}
            {resourceType === "ebook" ? (resourceTitle || "this e-book") : packageName}:
          </p>
          
          <RadioGroup 
            value={selectedFormat} 
            onValueChange={(value) => setSelectedFormat(value as FileFormat)}
            className="space-y-3"
          >
            {formatOptions.map((format) => {
              const Icon = format.icon;
              return (
                <div key={format.value} className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value={format.value} id={format.value} />
                  <Label htmlFor={format.value} className="flex items-center gap-2 cursor-pointer flex-1">
                    <Icon className="h-5 w-5" />
                    <span>{format.label}</span>
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
          
          <Button 
            className="w-full mt-6" 
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? "Processing..." : "Download"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadOptions;
