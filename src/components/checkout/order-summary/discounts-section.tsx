
import React from "react";
import { Separator } from "@/components/ui/separator";
import { BadgePercent, AlarmClock, Gift, Award, Star, Sparkles } from "lucide-react";
import OrderBaseItem from "./order-base-item";
import { BundleDiscountInfo } from "../bundle-discount";
import { LimitedTimeOfferInfo } from "../limited-time-offer";

interface DiscountsSectionProps {
  showDiscounts: boolean;
  limitedTimeOffer?: LimitedTimeOfferInfo;
  offerDiscountAmount?: number;
  appliedCoupon?: {
    code: string;
    description?: string;
  };
  couponDiscountAmount?: number;
  appliedDiscount?: BundleDiscountInfo;
  bundleDiscountAmount?: number;
  tieredDiscount?: {
    id: string;
    name: string;
    discountAmount: number;
    firstPurchaseBonus?: number;
  } | null;
  isFirstPurchase?: boolean;
  tieredDiscountAmount?: number;
  isLoyaltyProgramEnabled?: boolean;
  loyaltyBonusAmount?: number;
}

const DiscountsSection = ({
  showDiscounts,
  limitedTimeOffer,
  offerDiscountAmount = 0,
  appliedCoupon,
  couponDiscountAmount = 0,
  appliedDiscount,
  bundleDiscountAmount = 0,
  tieredDiscount,
  isFirstPurchase,
  tieredDiscountAmount = 0,
  isLoyaltyProgramEnabled,
  loyaltyBonusAmount = 0
}: DiscountsSectionProps) => {
  
  if (!showDiscounts) return null;
  
  return (
    <>
      <Separator className="my-2" />
      <div className="text-sm font-medium mb-2">Discounts:</div>
      
      {limitedTimeOffer && offerDiscountAmount > 0 && (
        <OrderBaseItem 
          name={limitedTimeOffer.name}
          price={offerDiscountAmount}
          isNegative={true}
          variant="red"
          icon={<AlarmClock className="h-4 w-4" />}
        />
      )}
      
      {appliedCoupon && couponDiscountAmount > 0 && (
        <OrderBaseItem 
          name={`Coupon: ${appliedCoupon.code}`}
          price={couponDiscountAmount}
          isNegative={true}
          variant="violet"
          icon={<Gift className="h-4 w-4" />}
        />
      )}
      
      {appliedDiscount && bundleDiscountAmount > 0 && (
        <OrderBaseItem 
          name={appliedDiscount.name}
          price={bundleDiscountAmount}
          isNegative={true}
          variant="primary"
          icon={<BadgePercent className="h-4 w-4" />}
        />
      )}
      
      {tieredDiscount && tieredDiscountAmount > 0 && (
        <OrderBaseItem 
          name={tieredDiscount.name + (isFirstPurchase ? " " : "")}
          price={tieredDiscountAmount}
          isNegative={true}
          variant="primary"
          icon={<Award className="h-4 w-4" />}
        />
      )}
      
      {isLoyaltyProgramEnabled && loyaltyBonusAmount > 0 && (
        <OrderBaseItem 
          name="Loyalty Program Bonus"
          price={loyaltyBonusAmount}
          isNegative={true}
          variant="amber"
          icon={<Star className="h-4 w-4" />}
        />
      )}
    </>
  );
};

export default DiscountsSection;
