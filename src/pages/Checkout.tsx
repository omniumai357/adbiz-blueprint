
import React from "react";
import Header from "@/components/Header";
import OrderSummary from "@/components/checkout/order-summary";
import CheckoutForm from "@/components/checkout/checkout-form";
import CheckoutSuccess from "@/components/checkout/checkout-success";
import { useCheckout } from "@/hooks/checkout/useCheckout";
import { CustomerInfo } from "@/components/checkout/customer-info-form";

const Checkout = () => {
  const {
    customerInfo,
    setCustomerInfo,
    paymentMethod,
    setPaymentMethod,
    showDownloadOptions,
    orderId,
    invoiceNumber,
    isGeneratingInvoice,
    userId,
    packageName,
    packagePrice,
    packageDetails,
    isProfileLoading,
    handleOrderSuccess,
    // Add-ons related
    availableAddOns,
    selectedAddOnIds,
    handleAddOnToggle,
    selectedAddOns,
    // Bundle discount related
    bundleDiscount,
    isDiscountApplicable,
    bundleDiscountAmount,
    // Tiered discount related
    appliedTier,
    isFirstPurchase,
    tieredDiscountAmount,
    // Loyalty program related
    isLoyaltyProgramEnabled,
    loyaltyBonusAmount,
    handleLoyaltyProgramToggle,
    // Coupon related
    personalizedCoupon,
    appliedCoupon,
    couponDiscountAmount,
    isCheckingCoupon,
    applyCoupon,
    removeCoupon,
    // Limited-time offers related
    activeOffers,
    availableOffer,
    offerDiscountAmount,
    // Milestone rewards related
    appliedMilestoneReward,
    handleMilestoneRewardApplied,
    milestoneRewardAmount,
    // Loading states
    isLoading,
    // Calculated values
    subtotal,
    totalDiscountAmount,
    total
  } = useCheckout();

  // Custom handler for customer info changes to match the expected type
  const handleCustomerInfoChange = (info: CustomerInfo) => {
    setCustomerInfo({
      firstName: info.firstName,
      lastName: info.lastName,
      company: info.company || "",
      email: info.email,
      phone: info.phone,
      website: info.website,
      invoiceDeliveryMethod: info.invoiceDeliveryMethod,
      userId: info.userId
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container px-4 mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          
          <OrderSummary 
            packageName={packageName} 
            packagePrice={packagePrice}
            selectedAddOns={selectedAddOns}
            appliedDiscount={isDiscountApplicable ? bundleDiscount : undefined}
            tieredDiscount={appliedTier}
            isFirstPurchase={isFirstPurchase}
            bundleDiscountAmount={bundleDiscountAmount}
            tieredDiscountAmount={tieredDiscountAmount}
            loyaltyBonusAmount={loyaltyBonusAmount}
            totalDiscountAmount={totalDiscountAmount}
            invoiceNumber={invoiceNumber}
            isLoyaltyProgramEnabled={isLoyaltyProgramEnabled}
            limitedTimeOffer={availableOffer ?? undefined}
            offerDiscountAmount={offerDiscountAmount}
            appliedCoupon={appliedCoupon ?? undefined}
            couponDiscountAmount={couponDiscountAmount}
            appliedMilestoneReward={appliedMilestoneReward}
            milestoneRewardAmount={milestoneRewardAmount}
          />
          
          {showDownloadOptions && orderId ? (
            <CheckoutSuccess 
              orderId={orderId}
              packageName={packageName}
              invoiceNumber={invoiceNumber}
              isGeneratingInvoice={isGeneratingInvoice}
              userId={userId}
            />
          ) : (
            <CheckoutForm 
              customerInfo={customerInfo}
              setCustomerInfo={handleCustomerInfoChange}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              packagePrice={packagePrice}
              packageDetails={packageDetails}
              addOns={availableAddOns}
              selectedAddOnIds={selectedAddOnIds}
              onAddOnToggle={handleAddOnToggle}
              bundleDiscount={bundleDiscount}
              isDiscountApplicable={isDiscountApplicable}
              tieredDiscount={appliedTier}
              isFirstPurchase={isFirstPurchase}
              bundleDiscountAmount={bundleDiscountAmount}
              tieredDiscountAmount={tieredDiscountAmount}
              isLoyaltyProgramEnabled={isLoyaltyProgramEnabled}
              loyaltyBonusAmount={loyaltyBonusAmount}
              onLoyaltyProgramToggle={handleLoyaltyProgramToggle}
              activeOffers={activeOffers}
              availableOffer={availableOffer}
              offerDiscountAmount={offerDiscountAmount}
              personalizedCoupon={personalizedCoupon}
              appliedCoupon={appliedCoupon}
              couponDiscountAmount={couponDiscountAmount}
              isCheckingCoupon={isCheckingCoupon}
              applyCoupon={applyCoupon}
              removeCoupon={removeCoupon}
              appliedMilestoneReward={appliedMilestoneReward}
              milestoneRewardAmount={milestoneRewardAmount}
              onMilestoneRewardApplied={handleMilestoneRewardApplied}
              totalDiscountAmount={totalDiscountAmount}
              onOrderSuccess={handleOrderSuccess}
              isProfileLoading={isProfileLoading}
              isLoading={isLoading}
              total={total}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Checkout;
