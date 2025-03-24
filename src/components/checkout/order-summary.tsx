
import React from "react";
import { formatCurrency } from "@/lib/utils/format-utils";
import { Separator } from "@/components/ui/separator";
import { BadgePercent, Package, ShoppingBag } from "lucide-react";
import { AddOnItem } from "./add-on-item";
import { BundleDiscountInfo } from "./bundle-discount";
import { ScrollArea } from "@/components/ui/scroll-area";

interface OrderSummaryProps {
  packageName: string;
  packagePrice: number;
  selectedAddOns?: AddOnItem[];
  appliedDiscount?: BundleDiscountInfo;
  invoiceNumber?: string;
}

const OrderSummary = ({ 
  packageName, 
  packagePrice, 
  selectedAddOns = [], 
  appliedDiscount,
  invoiceNumber 
}: OrderSummaryProps) => {
  // Calculate the total for add-ons
  const addOnsTotal = selectedAddOns.reduce((total, addon) => total + addon.price, 0);
  
  // Calculate discount amount
  const discountAmount = appliedDiscount 
    ? (appliedDiscount.discountType === "percentage" 
      ? ((packagePrice + addOnsTotal) * appliedDiscount.discountAmount / 100) 
      : appliedDiscount.discountAmount)
    : 0;
  
  // Calculate the total
  const total = packagePrice + addOnsTotal - discountAmount;
  
  // Calculate savings percentage if there's a discount
  const savingsPercentage = discountAmount > 0 
    ? Math.round((discountAmount / (packagePrice + addOnsTotal)) * 100) 
    : 0;

  return (
    <div className="mb-8 p-6 bg-gray-50 rounded-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium flex items-center">
          <ShoppingBag className="h-5 w-5 mr-2" />
          Order Summary
        </h3>
        {savingsPercentage > 0 && (
          <div className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium flex items-center">
            <BadgePercent className="h-3 w-3 mr-1" />
            {savingsPercentage}% off
          </div>
        )}
      </div>
      
      {invoiceNumber && (
        <div className="mb-4 pb-2 border-b border-gray-200">
          <span className="text-sm text-gray-500">Invoice #: {invoiceNumber}</span>
        </div>
      )}
      
      <ScrollArea className="max-h-64">
        <div className="space-y-3">
          {/* Main package */}
          <div className="flex justify-between">
            <div className="flex items-center">
              <Package className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{packageName}</span>
            </div>
            <span>{formatCurrency(packagePrice)}</span>
          </div>
          
          {/* Add-ons */}
          {selectedAddOns.length > 0 && (
            <>
              <Separator className="my-2" />
              <div className="text-sm font-medium mb-2">Add-ons:</div>
              {selectedAddOns.map((addon) => (
                <div key={addon.id} className="flex justify-between text-sm pl-2">
                  <span>{addon.name}</span>
                  <span>{formatCurrency(addon.price)}</span>
                </div>
              ))}
            </>
          )}
          
          {/* Subtotal before discount */}
          {appliedDiscount && (
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(packagePrice + addOnsTotal)}</span>
            </div>
          )}
          
          {/* Discount */}
          {appliedDiscount && (
            <>
              <Separator className="my-2" />
              <div className="flex justify-between text-sm text-primary">
                <div className="flex items-center">
                  <BadgePercent className="h-4 w-4 mr-1" />
                  <span>{appliedDiscount.name}</span>
                </div>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            </>
          )}
          
          {/* Total */}
          <Separator className="my-2" />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          
          {/* Savings */}
          {discountAmount > 0 && (
            <div className="text-xs text-right text-primary font-medium">
              You save {formatCurrency(discountAmount)}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default OrderSummary;
