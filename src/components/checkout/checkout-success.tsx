
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ResponsiveInvoiceViewer from "@/components/invoice/responsive-invoice-viewer";
import { useInvoiceDownload } from "@/hooks/checkout/useInvoiceDownload";
import { useResponsive } from "@/hooks/useResponsive";

interface CheckoutSuccessProps {
  orderId: string;
  packageName: string;
  invoiceNumber: string;
  isGeneratingInvoice?: boolean;
  userId: string | null;
}

/**
 * A responsive checkout success component that shows order confirmation
 * and provides access to the invoice
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
  
  const { 
    invoiceHtml,
    isLoading, 
    isPrinting,
    printInvoice, 
    downloadInvoice,
    shareInvoice
  } = useInvoiceDownload(invoiceNumber, userId);
  
  return (
    <div className="space-y-6">
      <Card className="border-green-100 bg-green-50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
            <CardTitle className="text-xl text-green-700">Order Confirmed</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-green-700">
            Thank you for your purchase of the <strong>{packageName}</strong> package.
            Your order ID is <strong>{orderId}</strong>.
          </p>
          
          <div className="mt-4 text-sm text-green-600">
            <p>
              {isGeneratingInvoice
                ? "We're generating your invoice now. It will be delivered according to your preferences."
                : "Your invoice has been generated and delivered according to your preferences."}
            </p>
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
      
      <div className="pt-4">
        <h2 className="text-xl font-semibold mb-4">Your Invoice</h2>
        <ResponsiveInvoiceViewer
          invoiceId={invoiceNumber}
          invoiceNumber={invoiceNumber}
          invoiceHtml={invoiceHtml}
          isLoading={isLoading || isGeneratingInvoice}
          isPrinting={isPrinting}
          onPrint={printInvoice}
          onDownload={downloadInvoice}
          onShare={shareInvoice}
        />
      </div>
    </div>
  );
};

export default CheckoutSuccess;
