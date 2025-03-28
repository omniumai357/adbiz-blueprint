
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ChevronRight, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderConfirmationCardProps {
  orderId: string;
  packageName: string;
  completedSteps: string[];
  isGeneratingInvoice: boolean;
  invoiceProgress: number;
  mounted: boolean;
}

/**
 * Displays order confirmation details with animated step completion
 */
const OrderConfirmationCard: React.FC<OrderConfirmationCardProps> = ({
  orderId,
  packageName,
  completedSteps,
  isGeneratingInvoice,
  invoiceProgress,
  mounted
}) => {
  return (
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
        
        {/* Order processing steps animation */}
        <div className="mt-4 border-t border-green-200 pt-3 space-y-2">
          {["Order processing", "Payment confirmation", "Invoice generation", "Order completion"].map((step, index) => (
            <div 
              key={step}
              className={cn(
                "flex items-center gap-2 text-sm transition-all duration-300",
                completedSteps.includes(step) ? "text-green-700" : "text-green-400 opacity-50",
                completedSteps.includes(step) ? "translate-x-0" : "translate-x-2"
              )}
            >
              <div className={cn(
                "rounded-full flex items-center justify-center transition-all duration-300",
                completedSteps.includes(step) ? "text-green-500" : "text-green-300"
              )}>
                {completedSteps.includes(step) ? 
                  <CheckCircle className="h-4 w-4" /> : 
                  <ChevronRight className="h-4 w-4" />
                }
              </div>
              <span>{step}</span>
            </div>
          ))}
        </div>
        
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
      </CardContent>
    </Card>
  );
};

export default OrderConfirmationCard;
