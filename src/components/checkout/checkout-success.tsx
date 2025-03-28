
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ResponsiveInvoiceViewer from "@/components/invoice/responsive-invoice-viewer";
import { useInvoiceDownload } from "@/hooks/checkout/useInvoiceDownload";
import { useResponsive } from "@/hooks/useResponsive";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAnimatedMount } from "@/hooks/checkout/useAnimatedMount";
import { useInvoiceGeneration } from "@/hooks/checkout/useInvoiceGeneration";
import ConfettiAnimation from "./success/confetti-animation";
import OrderConfirmationCard from "./success/order-confirmation-card";
import QuickActionButtons from "./success/quick-action-buttons";

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
  
  // Use custom hooks for animations and state management
  const { mounted, confettiActive, completedSteps } = useAnimatedMount();
  const { invoiceProgress } = useInvoiceGeneration({ isGeneratingInvoice });
  
  const { 
    invoiceHtml,
    isLoading, 
    isPrinting,
    printInvoice, 
    downloadInvoice,
    shareInvoice
  } = useInvoiceDownload(invoiceNumber, userId);
  
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
      {/* Confetti animation */}
      {confettiActive && <ConfettiAnimation />}

      {/* Order confirmation card */}
      <OrderConfirmationCard 
        orderId={orderId}
        packageName={packageName}
        completedSteps={completedSteps}
        isGeneratingInvoice={isGeneratingInvoice}
        invoiceProgress={invoiceProgress}
        mounted={mounted}
      />
      
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
      
      {/* Quick action buttons for invoice management */}
      <QuickActionButtons 
        onPrint={handlePrintInvoice}
        onDownload={handleDownloadInvoice}
        onShare={handleShareInvoice}
        isLoading={isLoading}
        isPrinting={isPrinting}
        isGeneratingInvoice={isGeneratingInvoice}
        mounted={mounted}
      />
    </div>
  );
};

export default CheckoutSuccess;
