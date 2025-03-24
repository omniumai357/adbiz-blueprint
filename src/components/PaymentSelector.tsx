
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet } from "lucide-react";

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
        <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-colors">
          <RadioGroupItem value="credit-card" id="credit-card" />
          <Label htmlFor="credit-card" className="flex items-center space-x-2 cursor-pointer">
            <CreditCard className="h-5 w-5" />
            <span>Credit Card</span>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-colors">
          <RadioGroupItem value="paypal" id="paypal" />
          <Label htmlFor="paypal" className="flex items-center space-x-2 cursor-pointer">
            <Wallet className="h-5 w-5" />
            <span>PayPal</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default PaymentSelector;
