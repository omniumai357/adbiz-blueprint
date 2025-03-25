
import React from "react";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils/format-utils";
import { PercentIcon, Tag, BadgeCheck } from "lucide-react";

interface DiscountDisplayProps {
  subtotal: number;
  bundleDiscount?: any;
  bundleDiscountAmount: number;
  tieredDiscount?: any;
  tieredDiscountAmount: number;
  loyaltyBonusAmount: number;
  isLoyaltyProgramEnabled: boolean;
  offerDiscountAmount: number;
  couponDiscountAmount: number;
  appliedCoupon?: any;
  milestoneRewardAmount: number;
  appliedMilestoneReward?: any;
  totalDiscountAmount: number;
}

/**
 * DiscountDisplay Component
 * 
 * Shows a summary of all applied discounts in the checkout process
 */
const DiscountDisplay = ({
  subtotal,
  bundleDiscount,
  bundleDiscountAmount,
  tieredDiscount,
  tieredDiscountAmount,
  loyaltyBonusAmount,
  isLoyaltyProgramEnabled,
  offerDiscountAmount,
  couponDiscountAmount,
  appliedCoupon,
  milestoneRewardAmount,
  appliedMilestoneReward,
  totalDiscountAmount
}: DiscountDisplayProps) => {
  // Don't render anything if no discounts are applied
  if (totalDiscountAmount <= 0) return null;

  return (
    <div className="rounded-lg border border-border p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Tag className="h-5 w-5 text-primary" />
        <h3 className="font-medium">Applied Discounts</h3>
      </div>
      
      <Separator />
      
      <div className="space-y-2 text-sm">
        {bundleDiscountAmount > 0 && (
          <div className="flex justify-between">
            <span className="flex items-center gap-1">
              <PercentIcon className="h-3.5 w-3.5" />
              <span>Bundle Discount</span>
            </span>
            <span>-{formatCurrency(bundleDiscountAmount)}</span>
          </div>
        )}
        
        {tieredDiscountAmount > 0 && (
          <div className="flex justify-between">
            <span className="flex items-center gap-1">
              <PercentIcon className="h-3.5 w-3.5" />
              <span>{tieredDiscount?.name || "Tiered Discount"}</span>
            </span>
            <span>-{formatCurrency(tieredDiscountAmount)}</span>
          </div>
        )}
        
        {isLoyaltyProgramEnabled && loyaltyBonusAmount > 0 && (
          <div className="flex justify-between">
            <span className="flex items-center gap-1">
              <BadgeCheck className="h-3.5 w-3.5" />
              <span>Loyalty Bonus</span>
            </span>
            <span>-{formatCurrency(loyaltyBonusAmount)}</span>
          </div>
        )}
        
        {offerDiscountAmount > 0 && (
          <div className="flex justify-between">
            <span className="flex items-center gap-1">
              <Tag className="h-3.5 w-3.5" />
              <span>Limited Time Offer</span>
            </span>
            <span>-{formatCurrency(offerDiscountAmount)}</span>
          </div>
        )}
        
        {couponDiscountAmount > 0 && appliedCoupon && (
          <div className="flex justify-between">
            <span className="flex items-center gap-1">
              <Tag className="h-3.5 w-3.5" />
              <span>Coupon: {appliedCoupon.code}</span>
            </span>
            <span>-{formatCurrency(couponDiscountAmount)}</span>
          </div>
        )}
        
        {milestoneRewardAmount > 0 && appliedMilestoneReward && (
          <div className="flex justify-between">
            <span className="flex items-center gap-1">
              <BadgeCheck className="h-3.5 w-3.5" />
              <span>Milestone Reward</span>
            </span>
            <span>-{formatCurrency(milestoneRewardAmount)}</span>
          </div>
        )}
      </div>
      
      <Separator />
      
      <div className="flex justify-between font-medium">
        <span>Total Savings</span>
        <span className="text-primary">-{formatCurrency(totalDiscountAmount)}</span>
      </div>
    </div>
  );
};

export default DiscountDisplay;
