
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CustomerInfo } from "@/types/checkout";
import { CheckCircle2 } from "lucide-react";

interface OrderReviewConfirmationProps {
  customerInfo: Partial<CustomerInfo>;
  amount: number;
  packageName: string;
  onConfirm: () => void;
  onEdit: () => void;
}

/**
 * Order Review Confirmation Component
 * 
 * Displays a summary of the order details for final review before payment processing
 */
const OrderReviewConfirmation: React.FC<OrderReviewConfirmationProps> = ({
  customerInfo,
  amount,
  packageName,
  onConfirm,
  onEdit
}) => {
  const fullName = customerInfo.firstName && customerInfo.lastName 
    ? `${customerInfo.firstName} ${customerInfo.lastName}` 
    : "Not provided";

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          Order Review
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium text-sm text-muted-foreground">Package</h3>
          <p className="font-medium">{packageName}</p>
        </div>
        
        <div>
          <h3 className="font-medium text-sm text-muted-foreground">Amount</h3>
          <p className="font-medium">${amount.toFixed(2)}</p>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="font-medium text-sm text-muted-foreground mb-2">Customer Information</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Name:</span>
              <p>{fullName}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Email:</span>
              <p>{customerInfo.email || "Not provided"}</p>
            </div>
            {customerInfo.phone && (
              <div>
                <span className="text-muted-foreground">Phone:</span>
                <p>{customerInfo.phone}</p>
              </div>
            )}
            {customerInfo.company && (
              <div>
                <span className="text-muted-foreground">Company:</span>
                <p>{customerInfo.company}</p>
              </div>
            )}
            <div>
              <span className="text-muted-foreground">Invoice Delivery:</span>
              <p>{customerInfo.invoiceDeliveryMethod === "email" 
                ? "Email" 
                : customerInfo.invoiceDeliveryMethod === "sms" 
                  ? "SMS" 
                  : "Email & SMS"}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onEdit}>
          Edit Information
        </Button>
        <Button onClick={onConfirm}>
          Confirm & Pay
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrderReviewConfirmation;
