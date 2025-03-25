
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import CustomerInfoForm from "@/components/checkout/customer-info-form";
import DiscountSection from "@/components/checkout/form/discount-section";
import PaymentSection from "@/components/checkout/form/payment-section";
import PaymentMethodSelector from "@/components/checkout/form/payment-method-selector";
import AddOnsSelector from "@/components/checkout/form/add-ons-selector";
import DiscountDisplay from "@/components/checkout/form/discount-display";

interface CheckoutFormProps {
  checkout: ReturnType<typeof import("@/hooks/checkout/useCheckout").useCheckout>;
  onOrderSuccess: (id: string) => void;
}

/**
 * CheckoutForm Component
 * 
 * Renders the complete checkout form using smaller, focused sub-components
 * 
 * @param props CheckoutFormProps containing the checkout object and success handler
 */
const CheckoutForm = ({
  checkout,
  onOrderSuccess,
}: CheckoutFormProps) => {
  const {
    orderDetails,
    customerInfo,
    setCustomerInfo,
    paymentMethod,
    setPaymentMethod,
    addOns,
    discounts,
    totals,
    isLoading
  } = checkout;

  if (isLoading || orderDetails.isProfileLoading) {
    return (
      <>
        <Skeleton className="w-full h-12 mt-8" />
        <Skeleton className="w-full h-48 mt-4" />
      </>
    );
  }

  return (
    <div className="space-y-8">
      {/* Customer Information Section */}
      <CustomerInfoForm 
        customerInfo={customerInfo}
        onChange={setCustomerInfo}
        isLoading={orderDetails.isProfileLoading}
      />
      
      {/* Add-ons section */}
      {addOns.available.length > 0 && (
        <AddOnsSelector 
          availableAddOns={addOns.available}
          selectedAddOns={addOns.selected}
          onAddOnToggle={addOns.toggle}
        />
      )}
      
      {/* Discount summary display */}
      <DiscountDisplay 
        subtotal={totals.subtotal}
        bundleDiscount={discounts.bundle.info}
        bundleDiscountAmount={discounts.bundle.amount}
        tieredDiscount={discounts.tiered.info}
        tieredDiscountAmount={discounts.tiered.amount}
        loyaltyBonusAmount={discounts.loyalty.amount}
        isLoyaltyProgramEnabled={discounts.loyalty.enabled}
        offerDiscountAmount={discounts.offers.amount}
        couponDiscountAmount={discounts.coupons.amount}
        appliedCoupon={discounts.coupons.applied}
        milestoneRewardAmount={discounts.rewards.amount}
        appliedMilestoneReward={discounts.rewards.applied}
        totalDiscountAmount={discounts.total}
      />
      
      {/* Discounts and offers section */}
      <DiscountSection 
        subtotal={totals.subtotal}
        userId={customerInfo?.userId || null}
        bundleDiscount={discounts.bundle.info}
        isDiscountApplicable={discounts.bundle.applicable}
        tieredDiscount={discounts.tiered.info}
        isFirstPurchase={discounts.tiered.isFirstPurchase}
        isLoyaltyProgramEnabled={discounts.loyalty.enabled}
        loyaltyBonusAmount={discounts.loyalty.amount}
        onLoyaltyProgramToggle={discounts.loyalty.toggle}
        activeOffers={discounts.offers.active}
        availableOffer={discounts.offers.available}
        personalizedCoupon={discounts.coupons.personal}
        appliedCoupon={discounts.coupons.applied}
        couponDiscountAmount={discounts.coupons.amount}
        isCheckingCoupon={discounts.coupons.isChecking}
        applyCoupon={discounts.coupons.apply}
        removeCoupon={discounts.coupons.remove}
        onMilestoneRewardApplied={discounts.rewards.applyReward}
        appliedMilestoneReward={discounts.rewards.applied}
      />
      
      {/* Payment method selection */}
      <PaymentMethodSelector
        selectedMethod={paymentMethod}
        onMethodChange={setPaymentMethod}
      />
      
      {/* Payment section */}
      <PaymentSection 
        paymentMethod={paymentMethod}
        packageDetails={orderDetails.packageDetails}
        customerInfo={customerInfo}
        total={totals.total}
        onOrderSuccess={onOrderSuccess}
      />
    </div>
  );
};

export default CheckoutForm;
