
import React from "react";
import Header from "@/components/Header";
import OrderSummary from "@/components/checkout/order-summary";
import CheckoutForm from "@/components/checkout/checkout-form";
import CheckoutSuccess from "@/components/checkout/checkout-success";
import { useCheckout } from "@/hooks/checkout/useCheckout";

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
    // Calculated values
    total
  } = useCheckout();

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
            invoiceNumber={invoiceNumber}
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
              setCustomerInfo={setCustomerInfo}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              packagePrice={packagePrice}
              packageDetails={packageDetails}
              addOns={availableAddOns}
              selectedAddOnIds={selectedAddOnIds}
              onAddOnToggle={handleAddOnToggle}
              bundleDiscount={bundleDiscount}
              isDiscountApplicable={isDiscountApplicable}
              onOrderSuccess={handleOrderSuccess}
              isProfileLoading={isProfileLoading}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Checkout;
