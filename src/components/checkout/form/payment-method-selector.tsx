
import React from "react";
import { RadioGroup } from "@/components/ui/radio-group";
import { CreditCard, Wallet } from "lucide-react";
import { PaymentOption } from "@/components/payment/payment-option";
import { useResponsive } from "@/hooks/useResponsive";

interface PaymentMethodSelectorProps {
  selectedMethod: "credit-card" | "paypal";
  onMethodChange: (method: "credit-card" | "paypal") => void;
}

/**
 * PaymentMethodSelector Component
 * 
 * Provides a responsive radio group interface for selecting between different payment methods
 */
const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ 
  selectedMethod, 
  onMethodChange 
}) => {
  const { isMobile } = useResponsive();
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Payment Method</h2>
      
      <RadioGroup 
        value={selectedMethod} 
        onValueChange={(value) => onMethodChange(value as "credit-card" | "paypal")}
        className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}
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

export default PaymentMethodSelector;
