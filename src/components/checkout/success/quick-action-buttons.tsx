
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Download, Share2, Home, ShoppingCart, MailIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface QuickActionButtonsProps {
  onPrint?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  onContactSupport?: () => void;
  isLoading?: boolean;
  isPrinting?: boolean;
  isGeneratingInvoice?: boolean;
  mounted?: boolean;
  showContinueShopping?: boolean;
  showContactSupport?: boolean;
  className?: string;
}

/**
 * Enhanced component that provides quick action buttons for managing the invoice and order
 * with improved visual feedback and more action options
 */
const QuickActionButtons: React.FC<QuickActionButtonsProps> = ({
  onPrint,
  onDownload,
  onShare,
  onContactSupport,
  isLoading = false,
  isPrinting = false,
  isGeneratingInvoice = false,
  mounted = true,
  showContinueShopping = true,
  showContactSupport = false,
  className
}) => {
  const navigate = useNavigate();
  
  return (
    <div className={cn(
      "flex flex-col space-y-2 mt-6 transition-all duration-500 ease-in-out",
      mounted ? "opacity-100 translate-y-0 delay-300" : "opacity-0 translate-y-4",
      className
    )}>
      <h3 className="text-lg font-medium">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {onPrint && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline"
                  className={cn(
                    "flex items-center justify-center gap-2 h-auto py-3 transition-all duration-300",
                    "hover:bg-slate-50 hover:shadow-sm",
                    isPrinting && "animate-pulse bg-slate-50"
                  )}
                  onClick={onPrint}
                  disabled={isLoading || isPrinting || isGeneratingInvoice}
                >
                  <Printer className="h-5 w-5" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{isPrinting ? "Printing..." : "Print Invoice"}</span>
                    <span className="text-xs text-muted-foreground">Create a paper copy</span>
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Print a physical copy of your invoice</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {onDownload && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline"
                  className={cn(
                    "flex items-center justify-center gap-2 h-auto py-3 transition-all duration-300",
                    "hover:bg-slate-50 hover:shadow-sm"
                  )}
                  onClick={onDownload}
                  disabled={isLoading || isGeneratingInvoice}
                >
                  <Download className="h-5 w-5" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Download PDF</span>
                    <span className="text-xs text-muted-foreground">Save for your records</span>
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save invoice as PDF document</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {onShare && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline"
                  className={cn(
                    "flex items-center justify-center gap-2 h-auto py-3 transition-all duration-300",
                    "hover:bg-slate-50 hover:shadow-sm"
                  )}
                  onClick={onShare}
                  disabled={isLoading || isGeneratingInvoice}
                >
                  <Share2 className="h-5 w-5" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Share Invoice</span>
                    <span className="text-xs text-muted-foreground">Send to others</span>
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share your invoice with others</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {showContinueShopping && (
          <Button 
            variant="outline"
            className={cn(
              "flex items-center justify-center gap-2 h-auto py-3 transition-all duration-300",
              "hover:bg-slate-50 hover:shadow-sm"
            )}
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-5 w-5" />
            <div className="flex flex-col items-start">
              <span className="font-medium">Continue Shopping</span>
              <span className="text-xs text-muted-foreground">Explore more packages</span>
            </div>
          </Button>
        )}
        
        {showContactSupport && onContactSupport && (
          <Button 
            variant="outline"
            className={cn(
              "flex items-center justify-center gap-2 h-auto py-3 transition-all duration-300",
              "hover:bg-slate-50 hover:shadow-sm"
            )}
            onClick={onContactSupport}
          >
            <MailIcon className="h-5 w-5" />
            <div className="flex flex-col items-start">
              <span className="font-medium">Contact Support</span>
              <span className="text-xs text-muted-foreground">Need help?</span>
            </div>
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuickActionButtons;
