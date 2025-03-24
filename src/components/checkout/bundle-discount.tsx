
import React from "react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/format-utils";
import { Package, PercentIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export interface BundleDiscountInfo {
  id: string;
  name: string;
  description: string;
  discountAmount: number;
  discountType: "percentage" | "fixed";
  threshold: number;
  active: boolean;
}

interface BundleDiscountProps {
  discount: BundleDiscountInfo;
  subtotal: number;
  applicable: boolean;
}

const BundleDiscount = ({ discount, subtotal, applicable }: BundleDiscountProps) => {
  const discountValue = discount.discountType === "percentage"
    ? (subtotal * discount.discountAmount / 100)
    : discount.discountAmount;
  
  const formattedDiscount = discount.discountType === "percentage"
    ? `${discount.discountAmount}%`
    : formatCurrency(discount.discountAmount);

  return (
    <div className={cn(
      "border rounded-lg p-4 transition-all",
      applicable 
        ? "border-primary/30 bg-primary/5" 
        : "border-border bg-muted/10"
    )}>
      <div className="flex items-center space-x-3">
        {applicable ? (
          <PercentIcon className="h-5 w-5 text-primary" />
        ) : (
          <Package className="h-5 w-5 text-muted-foreground" />
        )}
        <div>
          <h4 className="font-medium">{discount.name}</h4>
          <p className="text-sm text-muted-foreground">{discount.description}</p>
        </div>
      </div>

      <Separator className="my-3" />
      
      {applicable ? (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Discount applied:</span>
            <span className="font-medium text-primary">- {formattedDiscount}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>You save:</span>
            <span className="text-primary">{formatCurrency(discountValue)}</span>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Potential discount:</span>
            <span className="font-medium">{formattedDiscount}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Add {formatCurrency(discount.threshold - subtotal)} more to qualify
          </div>
        </div>
      )}
    </div>
  );
};

export default BundleDiscount;
