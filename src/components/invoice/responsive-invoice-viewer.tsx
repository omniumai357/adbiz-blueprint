
import React, { useState, useEffect, useRef } from "react";
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
  RotateCcwIcon,
  MaximizeIcon,
  MinimizeIcon
} from "lucide-react";
import { useResponsive } from "@/hooks/useResponsive";
import { toast } from "sonner";

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
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [gestureType, setGestureType] = useState<null | 'pinch' | 'pan'>(null);
  const [initialDistance, setInitialDistance] = useState(0);
  const [initialScale, setInitialScale] = useState(1);
  const viewerRef = useRef<HTMLDivElement>(null);

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
        toast("Maximum zoom reached");
      }
      return newScale;
    });
  };
  
  const handleZoomOut = () => {
    setScale(prev => {
      const newScale = Math.max(prev - 0.1, 0.5);
      if (newScale <= 0.5) {
        toast("Minimum zoom reached");
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

  // Toggle fullscreen mode
  const handleToggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
    
    if (!isFullscreen) {
      setShowControls(false);
      setTimeout(() => setShowControls(true), 1500);
    }
  };
  
  // Hide/show controls based on scrolling (mobile only)
  useEffect(() => {
    if (isMobile) {
      let lastScrollY = window.scrollY;
      let controlsTimeout: NodeJS.Timeout;
      
      const handleScroll = () => {
        const scrollY = window.scrollY;
        const scrollingDown = scrollY > lastScrollY;
        
        setShowControls(!scrollingDown);
        lastScrollY = scrollY;
        
        // Hide controls after 3 seconds of inactivity
        clearTimeout(controlsTimeout);
        controlsTimeout = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      };
      
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      // Show controls initially, then hide after timeout
      controlsTimeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
        clearTimeout(controlsTimeout);
      };
    }
  }, [isMobile]);

  // Mobile touch gesture handlers
  const handleTouchStart = (event: React.TouchEvent) => {
    if (!isMobile || !viewerRef.current) return;
    
    if (event.touches.length === 1) {
      // Single touch for panning
      setTouchStartX(event.touches[0].clientX);
      setTouchStartY(event.touches[0].clientY);
      setGestureType('pan');
      
      // Show controls on touch
      setShowControls(true);
    } else if (event.touches.length === 2) {
      // Two fingers for pinch zoom
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      setInitialDistance(distance);
      setInitialScale(scale);
      setGestureType('pinch');
      
      // Prevent default to avoid page zooming
      event.preventDefault();
    }
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    if (!gestureType || !viewerRef.current) return;
    
    // Show controls during interaction
    setShowControls(true);
    
    if (gestureType === 'pinch' && event.touches.length === 2) {
      // Handle pinch zoom
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      // Calculate new scale based on finger distance change
      const scaleFactor = distance / initialDistance;
      const newScale = Math.min(Math.max(initialScale * scaleFactor, 0.5), 2.0);
      
      setScale(newScale);
      event.preventDefault();
    }
    
    // No need to handle panning here as the container is scrollable
  };

  const handleTouchEnd = () => {
    setGestureType(null);
    
    // Hide controls after a delay
    setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  // Double tap to zoom
  const lastTapRef = useRef<number>(0);
  const handleTap = (event: React.TouchEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap detected
      if (scale === 1) {
        setScale(1.5);
        
        // Center zoom on tap location
        if (viewerRef.current) {
          const rect = viewerRef.current.getBoundingClientRect();
          const x = event.touches[0].clientX - rect.left;
          const y = event.touches[0].clientY - rect.top;
          
          // Could implement scrolling to tap position here
        }
      } else {
        // Reset to normal view
        setScale(1);
      }
      
      event.preventDefault();
    }
    
    lastTapRef.current = now;
  };
  
  // Determine rendering dimensions based on rotation
  const isLandscape = rotation === 90 || rotation === 270;
  
  return (
    <Card className={cn(
      "w-full overflow-hidden flex flex-col transition-all duration-300",
      mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      isFullscreen ? "fixed inset-0 z-50 rounded-none" : "",
      className
    )}>
      <CardHeader className={cn(
        "px-4 py-3 sm:px-6 sm:py-4 border-b flex-shrink-0 transition-all duration-300",
        showControls ? "opacity-100" : "opacity-0 h-0 p-0 overflow-hidden",
        isFullscreen ? "bg-background/80 backdrop-blur-sm" : ""
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
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 ml-1"
                  onClick={handleToggleFullscreen}
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullscreen ? 
                    <MinimizeIcon className="h-4 w-4" /> : 
                    <MaximizeIcon className="h-4 w-4" />
                  }
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent 
        className={cn(
          "flex-grow overflow-auto p-0 relative",
          isFullscreen ? "overflow-y-auto" : ""
        )}
      >
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
            ref={viewerRef}
            className={cn(
              "min-h-[50vh] p-1 sm:p-4 flex justify-center",
              isFullscreen ? "h-[calc(100vh-120px)]" : ""
            )}
            onClick={() => isMobile && setShowControls(prev => !prev)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
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
                onTouchStart={handleTap}
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
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full"
              onClick={handleToggleFullscreen}
            >
              {isFullscreen ? 
                <MinimizeIcon className="h-4 w-4" /> : 
                <MaximizeIcon className="h-4 w-4" />
              }
            </Button>
          </div>
        )}
        
        {/* Mobile pinch-to-zoom hint */}
        {isMobile && !isLoading && invoiceHtml && mounted && !showControls && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-background/40 backdrop-blur-sm text-xs px-3 py-1 rounded-full animate-pulse">
              Pinch to zoom
            </div>
          </div>
        )}
        
        {/* Fullscreen close button (mobile) */}
        {isMobile && isFullscreen && (
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-8 p-0 rounded-full absolute top-2 right-2 bg-background/80 backdrop-blur-sm transition-all duration-300",
              showControls ? "opacity-100" : "opacity-0"
            )}
            onClick={handleToggleFullscreen}
          >
            <MinimizeIcon className="h-4 w-4" />
          </Button>
        )}
      </CardContent>
      
      <CardFooter className={cn(
        "px-4 py-3 sm:px-6 sm:py-4 border-t flex-shrink-0 transition-all duration-300",
        showControls ? "opacity-100" : "opacity-0 h-0 p-0 overflow-hidden",
        isFullscreen ? "bg-background/80 backdrop-blur-sm" : ""
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
