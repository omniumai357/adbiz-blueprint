
import React from "react";
import { formatCurrency } from "@/lib/utils/format-utils";
import { Separator } from "@/components/ui/separator";
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

  return (
    <div className="mb-8 p-6 bg-gray-50 rounded-md">
      <h3 className="text-lg font-medium mb-4">Order Summary</h3>
      
      {invoiceNumber && (
        <div className="mb-4 pb-2 border-b border-gray-200">
          <span className="text-sm text-gray-500">Invoice #: {invoiceNumber}</span>
        </div>
      )}
      
      <ScrollArea className="max-h-64">
        <div className="space-y-3">
          {/* Main package */}
          <div className="flex justify-between">
            <span>{packageName}</span>
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
          
          {/* Discount */}
          {appliedDiscount && (
            <>
              <Separator className="my-2" />
              <div className="flex justify-between text-sm text-primary">
                <span>{appliedDiscount.name}</span>
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
        </div>
      </ScrollArea>
    </div>
  );
};

export default OrderSummary;
