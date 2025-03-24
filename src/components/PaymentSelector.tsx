
import { useState } from "react";
import { RadioGroup } from "@/components/ui/radio-group";
import { CreditCard, Wallet } from "lucide-react";
import { PaymentOption } from "@/components/payment/payment-option";

type PaymentMethod = "credit-card" | "paypal";

interface PaymentSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
}

const PaymentSelector = ({ selectedMethod, onMethodChange }: PaymentSelectorProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Payment Method</h2>
      
      <RadioGroup 
        value={selectedMethod} 
        onValueChange={(value) => onMethodChange(value as PaymentMethod)}
        className="grid grid-cols-2 gap-4"
      >
        <PaymentOption
          id="credit-card"
          value="credit-card"
          label="Credit Card"
          icon={<CreditCard className="h-5 w-5" />}
          isSelected={selectedMethod === "credit-card"}
        />
        
        <PaymentOption
          id="paypal"
          value="paypal"
          label="PayPal"
          icon={<Wallet className="h-5 w-5" />}
          isSelected={selectedMethod === "paypal"}
        />
      </RadioGroup>
    </div>
  );
};

export default PaymentSelector;
