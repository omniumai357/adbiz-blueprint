
import React from "react";
import { formatCurrency } from "@/lib/utils/format-utils";
import { Separator } from "@/components/ui/separator";
import { BadgePercent, Package, ShoppingBag, Sparkles, Award, Star, Alarm, Gift } from "lucide-react";
import { AddOnItem } from "./add-on-item";
import { BundleDiscountInfo } from "./bundle-discount";
import { LimitedTimeOfferInfo } from "./limited-time-offer";
import { ScrollArea } from "@/components/ui/scroll-area";

interface OrderSummaryProps {
  packageName: string;
  packagePrice: number;
  selectedAddOns?: AddOnItem[];
  appliedDiscount?: BundleDiscountInfo;
  tieredDiscount?: {
    id: string;
    name: string;
    discountAmount: number;
    firstPurchaseBonus?: number;
  } | null;
  isFirstPurchase?: boolean;
  bundleDiscountAmount?: number;
  tieredDiscountAmount?: number;
  loyaltyBonusAmount?: number;
  totalDiscountAmount?: number;
  invoiceNumber?: string;
  isLoyaltyProgramEnabled?: boolean;
  limitedTimeOffer?: LimitedTimeOfferInfo;
  offerDiscountAmount?: number;
  appliedCoupon?: {
    code: string;
    description?: string;
  };
  couponDiscountAmount?: number;
}

const OrderSummary = ({ 
  packageName, 
  packagePrice, 
  selectedAddOns = [], 
  appliedDiscount,
  tieredDiscount,
  isFirstPurchase,
  bundleDiscountAmount = 0,
  tieredDiscountAmount = 0,
  loyaltyBonusAmount = 0,
  totalDiscountAmount = 0,
  invoiceNumber,
  isLoyaltyProgramEnabled = false,
  limitedTimeOffer,
  offerDiscountAmount = 0,
  appliedCoupon,
  couponDiscountAmount = 0
}: OrderSummaryProps) => {
  // Calculate the total for add-ons
  const addOnsTotal = selectedAddOns.reduce((total, addon) => total + addon.price, 0);
  
  // Calculate the subtotal
  const subtotal = packagePrice + addOnsTotal;
  
  // Calculate the total
  const total = subtotal - totalDiscountAmount;
  
  // Calculate savings percentage if there's a discount
  const savingsPercentage = totalDiscountAmount > 0 
    ? Math.round((totalDiscountAmount / subtotal) * 100) 
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
      
      <ScrollArea className="max-h-72">
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
          
          {/* Subtotal before discounts */}
          {totalDiscountAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
          )}
          
          {/* Discounts */}
          {totalDiscountAmount > 0 && (
            <>
              <Separator className="my-2" />
              <div className="text-sm font-medium mb-2">Discounts:</div>
              
              {/* Limited time offer */}
              {limitedTimeOffer && offerDiscountAmount > 0 && (
                <div className="flex justify-between text-sm text-red-500">
                  <div className="flex items-center">
                    <Alarm className="h-4 w-4 mr-1" />
                    <span>{limitedTimeOffer.name}</span>
                  </div>
                  <span>-{formatCurrency(offerDiscountAmount)}</span>
                </div>
              )}
              
              {/* Applied coupon */}
              {appliedCoupon && couponDiscountAmount > 0 && (
                <div className="flex justify-between text-sm text-violet-600">
                  <div className="flex items-center">
                    <Gift className="h-4 w-4 mr-1" />
                    <span>Coupon: {appliedCoupon.code}</span>
                  </div>
                  <span>-{formatCurrency(couponDiscountAmount)}</span>
                </div>
              )}
              
              {/* Bundle Discount */}
              {appliedDiscount && bundleDiscountAmount > 0 && (
                <div className="flex justify-between text-sm text-primary">
                  <div className="flex items-center">
                    <BadgePercent className="h-4 w-4 mr-1" />
                    <span>{appliedDiscount.name}</span>
                  </div>
                  <span>-{formatCurrency(bundleDiscountAmount)}</span>
                </div>
              )}
              
              {/* Tiered Discount */}
              {tieredDiscount && tieredDiscountAmount > 0 && (
                <div className="flex justify-between text-sm text-primary">
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-1" />
                    <span>{tieredDiscount.name}</span>
                    {isFirstPurchase && (
                      <Sparkles className="h-3 w-3 ml-1 text-yellow-500" />
                    )}
                  </div>
                  <span>-{formatCurrency(tieredDiscountAmount)}</span>
                </div>
              )}
              
              {/* Loyalty Program Bonus */}
              {isLoyaltyProgramEnabled && loyaltyBonusAmount > 0 && (
                <div className="flex justify-between text-sm text-amber-600">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    <span>Loyalty Program Bonus</span>
                  </div>
                  <span>-{formatCurrency(loyaltyBonusAmount)}</span>
                </div>
              )}
            </>
          )}
          
          {/* Total */}
          <Separator className="my-2" />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          
          {/* Savings */}
          {totalDiscountAmount > 0 && (
            <div className="text-xs text-right text-primary font-medium">
              You save {formatCurrency(totalDiscountAmount)}
              {(isFirstPurchase || isLoyaltyProgramEnabled || 
               (limitedTimeOffer && offerDiscountAmount > 0) || 
               (appliedCoupon && couponDiscountAmount > 0)) && (
                <span className="ml-1 text-yellow-500 inline-flex items-center">
                  (includes special offers <Sparkles className="h-3 w-3 ml-0.5" />)
                </span>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default OrderSummary;
