
import React from "react";
import Header from "@/components/Header";
import OrderSummary from "@/components/checkout/order-summary";
import CheckoutForm from "@/components/checkout/checkout-form";
import CheckoutSuccess from "@/components/checkout/checkout-success";
import { useCheckout } from "@/hooks/checkout/useCheckout";
import { CustomerInfo } from "@/types/checkout";

/**
 * Checkout Page Component
 * 
 * Handles the complete checkout flow including:
 * - Customer information collection
 * - Add-on selection
 * - Discounts and offers
 * - Payment processing
 * - Order confirmation
 * 
 * The component uses the consolidated useCheckout hook to manage all state
 * and business logic, keeping the component focused on presentation.
 */
const Checkout = () => {
  const checkout = useCheckout();
  const { 
    orderDetails, 
    customerInfo, 
    setCustomerInfo,
    paymentMethod, 
    setPaymentMethod,
    addOns,
    discounts,
    totals,
    handleOrderSuccess,
    isLoading,
  } = checkout;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container px-4 mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          
          <OrderSummary 
            packageName={orderDetails.packageName} 
            packagePrice={orderDetails.packagePrice}
            selectedAddOns={addOns.selectedItems}
            appliedDiscount={discounts.bundle.info}
            tieredDiscount={discounts.tiered.info}
            isFirstPurchase={discounts.tiered.isFirstPurchase}
            bundleDiscountAmount={discounts.bundle.amount}
            tieredDiscountAmount={discounts.tiered.amount}
            loyaltyBonusAmount={discounts.loyalty.amount}
            totalDiscountAmount={discounts.total}
            invoiceNumber={orderDetails.invoiceNumber}
            isLoyaltyProgramEnabled={discounts.loyalty.enabled}
            limitedTimeOffer={discounts.offers.available ?? undefined}
            offerDiscountAmount={discounts.offers.amount}
            appliedCoupon={discounts.coupons.applied ?? undefined}
            couponDiscountAmount={discounts.coupons.amount}
            appliedMilestoneReward={discounts.rewards.applied}
            milestoneRewardAmount={discounts.rewards.amount}
          />
          
          {orderDetails.showDownloadOptions && orderDetails.orderId ? (
            <CheckoutSuccess 
              orderId={orderDetails.orderId}
              packageName={orderDetails.packageName}
              invoiceNumber={orderDetails.invoiceNumber}
              isGeneratingInvoice={orderDetails.isGeneratingInvoice}
              userId={orderDetails.userId}
            />
          ) : (
            <CheckoutForm 
              checkout={checkout}
              onOrderSuccess={handleOrderSuccess}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Checkout;
