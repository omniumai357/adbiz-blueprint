
import React from "react";
import CardPaymentForm from "@/components/checkout/form/card-payment-form";
import PayPalButton from "@/components/PayPalButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerInfo, PackageDetails, PaymentMethod } from "@/types/checkout";

interface PaymentSectionProps {
  paymentMethod: PaymentMethod;
  packageDetails: PackageDetails;
  customerInfo: Partial<CustomerInfo>;
  total: number;
  onOrderSuccess: (orderId: string) => void;
}

/**
 * Payment Section Component
 * 
 * Renders the appropriate payment form based on the selected payment method
 */
const PaymentSection: React.FC<PaymentSectionProps> = ({
  paymentMethod,
  packageDetails,
  customerInfo,
  total,
  onOrderSuccess
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Payment Details</CardTitle>
      </CardHeader>
      <CardContent>
        {paymentMethod === "credit-card" ? (
          <CardPaymentForm
            amount={total}
            customerInfo={customerInfo}
            onSuccess={onOrderSuccess}
            packageName={packageDetails.title}
          />
        ) : (
          <PayPalButton
            amount={total}
            packageDetails={packageDetails as any}
            customerInfo={customerInfo as any}
            onSuccess={onOrderSuccess}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentSection;
