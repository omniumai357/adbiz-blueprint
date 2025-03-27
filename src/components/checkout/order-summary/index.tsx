
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import OrderSummaryHeader from "./order-summary-header";
import PackageSection from "./package-section";
import { DiscountsSection } from "./discounts-section"; 
import OrderTotal from "./order-total";
import { useDevice } from "@/hooks/use-device";
import { logger } from "@/lib/utils/logging";
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
  appliedCoupon?: { 
    code: string; 
    discount: number;
    id: string; 
    name: string;
    discountAmount: number;
    firstPurchaseBonus?: number;
  } | null;
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
    data: {
      packageName,
      totalDiscount: totalDiscountAmount,
      deviceType: isMobile ? 'mobile' : isDesktop ? 'desktop' : 'tablet'
    }
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

  const hasAnyDiscount = bundleDiscountAmount > 0 || 
                        tieredDiscountAmount > 0 || 
                        loyaltyBonusAmount > 0 || 
                        offerDiscountAmount > 0 || 
                        couponDiscountAmount > 0 || 
                        milestoneRewardAmount > 0;

  const addOnsTotal = selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);
  
  const subtotal = packagePrice + addOnsTotal;
  
  const total = Math.max(0, subtotal - (totalDiscountAmount || 0));
  
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
            bundleDiscount={appliedDiscount || undefined}
            couponDiscount={appliedCoupon || undefined}
            limitedTimeOffer={limitedTimeOffer || undefined}
            milestoneReward={appliedMilestoneReward || undefined}
            tieredDiscount={tieredDiscount ? {
              threshold: tieredDiscount.discountAmount,
              discountPercent: tieredDiscount.discountAmount,
              applied: !!tieredDiscountAmount && tieredDiscountAmount > 0
            } : undefined}
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
