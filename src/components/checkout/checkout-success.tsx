
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ArrowLeft, Download, Printer, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ResponsiveInvoiceViewer from "@/components/invoice/responsive-invoice-viewer";
import { useInvoiceDownload } from "@/hooks/checkout/useInvoiceDownload";
import { useResponsive } from "@/hooks/useResponsive";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CheckoutSuccessProps {
  orderId: string;
  packageName: string;
  invoiceNumber: string;
  isGeneratingInvoice?: boolean;
  userId: string | null;
}

/**
 * An enhanced checkout success component with animations and responsive design
 * Shows order confirmation and provides access to the invoice
 */
const CheckoutSuccess: React.FC<CheckoutSuccessProps> = ({
  orderId,
  packageName,
  invoiceNumber,
  isGeneratingInvoice = false,
  userId
}) => {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  const [mounted, setMounted] = useState(false);
  
  const { 
    invoiceHtml,
    isLoading, 
    isPrinting,
    printInvoice, 
    downloadInvoice,
    shareInvoice
  } = useInvoiceDownload(invoiceNumber, userId);
  
  // Animation trigger for success message
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  // Simulate progressive loading of invoice for better UX
  const [invoiceProgress, setInvoiceProgress] = useState(0);
  
  useEffect(() => {
    if (isGeneratingInvoice) {
      const timer = setInterval(() => {
        setInvoiceProgress(prev => {
          const nextProgress = prev + 5;
          if (nextProgress >= 95) {
            clearInterval(timer);
            return 95; // Wait for actual completion to go to 100%
          }
          return nextProgress;
        });
      }, 250);
      
      return () => clearInterval(timer);
    } else {
      setInvoiceProgress(100);
    }
  }, [isGeneratingInvoice]);
  
  // Handle invoice actions with feedback
  const handlePrintInvoice = () => {
    printInvoice();
    toast.success("Preparing invoice for printing");
  };
  
  const handleDownloadInvoice = () => {
    downloadInvoice();
    toast.success("Invoice download started");
  };
  
  const handleShareInvoice = () => {
    shareInvoice();
    toast.success("Sharing options opened");
  };
  
  return (
    <div className="space-y-6">
      <Card 
        className={cn(
          "border-green-100 bg-green-50 transition-all duration-500 ease-in-out",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              "rounded-full p-1 bg-green-100 transition-all duration-700",
              mounted ? "scale-100" : "scale-0"
            )}>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <CardTitle className="text-xl text-green-700">Order Confirmed</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-green-700">
            Thank you for your purchase of the <strong>{packageName}</strong> package.
            Your order ID is <strong>{orderId}</strong>.
          </p>
          
          <div className="mt-4 text-sm text-green-600">
            {isGeneratingInvoice ? (
              <div className="space-y-2">
                <p>We're generating your invoice now. It will be delivered according to your preferences.</p>
                <div className="w-full bg-green-100 rounded-full h-2.5">
                  <div 
                    className="bg-green-500 h-2.5 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${invoiceProgress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <p className={cn(
                "transition-all duration-500",
                mounted ? "opacity-100" : "opacity-0"
              )}>
                Your invoice has been generated and delivered according to your preferences.
              </p>
            )}
          </div>
          
          <div className="mt-6">
            <Button 
              variant="outline" 
              size={isMobile ? "sm" : "default"}
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Home
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className={cn(
        "pt-4 transition-all duration-500 ease-in-out",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}>
        <h2 className="text-xl font-semibold mb-4">Your Invoice</h2>
        <ResponsiveInvoiceViewer
          invoiceId={invoiceNumber}
          invoiceNumber={invoiceNumber}
          invoiceHtml={invoiceHtml}
          isLoading={isLoading || isGeneratingInvoice}
          isPrinting={isPrinting}
          onPrint={handlePrintInvoice}
          onDownload={handleDownloadInvoice}
          onShare={handleShareInvoice}
        />
      </div>
      
      <div className={cn(
        "flex flex-col space-y-2 mt-6 transition-all duration-500 ease-in-out",
        mounted ? "opacity-100 translate-y-0 delay-300" : "opacity-0 translate-y-4"
      )}>
        <h3 className="text-lg font-medium">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button 
            variant="outline"
            className="flex items-center justify-center gap-2 h-auto py-3"
            onClick={handlePrintInvoice}
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
            className="flex items-center justify-center gap-2 h-auto py-3"
            onClick={handleDownloadInvoice}
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
            className="flex items-center justify-center gap-2 h-auto py-3"
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
    </div>
  );
};

export default CheckoutSuccess;
