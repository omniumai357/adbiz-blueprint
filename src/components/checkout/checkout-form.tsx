
import React, { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import CustomerInfoForm from "@/components/checkout/customer-info-form";
import DiscountSection from "@/components/checkout/form/discount-section";
import PaymentSection from "@/components/checkout/form/payment-section";
import PaymentMethodSelector from "@/components/checkout/form/payment-method-selector";
import AddOnsSelector from "@/components/checkout/form/add-ons-selector";
import DiscountDisplay from "@/components/checkout/form/discount-display";
import { UserMilestone } from "@/hooks/rewards/useMilestones";
import { useCheckoutValidation } from "@/hooks/checkout/useCheckoutValidation";

interface CheckoutFormProps {
  checkout: ReturnType<typeof import("@/hooks/checkout/useCheckoutConsolidated").useCheckoutConsolidated>;
  onOrderSuccess: (id: string) => void;
}

/**
 * CheckoutForm Component
 * 
 * Renders the complete checkout form using smaller, focused sub-components
 * with integrated validation
 * 
 * @param props CheckoutFormProps containing the checkout object and success handler
 */
const CheckoutForm = ({
  checkout,
  onOrderSuccess,
}: CheckoutFormProps) => {
  const {
    isLoading,
    isProfileLoading,
    customerInfo,
    setCustomerInfo,
    paymentMethod,
    setPaymentMethod,
    addOns,
    discounts,
    totals,
    orderDetails
  } = checkout;
  
  // Use the checkout validation hook
  const validation = useCheckoutValidation();
  
  // Validate customer info when it changes
  useEffect(() => {
    if (customerInfo) {
      validation.validateCustomerInfo(customerInfo);
    }
  }, [customerInfo]);

  // Custom order success handler with validation
  const handleOrderSuccess = (id: string) => {
    if (!validation.validateCheckoutSubmission(customerInfo)) {
      return;
    }
    
    validation.setIsSubmitting(true);
    
    try {
      onOrderSuccess(id);
      toast.success("Order completed successfully", {
        description: `Your order #${id} has been processed.`
      });
    } catch (error) {
      console.error("Order processing error:", error);
      toast.error("Order processing failed", {
        description: "There was an error processing your order. Please try again."
      });
    } finally {
      validation.setIsSubmitting(false);
    }
  };

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
      {/* Customer Information Section */}
      <CustomerInfoForm 
        customerInfo={customerInfo}
        onChange={setCustomerInfo}
        isLoading={isProfileLoading}
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
        appliedMilestoneReward={discounts.rewards.applied as unknown as UserMilestone}
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
        personalizedCoupon={null}
        appliedCoupon={discounts.coupons.applied}
        couponDiscountAmount={discounts.coupons.amount}
        isCheckingCoupon={discounts.coupons.isChecking}
        applyCoupon={discounts.coupons.apply}
        removeCoupon={discounts.coupons.remove}
        onMilestoneRewardApplied={(reward) => discounts.rewards.applyReward(reward as any)}
        appliedMilestoneReward={discounts.rewards.applied as unknown as UserMilestone}
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
        onOrderSuccess={handleOrderSuccess}
      />
    </div>
  );
};

export default CheckoutForm;
