
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
import ResponsiveFormSection from "@/components/checkout/form/responsive-form-section";

interface CheckoutFormProps {
  checkout: ReturnType<typeof import("@/hooks/checkout/useCheckoutConsolidated").useCheckoutConsolidated>;
  onOrderSuccess: (id: string) => void;
}

/**
 * CheckoutForm Component
 * 
 * Renders the complete checkout form using smaller, focused sub-components
 * with integrated validation and responsive design
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
      <div className="space-y-6">
        <Skeleton className="w-full h-12 rounded-lg" />
        <Skeleton className="w-full h-72 rounded-lg" />
        <Skeleton className="w-full h-48 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Customer Information Section */}
      <ResponsiveFormSection 
        title="Customer Information"
        description="Please provide your contact details"
      >
        <CustomerInfoForm 
          customerInfo={customerInfo}
          onChange={setCustomerInfo}
          isLoading={isProfileLoading}
        />
      </ResponsiveFormSection>
      
      {/* Add-ons section */}
      {addOns.available.length > 0 && (
        <ResponsiveFormSection
          title="Additional Services"
          description="Enhance your package with these add-ons"
        >
          <AddOnsSelector 
            availableAddOns={addOns.available}
            selectedAddOns={addOns.selected}
            onAddOnToggle={addOns.toggle}
          />
        </ResponsiveFormSection>
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
      <ResponsiveFormSection
        title="Discounts & Special Offers"
        description="Apply discounts or join our loyalty program"
      >
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
      </ResponsiveFormSection>
      
      {/* Payment method selection */}
      <ResponsiveFormSection
        title="Payment Method"
        description="Choose how you'd like to pay"
      >
        <PaymentMethodSelector
          selectedMethod={paymentMethod}
          onMethodChange={setPaymentMethod}
        />
      </ResponsiveFormSection>
      
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
