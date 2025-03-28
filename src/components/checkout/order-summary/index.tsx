
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AddOnItem } from "../add-on-item";

interface OrderSummaryProps {
  packageName: string;
  packagePrice: number;
  selectedAddOns?: AddOnItem[];
  appliedDiscount?: any;
  bundleDiscountAmount?: number;
  tieredDiscount?: any;
  tieredDiscountAmount?: number;
  isFirstPurchase?: boolean;
  totalDiscountAmount: number;
  invoiceNumber?: string | null;
  isLoyaltyProgramEnabled?: boolean;
  loyaltyBonusAmount?: number;
  limitedTimeOffer?: any;
  offerDiscountAmount?: number;
  appliedCoupon?: any;
  couponDiscountAmount?: number;
  appliedMilestoneReward?: any;
  milestoneRewardAmount?: number;
}

/**
 * OrderSummary Component
 * 
 * Shows a responsive summary of the customer's order during checkout
 */
const OrderSummary: React.FC<OrderSummaryProps> = ({
  packageName,
  packagePrice,
  selectedAddOns = [],
  appliedDiscount,
  bundleDiscountAmount = 0,
  tieredDiscount,
  tieredDiscountAmount = 0,
  isFirstPurchase,
  totalDiscountAmount,
  invoiceNumber,
  isLoyaltyProgramEnabled,
  loyaltyBonusAmount = 0,
  limitedTimeOffer,
  offerDiscountAmount = 0,
  appliedCoupon,
  couponDiscountAmount = 0,
  appliedMilestoneReward,
  milestoneRewardAmount = 0
}) => {
  // Calculate the subtotal
  const addOnsTotal = selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);
  const subtotal = packagePrice + addOnsTotal;
  
  // Calculate the total after all discounts
  const total = Math.max(0, subtotal - totalDiscountAmount);

  // Format currency values
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card className="shadow-sm border-primary/10 h-fit">
      <CardHeader className="bg-primary-foreground border-b border-border">
        <CardTitle className="text-xl">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4 space-y-4">
          {/* Package Details */}
          <div className="flex justify-between">
            <div className="font-medium">{packageName}</div>
            <div>{formatCurrency(packagePrice)}</div>
          </div>
          
          {/* Add-Ons */}
          {selectedAddOns.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Add-Ons</div>
              {selectedAddOns.map((addon, index) => (
                <div key={index} className="flex justify-between text-sm pl-2">
                  <div>{addon.name}</div>
                  <div>{formatCurrency(addon.price)}</div>
                </div>
              ))}
            </div>
          )}
          
          {/* Subtotal */}
          <div className="flex justify-between border-t border-border pt-2">
            <div className="font-medium">Subtotal</div>
            <div>{formatCurrency(subtotal)}</div>
          </div>
          
          {/* Discounts */}
          {totalDiscountAmount > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Discounts</div>
              
              {bundleDiscountAmount > 0 && (
                <div className="flex justify-between text-sm pl-2 text-green-600">
                  <div>Bundle Discount</div>
                  <div>-{formatCurrency(bundleDiscountAmount)}</div>
                </div>
              )}
              
              {tieredDiscountAmount > 0 && (
                <div className="flex justify-between text-sm pl-2 text-green-600">
                  <div>{isFirstPurchase ? "First Purchase Bonus" : "Tier Discount"}</div>
                  <div>-{formatCurrency(tieredDiscountAmount)}</div>
                </div>
              )}
              
              {loyaltyBonusAmount > 0 && (
                <div className="flex justify-between text-sm pl-2 text-green-600">
                  <div>Loyalty Program Bonus</div>
                  <div>-{formatCurrency(loyaltyBonusAmount)}</div>
                </div>
              )}
              
              {offerDiscountAmount > 0 && (
                <div className="flex justify-between text-sm pl-2 text-green-600">
                  <div>Limited Time Offer</div>
                  <div>-{formatCurrency(offerDiscountAmount)}</div>
                </div>
              )}
              
              {couponDiscountAmount > 0 && (
                <div className="flex justify-between text-sm pl-2 text-green-600">
                  <div>Coupon Code: {appliedCoupon?.code}</div>
                  <div>-{formatCurrency(couponDiscountAmount)}</div>
                </div>
              )}
              
              {milestoneRewardAmount > 0 && (
                <div className="flex justify-between text-sm pl-2 text-green-600">
                  <div>Reward: {appliedMilestoneReward?.name}</div>
                  <div>-{formatCurrency(milestoneRewardAmount)}</div>
                </div>
              )}
              
              <div className="flex justify-between border-t border-border pt-2 text-green-600">
                <div className="font-medium">Total Discount</div>
                <div>-{formatCurrency(totalDiscountAmount)}</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-primary-foreground border-t border-border flex justify-between p-4">
        <div className="font-bold text-lg">Total</div>
        <div className="font-bold text-lg">{formatCurrency(total)}</div>
      </CardFooter>
    </Card>
  );
};

export default OrderSummary;
