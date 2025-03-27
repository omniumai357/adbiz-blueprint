
import React from 'react';
import type { BundleDiscountInfo } from '../bundle-discount';
import type { LimitedTimeOfferInfo } from '../limited-time-offer';
import { UserMilestone } from '@/hooks/rewards/useMilestones';

interface CouponDiscount {
  id: string;
  name: string;
  discountAmount: number;
  code?: string;
  discount?: number;
  firstPurchaseBonus?: number;
}

interface DiscountsSectionProps {
  bundleDiscount?: BundleDiscountInfo | null;
  couponDiscount?: CouponDiscount | null;
  limitedTimeOffer?: LimitedTimeOfferInfo | null;
  milestoneReward?: UserMilestone | null;
  tieredDiscount?: {
    threshold: number;
    discountPercent: number;
    applied: boolean;
  } | null;
  showDiscounts?: boolean;
}

export const DiscountsSection: React.FC<DiscountsSectionProps> = ({
  bundleDiscount,
  couponDiscount,
  limitedTimeOffer,
  milestoneReward,
  tieredDiscount,
  showDiscounts = true,
}) => {
  const hasAnyDiscount = 
    bundleDiscount || 
    couponDiscount || 
    limitedTimeOffer || 
    milestoneReward || 
    tieredDiscount?.applied;

  // If no discounts are applied and showDiscounts is false, don't render the section
  if (!hasAnyDiscount && !showDiscounts) {
    return null;
  }

  // Helper function to render milestone milestone_name if available
  const getMilestoneName = (milestone: UserMilestone) => {
    return milestone.milestone_name || `Milestone Reward ${milestone.id}`;
  };

  return (
    <div className="space-y-3 py-2 border-t border-gray-200">
      <div className="text-sm font-medium text-gray-700">Applied Discounts</div>
      
      <ul className="space-y-2 text-sm">
        {/* Bundle discount */}
        {bundleDiscount && (
          <li className="flex justify-between">
            <span className="text-gray-600">
              Bundle Discount: {bundleDiscount.name}
            </span>
            <span className="font-medium">
              -{bundleDiscount.discountType === 'percentage' 
                ? `${bundleDiscount.discountAmount}%` 
                : `$${bundleDiscount.discountAmount.toFixed(2)}`}
            </span>
          </li>
        )}
        
        {/* Coupon discount */}
        {couponDiscount && (
          <li className="flex justify-between">
            <span className="text-gray-600">
              Coupon: {couponDiscount.name || couponDiscount.code || "Discount"}
            </span>
            <span className="font-medium">
              -${(couponDiscount.discountAmount || couponDiscount.discount || 0).toFixed(2)}
            </span>
          </li>
        )}
        
        {/* Limited time offer */}
        {limitedTimeOffer && (
          <li className="flex justify-between">
            <span className="text-gray-600">
              {limitedTimeOffer.name}
            </span>
            <span className="font-medium">
              -{limitedTimeOffer.discountType === 'percentage' 
                ? `${limitedTimeOffer.discountAmount}%` 
                : `$${limitedTimeOffer.discountAmount.toFixed(2)}`}
            </span>
          </li>
        )}
        
        {/* Milestone reward */}
        {milestoneReward && (
          <li className="flex justify-between">
            <span className="text-gray-600">
              Milestone: {getMilestoneName(milestoneReward)}
            </span>
            <span className="font-medium">
              -${milestoneReward.reward_value ? milestoneReward.reward_value.toFixed(2) : '0.00'}
            </span>
          </li>
        )}
        
        {/* Tiered discount */}
        {tieredDiscount?.applied && (
          <li className="flex justify-between">
            <span className="text-gray-600">
              Volume Discount (orders over ${tieredDiscount.threshold})
            </span>
            <span className="font-medium">
              -{tieredDiscount.discountPercent}%
            </span>
          </li>
        )}
      </ul>
    </div>
  );
};
