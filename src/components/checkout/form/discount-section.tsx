
import React, { useState } from "react";
import BundleDiscount from "@/components/checkout/bundle-discount";
import TieredDiscount from "@/components/checkout/tiered-discount";
import LoyaltyProgram from "@/components/checkout/loyalty-program";
import LimitedTimeOffer, { LimitedTimeOfferInfo } from "@/components/checkout/limited-time-offer";
import PersonalizedCoupon from "@/components/checkout/personalized-coupon";
import { BundleDiscountInfo } from "../bundle-discount";
import MilestoneRewards from "@/components/checkout/milestone-rewards";
import { UserMilestone } from "@/hooks/rewards/useMilestones";

interface DiscountSectionProps {
  subtotal: number;
  userId: string | null;
  bundleDiscount?: BundleDiscountInfo;
  isDiscountApplicable?: boolean;
  tieredDiscount?: any;
  isFirstPurchase?: boolean;
  isLoyaltyProgramEnabled?: boolean;
  loyaltyBonusAmount?: number;
  onLoyaltyProgramToggle?: () => void;
  activeOffers?: LimitedTimeOfferInfo[];
  availableOffer?: LimitedTimeOfferInfo | null;
  personalizedCoupon?: any;
  appliedCoupon?: any;
  couponDiscountAmount?: number;
  isCheckingCoupon?: boolean;
  applyCoupon?: (code: string) => void;
  removeCoupon?: () => void;
  onMilestoneRewardApplied?: (reward: UserMilestone) => void;
  appliedMilestoneReward?: UserMilestone | null;
}

const DiscountSection = ({
  subtotal,
  userId,
  bundleDiscount,
  isDiscountApplicable = false,
  tieredDiscount = null,
  isFirstPurchase = false,
  isLoyaltyProgramEnabled = false,
  loyaltyBonusAmount = 0,
  onLoyaltyProgramToggle = () => {},
  activeOffers = [],
  availableOffer = null,
  personalizedCoupon = null,
  appliedCoupon = null,
  couponDiscountAmount = 0,
  isCheckingCoupon = false,
  applyCoupon = () => {},
  removeCoupon = () => {},
  onMilestoneRewardApplied = () => {},
  appliedMilestoneReward = null,
}: DiscountSectionProps) => {
  return (
    <div className="space-y-4">
      {/* Limited-time offer */}
      {activeOffers.length > 0 && activeOffers[0] && (
        <LimitedTimeOffer 
          offer={activeOffers[0]}
          subtotal={subtotal}
          available={!!availableOffer}
        />
      )}
      
      {/* Milestone rewards */}
      <MilestoneRewards 
        userId={userId}
        onRewardApplied={onMilestoneRewardApplied}
        appliedReward={appliedMilestoneReward}
      />
      
      {/* Personalized coupon */}
      <PersonalizedCoupon 
        coupon={personalizedCoupon}
        onApply={applyCoupon}
        isApplied={!!appliedCoupon}
        subtotal={subtotal}
        appliedDiscount={couponDiscountAmount}
        isLoading={isCheckingCoupon}
      />
      
      {/* Tiered discount section */}
      {tieredDiscount && (
        <TieredDiscount 
          tier={tieredDiscount}
          isFirstPurchase={isFirstPurchase}
          subtotal={subtotal}
          discountAmount={tieredDiscount.discountAmount}
        />
      )}
      
      {/* Bundle discount section */}
      {bundleDiscount && (
        <BundleDiscount 
          discount={bundleDiscount}
          subtotal={subtotal}
          applicable={isDiscountApplicable}
        />
      )}
      
      {/* Loyalty program section */}
      <LoyaltyProgram
        enabled={isLoyaltyProgramEnabled}
        onToggle={onLoyaltyProgramToggle}
        bonusAmount={loyaltyBonusAmount}
        userId={userId}
      />
    </div>
  );
};

export default DiscountSection;
