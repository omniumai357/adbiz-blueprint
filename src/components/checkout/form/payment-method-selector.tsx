
import React from "react";
import { PaymentMethod } from "@/types/checkout";
import PaymentSelector from "@/components/PaymentSelector";

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
}

/**
 * Payment Method Selector Component
 * 
 * This component provides a selector for different payment methods
 * 
 * @param props.selectedMethod The currently selected payment method
 * @param props.onMethodChange Handler for when payment method changes
 */
const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Payment Method</h3>
      <PaymentSelector 
        selectedMethod={selectedMethod}
        onMethodChange={onMethodChange}
      />
    </div>
  );
};

export default PaymentMethodSelector;
