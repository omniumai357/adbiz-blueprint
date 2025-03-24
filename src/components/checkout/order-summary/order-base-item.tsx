
import React from "react";
import { formatCurrency } from "@/lib/utils/format-utils";
import { LucideIcon } from "lucide-react";

interface OrderBaseItemProps {
  name: string;
  price: number;
  icon?: React.ReactElement;
  isNegative?: boolean;
  variant?: "default" | "primary" | "amber" | "red" | "violet";
}

const OrderBaseItem = ({ 
  name, 
  price, 
  icon, 
  isNegative = false, 
  variant = "default" 
}: OrderBaseItemProps) => {
  
  const getTextColor = () => {
    switch (variant) {
      case "primary": return "text-primary";
      case "amber": return "text-amber-600";
      case "red": return "text-red-500";
      case "violet": return "text-violet-600";
      default: return "";
    }
  };
  
  return (
    <div className={`flex justify-between text-sm ${getTextColor()}`}>
      <div className="flex items-center">
        {icon && <span className="mr-1">{icon}</span>}
        <span>{name}</span>
      </div>
      <span>{isNegative ? "-" : ""}{formatCurrency(price)}</span>
    </div>
  );
};

export default OrderBaseItem;
