
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DownloadIcon, PrinterIcon, Share2Icon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useResponsive } from "@/hooks/useResponsive";

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
 * A responsive invoice viewer component that adapts to different screen sizes
 * and provides controls for printing, downloading, and sharing invoices
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
  
  // Handle zooming in and out
  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));
  
  return (
    <Card className={cn("w-full overflow-hidden flex flex-col", className)}>
      <CardHeader className="px-4 py-3 sm:px-6 sm:py-4 border-b flex-shrink-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg sm:text-xl">
            Invoice #{invoiceNumber}
          </CardTitle>
          <div className="flex items-center gap-2">
            {/* Zoom controls - only show on tablet and up */}
            {!isMobile && (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleZoomOut}
                  aria-label="Zoom out"
                  disabled={scale <= 0.5}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <span className="text-xs text-muted-foreground">
                  {Math.round(scale * 100)}%
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleZoomIn}
                  aria-label="Zoom in"
                  disabled={scale >= 1.5}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-auto p-0">
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
            className="min-h-[50vh] p-1 sm:p-4"
            style={{ 
              transform: `scale(${scale})`, 
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease-in-out'
            }}
          >
            {invoiceHtml ? (
              <div
                dangerouslySetInnerHTML={{ __html: invoiceHtml }}
                className="invoice-content bg-white shadow-sm border rounded-md p-4 sm:p-6 mx-auto max-w-3xl"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Invoice preview not available</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="px-4 py-3 sm:px-6 sm:py-4 border-t flex-shrink-0">
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
                className={isMobile ? "flex-1" : ""}
              >
                <PrinterIcon className="h-4 w-4 mr-2" />
                Print
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
