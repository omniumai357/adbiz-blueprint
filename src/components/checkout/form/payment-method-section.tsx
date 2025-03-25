
import React from "react";
import PaymentSelector from "@/components/PaymentSelector";

interface PaymentMethodSectionProps {
  paymentMethod: "credit-card" | "paypal";
  onMethodChange: (method: "credit-card" | "paypal") => void;
}

/**
 * PaymentMethodSection Component
 * 
 * Renders the payment method selection section of the checkout form.
 * 
 * @param props PaymentMethodSectionProps containing current payment method and change handler
 */
const PaymentMethodSection = ({ 
  paymentMethod, 
  onMethodChange 
}: PaymentMethodSectionProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Payment Method</h2>
      <PaymentSelector
        selectedMethod={paymentMethod}
        onMethodChange={onMethodChange}
      />
    </div>
  );
};

export default PaymentMethodSection;
