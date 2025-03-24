
import React from "react";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils/format-utils";
import { Sparkles } from "lucide-react";

interface OrderTotalProps {
  subtotal: number;
  totalDiscountAmount: number;
  total: number;
  showSpecialOffer: boolean;
}

const OrderTotal = ({ 
  subtotal, 
  totalDiscountAmount, 
  total,
  showSpecialOffer
}: OrderTotalProps) => {
  return (
    <>
      {totalDiscountAmount > 0 && (
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
      )}
      
      <Separator className="my-2" />
      <div className="flex justify-between font-bold">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>
      
      {totalDiscountAmount > 0 && (
        <div className="text-xs text-right text-primary font-medium">
          You save {formatCurrency(totalDiscountAmount)}
          {showSpecialOffer && (
            <span className="ml-1 text-yellow-500 inline-flex items-center">
              (includes special offers <Sparkles className="h-3 w-3 ml-0.5" />)
            </span>
          )}
        </div>
      )}
    </>
  );
};

export default OrderTotal;
