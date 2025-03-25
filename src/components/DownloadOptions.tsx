
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Download, FileImage, FileText, FileVideo, FileAudio, BookOpen, PlayCircle } from "lucide-react";
import { useDownloadOptions, FileFormat, UseDownloadOptionsProps } from "@/hooks/downloads/useDownloadOptions";

// Using the interface from the hook to ensure consistency
type DownloadOptionsProps = UseDownloadOptionsProps;

const DownloadOptions = ({ 
  purchaseId, 
  packageName, 
  resourceType = "package",
  resourceTitle,
  onClose
}: DownloadOptionsProps) => {
  const {
    selectedFormat,
    setSelectedFormat,
    isDownloading,
    handleDownload,
    formatOptions,
    buttonText
  } = useDownloadOptions({
    purchaseId,
    packageName,
    resourceType,
    resourceTitle,
    onClose
  });

  // Map icon names to actual components
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "FileText": return FileText;
      case "FileImage": return FileImage;
      case "FileVideo": return FileVideo;
      case "FileAudio": return FileAudio;
      case "BookOpen": return BookOpen;
      case "PlayCircle": return PlayCircle;
      default: return FileText;
    }
  };

  return (
    <Dialog defaultOpen onOpenChange={(open) => !open && onClose && onClose()}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {resourceType === "tutorial" ? <PlayCircle className="h-4 w-4" /> : <Download className="h-4 w-4" />}
          <span>
            {resourceType === "tutorial" ? "Access Tutorial" : 
             resourceType === "ebook" ? "Download E-book" : "Download Purchase"}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {resourceType === "tutorial" ? "Access Your Tutorial" :
             resourceType === "ebook" ? "Download Your E-book" : "Download Your Purchase"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-muted-foreground mb-4">
            Choose your preferred {resourceType === "tutorial" ? "format" : "file format"} for{" "}
            {resourceType === "tutorial" ? "accessing" : "downloading"}{" "}
            {resourceType === "ebook" ? (resourceTitle || "this e-book") : 
             resourceType === "tutorial" ? (resourceTitle || "this tutorial") : packageName}:
          </p>
          
          <RadioGroup 
            value={selectedFormat} 
            onValueChange={(value) => setSelectedFormat(value as FileFormat)}
            className="space-y-3"
          >
            {formatOptions.map((format) => {
              const Icon = getIconComponent(format.icon);
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
            {isDownloading ? "Processing..." : buttonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadOptions;
