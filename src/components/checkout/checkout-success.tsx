
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useResponsive } from "@/hooks/useResponsive";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAnimatedMount } from "@/hooks/checkout/useAnimatedMount";
import { useInvoiceGeneration } from "@/hooks/checkout/useInvoiceGeneration";
import { useInvoiceDownload } from "@/hooks/checkout/useInvoiceDownload";
import ResponsiveInvoiceViewer from "@/components/invoice/responsive-invoice-viewer";
import ConfettiAnimation from "./success/confetti-animation";
import OrderConfirmationCard from "./success/order-confirmation-card";
import QuickActionButtons from "./success/quick-action-buttons";

interface CheckoutSuccessProps {
  orderId: string;
  packageName: string;
  invoiceNumber: string;
  isGeneratingInvoice?: boolean;
  userId: string | null;
  orderDate?: string;
  estimatedDelivery?: string;
  orderStatus?: "processing" | "completed" | "delivered" | "cancelled";
  className?: string;
}

/**
 * Enhanced checkout success component with additional features and improved animations
 * Shows order confirmation and provides access to the invoice
 */
const CheckoutSuccess: React.FC<CheckoutSuccessProps> = ({
  orderId,
  packageName,
  invoiceNumber,
  isGeneratingInvoice = false,
  userId,
  orderDate,
  estimatedDelivery,
  orderStatus = "completed",
  className
}) => {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  
  // Handle animation completion
  const handleAllStepsCompleted = useCallback(() => {
    if (!isGeneratingInvoice) {
      toast.success("All processing steps completed", {
        description: "Your order has been fully processed"
      });
    }
  }, [isGeneratingInvoice]);
  
  // Use custom hooks for animations and state management with callbacks
  const { mounted, confettiActive, completedSteps, resetAnimation } = useAnimatedMount({
    onAllStepsCompleted: handleAllStepsCompleted
  });
  
  const { invoiceProgress, completeProgress } = useInvoiceGeneration({ 
    isGeneratingInvoice,
    onComplete: () => {
      if (!isGeneratingInvoice) {
        toast.success("Invoice generated", {
          description: "Your invoice is ready to view and download"
        });
      }
    }
  });
  
  const { 
    invoiceHtml,
    isLoading, 
    isPrinting,
    printInvoice, 
    downloadInvoice,
    shareInvoice
  } = useInvoiceDownload(invoiceNumber, userId);
  
  // Handle invoice actions with feedback
  const handlePrintInvoice = useCallback(() => {
    printInvoice();
    toast.success("Preparing invoice for printing");
  }, [printInvoice]);
  
  const handleDownloadInvoice = useCallback(() => {
    downloadInvoice();
    toast.success("Invoice download started");
  }, [downloadInvoice]);
  
  const handleShareInvoice = useCallback(() => {
    shareInvoice();
    toast.success("Sharing options opened");
  }, [shareInvoice]);
  
  const handleContactSupport = useCallback(() => {
    navigate("/contact", { 
      state: { 
        subject: `Order Support: ${orderId}`,
        message: `I need help with my order ${orderId} for the ${packageName} package.`
      } 
    });
    toast.success("Contacting support", {
      description: "You'll be connected with our support team"
    });
  }, [navigate, orderId, packageName]);
  
  return (
    <div className={cn("space-y-6", className)}>
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
        orderDate={orderDate}
        estimatedDelivery={estimatedDelivery}
        orderStatus={orderStatus}
        showDeliveryInfo={true}
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
        onContactSupport={handleContactSupport}
        isLoading={isLoading}
        isPrinting={isPrinting}
        isGeneratingInvoice={isGeneratingInvoice}
        mounted={mounted}
        showContinueShopping={true}
        showContactSupport={true}
      />
    </div>
  );
};

export default CheckoutSuccess;
