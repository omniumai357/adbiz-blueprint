
import React from "react";
import { Card } from "@/components/ui/card";
import CardPaymentForm from "../card-payment-form";
import PayPalButton from "@/components/PayPalButton";
import { PackageDetails, CustomerInfo, PaymentMethod } from "@/types/checkout";

interface PaymentSectionProps {
  paymentMethod: PaymentMethod;
  packageDetails: PackageDetails;
  customerInfo: Partial<CustomerInfo>; // Allow partial customer info
  total: number;
  onOrderSuccess: (orderId: string) => void;
}

/**
 * PaymentSection Component
 * 
 * Renders the appropriate payment form based on the selected payment method
 * 
 * @param props PaymentSectionProps containing payment method and other required data
 */
const PaymentSection = ({
  paymentMethod,
  packageDetails,
  customerInfo,
  total,
  onOrderSuccess
}: PaymentSectionProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
      <Card className="p-5">
        {paymentMethod === "credit-card" ? (
          <CardPaymentForm
            amount={total}
            packageName={packageDetails.title}
            customerInfo={customerInfo}
            onSuccess={onOrderSuccess}
          />
        ) : (
          <PayPalButton
            amount={total}
            packageDetails={packageDetails}
            customerInfo={customerInfo as CustomerInfo}
            onSuccess={onOrderSuccess}
          />
        )}
      </Card>
    </div>
  );
};

export default PaymentSection;
