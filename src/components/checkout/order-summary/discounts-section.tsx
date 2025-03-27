
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Award, BadgePercent, DollarSign, Sparkles } from "lucide-react";
import { formatCurrency } from "@/lib/utils/format-utils";
import { Badge } from "@/components/ui/badge";
import { BundleDiscountInfo } from "../bundle-discount";
import { LimitedTimeOfferInfo } from "../limited-time-offer";
import { UserMilestone } from "@/hooks/rewards/useMilestones";

interface DiscountsSectionProps {
  showDiscounts: boolean;
  limitedTimeOffer?: LimitedTimeOfferInfo;
  offerDiscountAmount?: number;
  appliedCoupon?: {
    code: string;
    discount?: number;
    description?: string;
  };
  couponDiscountAmount?: number;
  appliedDiscount?: BundleDiscountInfo;
  bundleDiscountAmount?: number;
  tieredDiscount?: {
    id: string;
    name: string;
    discountAmount?: number;
    firstPurchaseBonus?: number;
  } | null;
  isFirstPurchase?: boolean;
  tieredDiscountAmount?: number;
  isLoyaltyProgramEnabled?: boolean;
  loyaltyBonusAmount?: number;
  appliedMilestoneReward?: UserMilestone | null;
  milestoneRewardAmount?: number;
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
  loyaltyBonusAmount = 0,
  appliedMilestoneReward,
  milestoneRewardAmount = 0
}: DiscountsSectionProps) => {
  if (!showDiscounts) return null;

  return (
    <div>
      <Separator className="my-4" />
      <h4 className="font-medium mb-3">Discounts & Savings</h4>
      <div className="space-y-2">
        {limitedTimeOffer && offerDiscountAmount > 0 && (
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <BadgePercent className="h-4 w-4 text-orange-500" />
              <span>{limitedTimeOffer.name}</span>
              <Badge variant="outline" className="text-xs bg-orange-50 border-orange-200 text-orange-700">
                Limited time
              </Badge>
            </div>
            <span className="text-rose-600">-{formatCurrency(offerDiscountAmount)}</span>
          </div>
        )}

        {appliedCoupon && couponDiscountAmount > 0 && (
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-cyan-500" />
              <span>Coupon: {appliedCoupon.code}</span>
            </div>
            <span className="text-rose-600">-{formatCurrency(couponDiscountAmount)}</span>
          </div>
        )}

        {appliedDiscount && bundleDiscountAmount > 0 && (
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <BadgePercent className="h-4 w-4 text-primary" />
              <span>{appliedDiscount.name}</span>
            </div>
            <span className="text-rose-600">-{formatCurrency(bundleDiscountAmount)}</span>
          </div>
        )}

        {tieredDiscount && tieredDiscountAmount > 0 && (
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-purple-500" />
              <span>{tieredDiscount.name}</span>
              {isFirstPurchase && tieredDiscount.firstPurchaseBonus && (
                <Badge variant="outline" className="text-xs bg-purple-50 border-purple-200 text-purple-700">
                  First purchase
                </Badge>
              )}
            </div>
            <span className="text-rose-600">-{formatCurrency(tieredDiscountAmount)}</span>
          </div>
        )}

        {isLoyaltyProgramEnabled && loyaltyBonusAmount > 0 && (
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" />
              <span>Loyalty Program Bonus</span>
            </div>
            <span className="text-rose-600">-{formatCurrency(loyaltyBonusAmount)}</span>
          </div>
        )}

        {appliedMilestoneReward && milestoneRewardAmount > 0 && (
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>{appliedMilestoneReward.milestone_name || appliedMilestoneReward.name} Reward</span>
              <Badge variant="default" className="text-xs">
                Milestone
              </Badge>
            </div>
            <span className="text-rose-600">-{formatCurrency(milestoneRewardAmount)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountsSection;
