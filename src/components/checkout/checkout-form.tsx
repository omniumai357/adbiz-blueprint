
import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/services/payment/stripe-service";
import CustomerInfoForm, { CustomerInfo } from "@/components/checkout/customer-info-form";
import PaymentSelector from "@/components/PaymentSelector";
import CardPaymentForm from "@/components/checkout/card-payment-form";
import PayPalButton from "@/components/PayPalButton";
import { Skeleton } from "@/components/ui/skeleton";
import AddOnsSection from "@/components/checkout/add-ons-section";
import BundleDiscount from "@/components/checkout/bundle-discount";
import { AddOnItem } from "./add-on-item";
import { BundleDiscountInfo } from "./bundle-discount";

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
  onOrderSuccess: (id: string) => void;
  isProfileLoading: boolean;
}

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
  onOrderSuccess,
  isProfileLoading,
}: CheckoutFormProps) => {
  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
  };

  const selectedAddOns = addOns.filter(addon => selectedAddOnIds.includes(addon.id));
  const addOnsTotal = selectedAddOns.reduce((total, addon) => total + addon.price, 0);
  const subtotal = packagePrice + addOnsTotal;

  return (
    <div className="space-y-8">
      <CustomerInfoForm 
        customerInfo={customerInfo}
        onChange={setCustomerInfo}
        isLoading={isProfileLoading}
      />
      
      {isProfileLoading ? (
        <>
          <Skeleton className="w-full h-12 mt-8" />
          <Skeleton className="w-full h-48 mt-4" />
        </>
      ) : (
        <>
          {/* Add-ons section */}
          {addOns.length > 0 && (
            <AddOnsSection 
              addOns={addOns}
              selectedAddOns={selectedAddOnIds}
              onAddOnToggle={onAddOnToggle}
            />
          )}
          
          {/* Bundle discount section */}
          {bundleDiscount && (
            <div className="mt-8">
              <BundleDiscount 
                discount={bundleDiscount}
                subtotal={subtotal}
                applicable={isDiscountApplicable}
              />
            </div>
          )}
          
          <PaymentSelector 
            selectedMethod={paymentMethod}
            onMethodChange={handlePaymentMethodChange}
          />
          
          {paymentMethod === "credit-card" ? (
            <Elements stripe={stripePromise}>
              <CardPaymentForm 
                packagePrice={subtotal}
                packageDetails={{
                  ...packageDetails,
                  addOns: selectedAddOns,
                  discount: isDiscountApplicable ? bundleDiscount : null
                }}
                customerInfo={customerInfo}
                onSuccess={onOrderSuccess}
              />
            </Elements>
          ) : (
            <PayPalButton 
              amount={subtotal} 
              packageDetails={{
                ...packageDetails,
                addOns: selectedAddOns,
                discount: isDiscountApplicable ? bundleDiscount : null
              }}
              customerInfo={customerInfo}
              onSuccess={onOrderSuccess}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CheckoutForm;
