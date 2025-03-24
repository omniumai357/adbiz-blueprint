
import React from "react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AddOnItem } from "../add-on-item";
import { BundleDiscountInfo } from "../bundle-discount";
import { LimitedTimeOfferInfo } from "../limited-time-offer";
import { UserMilestone } from "@/hooks/rewards/useMilestones";

import OrderSummaryHeader from "./order-summary-header";
import PackageSection from "./package-section";
import DiscountsSection from "./discounts-section";
import OrderTotal from "./order-total";

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
  appliedMilestoneReward?: UserMilestone | null;
  milestoneRewardAmount?: number;
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
  couponDiscountAmount = 0,
  appliedMilestoneReward,
  milestoneRewardAmount = 0
}: OrderSummaryProps) => {
  const addOnsTotal = selectedAddOns.reduce((total, addon) => total + addon.price, 0);
  const subtotal = packagePrice + addOnsTotal;
  const total = subtotal - totalDiscountAmount;
  
  const savingsPercentage = totalDiscountAmount > 0 
    ? Math.round((totalDiscountAmount / subtotal) * 100) 
    : 0;

  const showSpecialOffer = isFirstPurchase || isLoyaltyProgramEnabled || 
    (limitedTimeOffer && offerDiscountAmount > 0) || 
    (appliedCoupon && couponDiscountAmount > 0) ||
    (appliedMilestoneReward && milestoneRewardAmount > 0);

  return (
    <div className="mb-8 p-6 bg-gray-50 rounded-md">
      <OrderSummaryHeader 
        invoiceNumber={invoiceNumber}
        savingsPercentage={savingsPercentage}
      />
      
      <ScrollArea className="max-h-72">
        <div className="space-y-3">
          <PackageSection 
            packageName={packageName}
            packagePrice={packagePrice}
            selectedAddOns={selectedAddOns}
          />
          
          <DiscountsSection 
            showDiscounts={totalDiscountAmount > 0}
            limitedTimeOffer={limitedTimeOffer}
            offerDiscountAmount={offerDiscountAmount}
            appliedCoupon={appliedCoupon}
            couponDiscountAmount={couponDiscountAmount}
            appliedDiscount={appliedDiscount}
            bundleDiscountAmount={bundleDiscountAmount}
            tieredDiscount={tieredDiscount}
            isFirstPurchase={isFirstPurchase}
            tieredDiscountAmount={tieredDiscountAmount}
            isLoyaltyProgramEnabled={isLoyaltyProgramEnabled}
            loyaltyBonusAmount={loyaltyBonusAmount}
            appliedMilestoneReward={appliedMilestoneReward}
            milestoneRewardAmount={milestoneRewardAmount}
          />
          
          <OrderTotal 
            subtotal={subtotal}
            totalDiscountAmount={totalDiscountAmount}
            total={total}
            showSpecialOffer={showSpecialOffer}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

export default OrderSummary;
