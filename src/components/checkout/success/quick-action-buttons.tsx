
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Download, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface QuickActionButtonsProps {
  onPrint: () => void;
  onDownload: () => void;
  onShare: () => void;
  isLoading: boolean;
  isPrinting: boolean;
  isGeneratingInvoice: boolean;
  mounted: boolean;
}

/**
 * Provides quick action buttons for managing the invoice
 */
const QuickActionButtons: React.FC<QuickActionButtonsProps> = ({
  onPrint,
  onDownload,
  onShare,
  isLoading,
  isPrinting,
  isGeneratingInvoice,
  mounted
}) => {
  const navigate = useNavigate();
  
  return (
    <div className={cn(
      "flex flex-col space-y-2 mt-6 transition-all duration-500 ease-in-out",
      mounted ? "opacity-100 translate-y-0 delay-300" : "opacity-0 translate-y-4"
    )}>
      <h3 className="text-lg font-medium">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Button 
          variant="outline"
          className={cn(
            "flex items-center justify-center gap-2 h-auto py-3 transition-all duration-300",
            "hover:bg-slate-50 hover:shadow-sm"
          )}
          onClick={onPrint}
          disabled={isLoading || isPrinting || isGeneratingInvoice}
        >
          <Printer className="h-5 w-5" />
          <div className="flex flex-col items-start">
            <span className="font-medium">Print Invoice</span>
            <span className="text-xs text-muted-foreground">Create a paper copy</span>
          </div>
        </Button>
        
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
      </div>
    </div>
  );
};

export default QuickActionButtons;
