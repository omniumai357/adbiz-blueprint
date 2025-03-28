
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ChevronRight, CheckCircle, Clock, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface OrderConfirmationCardProps {
  orderId: string;
  packageName: string;
  completedSteps: string[];
  isGeneratingInvoice: boolean;
  invoiceProgress: number;
  mounted: boolean;
  orderDate?: string;
  estimatedDelivery?: string;
  orderStatus?: "processing" | "completed" | "delivered" | "cancelled";
  showDeliveryInfo?: boolean;
  className?: string;
}

/**
 * Enhanced component that displays order confirmation details with 
 * animated step completion and additional order information
 */
const OrderConfirmationCard: React.FC<OrderConfirmationCardProps> = ({
  orderId,
  packageName,
  completedSteps,
  isGeneratingInvoice,
  invoiceProgress,
  mounted,
  orderDate,
  estimatedDelivery,
  orderStatus = "completed",
  showDeliveryInfo = false,
  className
}) => {
  // Format a date string
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };
  
  // Get status badge color based on order status
  const getStatusColor = () => {
    switch (orderStatus) {
      case "processing": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "delivered": return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-green-100 text-green-800 border-green-200";
    }
  };
  
  return (
    <Card 
      className={cn(
        "border-green-100 bg-green-50 transition-all duration-500 ease-in-out",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "rounded-full p-1 bg-green-100 transition-all duration-700",
              mounted ? "scale-100" : "scale-0"
            )}>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <CardTitle className="text-xl text-green-700">Order Confirmed</CardTitle>
          </div>
          
          <Badge variant="outline" className={cn("text-xs px-2 py-1", getStatusColor())}>
            {orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-green-700">
            Thank you for your purchase of the <strong>{packageName}</strong> package.
            Your order ID is <strong>{orderId}</strong>.
          </p>
          
          {/* Order date and delivery estimate */}
          {showDeliveryInfo && (
            <div className="flex flex-col sm:flex-row gap-3 mt-2 text-sm text-green-700">
              {orderDate && (
                <div className="flex items-center gap-1.5">
                  <CalendarIcon className="h-4 w-4 text-green-500" />
                  <span>Order Date: <strong>{formatDate(orderDate)}</strong></span>
                </div>
              )}
              
              {estimatedDelivery && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-green-500" />
                  <span>Estimated Delivery: <strong>{formatDate(estimatedDelivery)}</strong></span>
                </div>
              )}
            </div>
          )}
          
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
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderConfirmationCard;
