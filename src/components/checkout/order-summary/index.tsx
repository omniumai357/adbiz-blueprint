
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import OrderSummaryHeader from "./order-summary-header";
import PackageSection from "./package-section";
import DiscountsSection from "./discounts-section";
import OrderTotal from "./order-total";
import { useDevice } from "@/hooks/use-device";
import { logger } from "@/utils/logger";
import { AddOnItem } from "../add-on-item";
import { BundleDiscountInfo } from "../bundle-discount";
import { LimitedTimeOfferInfo } from "../limited-time-offer";
import { UserMilestone } from "@/hooks/rewards/useMilestones";

interface OrderSummaryProps {
  packageName: string;
  packagePrice: number;
  selectedAddOns?: AddOnItem[];
  appliedDiscount?: BundleDiscountInfo | null;
  bundleDiscountAmount?: number;
  tieredDiscount?: {
    id: string;
    name: string;
    discountAmount: number;
    firstPurchaseBonus?: number;
  } | null;
  isFirstPurchase?: boolean;
  tieredDiscountAmount?: number;
  loyaltyBonusAmount?: number;
  isLoyaltyProgramEnabled?: boolean;
  limitedTimeOffer?: LimitedTimeOfferInfo | null;
  offerDiscountAmount?: number;
  appliedCoupon?: { code: string; discount: number } | null;
  couponDiscountAmount?: number;
  appliedMilestoneReward?: UserMilestone | null;
  milestoneRewardAmount?: number;
  totalDiscountAmount?: number;
  invoiceNumber?: string | null;
  isLoading?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  packageName,
  packagePrice,
  selectedAddOns = [],
  appliedDiscount,
  bundleDiscountAmount = 0,
  tieredDiscount,
  isFirstPurchase,
  tieredDiscountAmount = 0,
  loyaltyBonusAmount = 0,
  isLoyaltyProgramEnabled = false,
  limitedTimeOffer,
  offerDiscountAmount = 0,
  appliedCoupon,
  couponDiscountAmount = 0,
  appliedMilestoneReward,
  milestoneRewardAmount = 0,
  totalDiscountAmount = 0,
  invoiceNumber,
  isLoading = false,
}) => {
  const { isMobile, isDesktop } = useDevice();
  
  logger.debug('Rendering OrderSummary component', {
    context: 'OrderSummary',
    packageName,
    totalDiscount: totalDiscountAmount,
    deviceType: isMobile ? 'mobile' : isDesktop ? 'desktop' : 'tablet'
  });

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border shadow-sm p-4 lg:p-6 mb-8">
        <Skeleton className="h-8 w-2/3 mb-6" />
        <Skeleton className="h-20 w-full mb-4" />
        <Skeleton className="h-24 w-full mb-4" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  // Calculate if there are any discounts applied
  const hasAnyDiscount = bundleDiscountAmount > 0 || 
                        tieredDiscountAmount > 0 || 
                        loyaltyBonusAmount > 0 || 
                        offerDiscountAmount > 0 || 
                        couponDiscountAmount > 0 || 
                        milestoneRewardAmount > 0;

  // Calculate total add-ons price
  const addOnsTotal = selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);
  
  // Calculate subtotal (package + add-ons)
  const subtotal = packagePrice + addOnsTotal;
  
  // Calculate final total after all discounts
  const total = Math.max(0, subtotal - (totalDiscountAmount || 0));
  
  // Calculate savings percentage for the header
  const savingsPercentage = subtotal > 0 
    ? Math.round((totalDiscountAmount / subtotal) * 100) 
    : 0;

  return (
    <div className="bg-card rounded-lg border shadow-sm p-4 lg:p-6 mb-8">
      <OrderSummaryHeader 
        packageName={packageName} 
        invoiceNumber={invoiceNumber}
        savingsPercentage={savingsPercentage > 0 ? savingsPercentage : undefined}
      />
      
      <div className={`space-y-6 ${isMobile ? 'pt-3' : 'pt-4'}`}>
        <PackageSection 
          packageName={packageName}
          packagePrice={packagePrice}
          selectedAddOns={selectedAddOns}
        />
        
        {hasAnyDiscount && (
          <DiscountsSection 
            showDiscounts={hasAnyDiscount}
            appliedDiscount={appliedDiscount || undefined}
            bundleDiscountAmount={bundleDiscountAmount}
            tieredDiscount={tieredDiscount || undefined}
            isFirstPurchase={isFirstPurchase}
            tieredDiscountAmount={tieredDiscountAmount}
            loyaltyBonusAmount={loyaltyBonusAmount}
            isLoyaltyProgramEnabled={isLoyaltyProgramEnabled}
            limitedTimeOffer={limitedTimeOffer || undefined}
            offerDiscountAmount={offerDiscountAmount}
            appliedCoupon={appliedCoupon || undefined}
            couponDiscountAmount={couponDiscountAmount}
            appliedMilestoneReward={appliedMilestoneReward || undefined}
            milestoneRewardAmount={milestoneRewardAmount}
          />
        )}
        
        <OrderTotal 
          subtotal={subtotal}
          totalDiscountAmount={totalDiscountAmount}
          total={total}
          showSpecialOffer={offerDiscountAmount > 0 || (appliedMilestoneReward !== null && milestoneRewardAmount > 0)}
        />
      </div>
    </div>
  );
};

export default OrderSummary;
