
import { ReactNode } from "react";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { PaymentOptionProps } from "@/types/checkout";

export const PaymentOption = ({ id, value, label, icon, isSelected }: PaymentOptionProps) => {
  return (
    <div className={`flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-colors ${isSelected ? 'border-primary bg-primary/5' : 'border-border'}`}>
      <RadioGroupItem value={value} id={id} />
      <Label htmlFor={id} className="flex items-center space-x-2 cursor-pointer">
        {icon}
        <span>{label}</span>
      </Label>
    </div>
  );
};
