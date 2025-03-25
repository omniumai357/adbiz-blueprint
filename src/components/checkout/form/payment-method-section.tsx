
import React from "react";
import PaymentSelector from "@/components/PaymentSelector";
import { useErrorHandler } from "@/hooks/error/useErrorHandler";
import { FormError } from "@/components/ui/form-error";

interface PaymentMethodSectionProps {
  paymentMethod: "credit-card" | "paypal";
  onMethodChange: (method: "credit-card" | "paypal") => void;
  error?: string;
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
  onMethodChange,
  error
}: PaymentMethodSectionProps) => {
  const { getFieldError } = useErrorHandler();
  const paymentMethodError = error || getFieldError('paymentMethod');

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Payment Method</h2>
      
      {/* Display error if present */}
      {paymentMethodError && (
        <FormError message={paymentMethodError} />
      )}
      
      <PaymentSelector
        selectedMethod={paymentMethod}
        onMethodChange={onMethodChange}
      />
    </div>
  );
};

export default PaymentMethodSection;
