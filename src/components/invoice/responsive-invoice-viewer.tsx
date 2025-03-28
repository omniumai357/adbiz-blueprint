
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DownloadIcon, 
  PrinterIcon, 
  Share2Icon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  ZoomInIcon,
  ZoomOutIcon,
  RotateCcwIcon
} from "lucide-react";
import { useResponsive } from "@/hooks/useResponsive";
import { useToast } from "@/hooks/ui/use-toast";

interface InvoiceViewerProps {
  invoiceId: string;
  invoiceNumber: string;
  invoiceHtml?: string;
  isLoading?: boolean;
  isPrinting?: boolean;
  onPrint?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  onClose?: () => void;
  className?: string;
}

/**
 * Enhanced responsive invoice viewer component with improved UX
 * Adapts to different screen sizes and provides controls for viewing, 
 * printing, downloading, and sharing invoices
 */
const ResponsiveInvoiceViewer: React.FC<InvoiceViewerProps> = ({
  invoiceId,
  invoiceNumber,
  invoiceHtml,
  isLoading = false,
  isPrinting = false,
  onPrint,
  onDownload,
  onShare,
  onClose,
  className
}) => {
  const { isMobile, isTablet } = useResponsive();
  const { toast } = useToast();
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  // Animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(timer);
  }, []);
  
  // Handle zooming in and out
  const handleZoomIn = () => {
    setScale(prev => {
      const newScale = Math.min(prev + 0.1, 2.0);
      if (newScale >= 2.0) {
        toast({
          title: "Maximum zoom reached",
          description: "Cannot zoom in further",
          variant: "default",
        });
      }
      return newScale;
    });
  };
  
  const handleZoomOut = () => {
    setScale(prev => {
      const newScale = Math.max(prev - 0.1, 0.5);
      if (newScale <= 0.5) {
        toast({
          title: "Minimum zoom reached",
          description: "Cannot zoom out further",
          variant: "default",
        });
      }
      return newScale;
    });
  };
  
  // Handle rotation
  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };
  
  // Reset view
  const handleResetView = () => {
    setScale(1);
    setRotation(0);
  };
  
  // Hide/show controls based on scrolling (mobile only)
  useEffect(() => {
    if (isMobile) {
      let lastScrollY = window.scrollY;
      
      const handleScroll = () => {
        const scrollY = window.scrollY;
        const scrollingDown = scrollY > lastScrollY;
        
        setShowControls(!scrollingDown);
        lastScrollY = scrollY;
      };
      
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isMobile]);
  
  // Determine rendering dimensions based on rotation
  const isLandscape = rotation === 90 || rotation === 270;
  
  return (
    <Card className={cn(
      "w-full overflow-hidden flex flex-col transition-all duration-300",
      mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      className
    )}>
      <CardHeader className={cn(
        "px-4 py-3 sm:px-6 sm:py-4 border-b flex-shrink-0",
        showControls ? "opacity-100" : "opacity-0 h-0 p-0 overflow-hidden"
      )}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
            <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-mono">
              #{invoiceNumber}
            </span>
            <span className="hidden sm:inline">Invoice</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            {/* Zoom and rotation controls - only show on tablet and up */}
            {!isMobile && (
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={handleZoomOut}
                  aria-label="Zoom out"
                  disabled={scale <= 0.5}
                >
                  <ZoomOutIcon className="h-4 w-4" />
                </Button>
                <span className="text-xs text-muted-foreground w-12 text-center">
                  {Math.round(scale * 100)}%
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={handleZoomIn}
                  aria-label="Zoom in"
                  disabled={scale >= 2.0}
                >
                  <ZoomInIcon className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 ml-1"
                  onClick={handleRotate}
                  aria-label="Rotate"
                >
                  <RotateCcwIcon className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={handleResetView}
                  aria-label="Reset view"
                  disabled={scale === 1 && rotation === 0}
                >
                  <span className="text-xs">1:1</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-auto p-0 relative">
        {isLoading ? (
          <div className="p-4 sm:p-6 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
            <Skeleton className="h-48 w-full" />
          </div>
        ) : (
          <div 
            className="min-h-[50vh] p-1 sm:p-4 flex justify-center"
            onClick={() => isMobile && setShowControls(prev => !prev)}
          >
            {invoiceHtml ? (
              <div
                className={cn(
                  "invoice-content bg-white shadow-sm border rounded-md p-4 sm:p-6 mx-auto max-w-3xl transition-all duration-300",
                  isLandscape ? "origin-center" : "origin-top"
                )}
                style={{ 
                  transform: `scale(${scale}) rotate(${rotation}deg)`, 
                  maxWidth: isLandscape ? "80vh" : "unset",
                  marginTop: isLandscape ? "20vh" : "0"
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: invoiceHtml }} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Invoice preview not available</p>
              </div>
            )}
          </div>
        )}
        
        {/* Mobile controls overlay */}
        {isMobile && !isLoading && invoiceHtml && (
          <div className={cn(
            "absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-md flex items-center gap-3 transition-all duration-300",
            showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full"
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
            >
              <ZoomOutIcon className="h-4 w-4" />
            </Button>
            <span className="text-xs font-medium">{Math.round(scale * 100)}%</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full"
              onClick={handleZoomIn}
              disabled={scale >= 2.0}
            >
              <ZoomInIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full"
              onClick={handleRotate}
            >
              <RotateCcwIcon className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
      
      <CardFooter className={cn(
        "px-4 py-3 sm:px-6 sm:py-4 border-t flex-shrink-0 transition-all duration-300",
        showControls ? "opacity-100" : "opacity-0 h-0 p-0 overflow-hidden"
      )}>
        <div className={cn(
          "flex gap-3 w-full", 
          isMobile ? "flex-col" : "justify-between items-center"
        )}>
          {onClose && (
            <Button
              variant="outline"
              size={isMobile ? "sm" : "default"}
              onClick={onClose}
              className={isMobile ? "w-full" : ""}
            >
              Back
            </Button>
          )}
          
          <div className={cn("flex gap-2", isMobile ? "w-full" : "")}>
            {onPrint && (
              <Button
                variant="outline"
                size={isMobile ? "sm" : "default"}
                onClick={onPrint}
                disabled={isLoading || isPrinting}
                className={cn(
                  isMobile ? "flex-1" : "",
                  isPrinting ? "animate-pulse" : ""
                )}
              >
                <PrinterIcon className="h-4 w-4 mr-2" />
                {isPrinting ? "Printing..." : "Print"}
              </Button>
            )}
            
            {onDownload && (
              <Button
                variant="outline"
                size={isMobile ? "sm" : "default"}
                onClick={onDownload}
                disabled={isLoading}
                className={isMobile ? "flex-1" : ""}
              >
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download
              </Button>
            )}
            
            {onShare && !isMobile && (
              <Button
                variant="outline"
                size="default"
                onClick={onShare}
                disabled={isLoading}
              >
                <Share2Icon className="h-4 w-4 mr-2" />
                Share
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ResponsiveInvoiceViewer;
