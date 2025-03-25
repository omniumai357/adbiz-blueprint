
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import CustomerInfoForm from "@/components/checkout/customer-info-form";
import AddOnsSection from "@/components/checkout/add-ons-section";
import DiscountSection from "@/components/checkout/form/discount-section";
import PaymentSection from "@/components/checkout/form/payment-section";
import { AddOnItem } from "./add-on-item";
import { BundleDiscountInfo } from "./bundle-discount";
import { LimitedTimeOfferInfo } from "./limited-time-offer";
import { UserMilestone } from "@/hooks/rewards/useMilestones";
import { CustomerInfo } from "@/types/checkout";

type PaymentMethod = "credit-card" | "paypal";

interface CheckoutFormProps {
  customerInfo: CustomerInfo;
  setCustomerInfo: (info: CustomerInfo) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  packagePrice: number;
  packageDetails: any;
  addOns?: AddOnItem[];
  selectedAddOnIds?: string[];
  onAddOnToggle?: (id: string) => void;
  bundleDiscount?: BundleDiscountInfo;
  isDiscountApplicable?: boolean;
  tieredDiscount?: {
    id: string;
    name: string;
    description: string;
    minTotal: number;
    maxTotal: number;
    discountAmount: number;
    discountType: string;
    firstPurchaseBonus: number;
  } | null;
  isFirstPurchase?: boolean;
  bundleDiscountAmount?: number;
  tieredDiscountAmount?: number;
  isLoyaltyProgramEnabled?: boolean;
  loyaltyBonusAmount?: number;
  onLoyaltyProgramToggle?: () => void;
  totalDiscountAmount?: number;
  activeOffers?: LimitedTimeOfferInfo[];
  availableOffer?: LimitedTimeOfferInfo | null;
  offerDiscountAmount?: number;
  personalizedCoupon?: any;
  appliedCoupon?: any;
  couponDiscountAmount?: number;
  isCheckingCoupon?: boolean;
  applyCoupon?: (code: string) => void;
  removeCoupon?: () => void;
  appliedMilestoneReward?: UserMilestone | null;
  milestoneRewardAmount?: number;
  onMilestoneRewardApplied?: (reward: UserMilestone) => void;
  onOrderSuccess: (id: string) => void;
  isProfileLoading: boolean;
  isLoading?: boolean;
  total: number;
}

/**
 * CheckoutForm Component
 * 
 * Renders the complete checkout form including:
 * - Customer information
 * - Add-on selection
 * - Discounts and offers
 * - Payment options
 * 
 * @param props CheckoutFormProps containing all necessary data and handlers
 */
const CheckoutForm = ({
  customerInfo,
  setCustomerInfo,
  paymentMethod,
  setPaymentMethod,
  packagePrice,
  packageDetails,
  addOns = [],
  selectedAddOnIds = [],
  onAddOnToggle = () => {},
  bundleDiscount,
  isDiscountApplicable = false,
  tieredDiscount = null,
  isFirstPurchase = false,
  bundleDiscountAmount = 0,
  tieredDiscountAmount = 0,
  isLoyaltyProgramEnabled = false,
  loyaltyBonusAmount = 0,
  onLoyaltyProgramToggle = () => {},
  totalDiscountAmount = 0,
  activeOffers = [],
  availableOffer = null,
  offerDiscountAmount = 0,
  personalizedCoupon = null,
  appliedCoupon = null,
  couponDiscountAmount = 0,
  isCheckingCoupon = false,
  applyCoupon = () => {},
  removeCoupon = () => {},
  appliedMilestoneReward = null,
  milestoneRewardAmount = 0,
  onMilestoneRewardApplied = () => {},
  onOrderSuccess,
  isProfileLoading,
  isLoading = false,
  total,
}: CheckoutFormProps) => {
  const selectedAddOns = addOns.filter(addon => selectedAddOnIds.includes(addon.id));
  const addOnsTotal = selectedAddOns.reduce((total, addon) => total + addon.price, 0);
  const subtotal = packagePrice + addOnsTotal;

  if (isLoading || isProfileLoading) {
    return (
      <>
        <Skeleton className="w-full h-12 mt-8" />
        <Skeleton className="w-full h-48 mt-4" />
      </>
    );
  }

  return (
    <div className="space-y-8">
      <CustomerInfoForm 
        customerInfo={customerInfo}
        onChange={setCustomerInfo}
        isLoading={isProfileLoading}
      />
      
      {/* Add-ons section */}
      {addOns.length > 0 && (
        <AddOnsSection 
          addOns={addOns}
          selectedAddOns={selectedAddOnIds}
          onAddOnToggle={onAddOnToggle}
        />
      )}
      
      {/* Discounts and offers section */}
      <DiscountSection 
        subtotal={subtotal}
        userId={customerInfo?.userId || null}
        bundleDiscount={bundleDiscount}
        isDiscountApplicable={isDiscountApplicable}
        tieredDiscount={tieredDiscount}
        isFirstPurchase={isFirstPurchase}
        isLoyaltyProgramEnabled={isLoyaltyProgramEnabled}
        loyaltyBonusAmount={loyaltyBonusAmount}
        onLoyaltyProgramToggle={onLoyaltyProgramToggle}
        activeOffers={activeOffers}
        availableOffer={availableOffer}
        personalizedCoupon={personalizedCoupon}
        appliedCoupon={appliedCoupon}
        couponDiscountAmount={couponDiscountAmount}
        isCheckingCoupon={isCheckingCoupon}
        applyCoupon={applyCoupon}
        removeCoupon={removeCoupon}
        onMilestoneRewardApplied={onMilestoneRewardApplied}
        appliedMilestoneReward={appliedMilestoneReward}
      />
      
      {/* Payment section */}
      <PaymentSection 
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        subtotal={subtotal}
        packageDetails={packageDetails}
        selectedAddOns={selectedAddOns}
        customerInfo={customerInfo}
        onOrderSuccess={onOrderSuccess}
        bundleDiscount={bundleDiscount}
        isDiscountApplicable={isDiscountApplicable}
        tieredDiscount={tieredDiscount}
        isFirstPurchase={isFirstPurchase}
        isLoyaltyProgramEnabled={isLoyaltyProgramEnabled}
        loyaltyBonusAmount={loyaltyBonusAmount}
        availableOffer={availableOffer}
        offerDiscountAmount={offerDiscountAmount}
        appliedCoupon={appliedCoupon}
        couponDiscountAmount={couponDiscountAmount}
        totalDiscountAmount={totalDiscountAmount}
        total={total}
      />
    </div>
  );
};

export default CheckoutForm;
