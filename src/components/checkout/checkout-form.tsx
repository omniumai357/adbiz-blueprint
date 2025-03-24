
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
import TieredDiscount from "@/components/checkout/tiered-discount";
import LoyaltyProgram from "@/components/checkout/loyalty-program";
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
  onOrderSuccess: (id: string) => void;
  isProfileLoading: boolean;
  isLoading?: boolean;
  total: number;
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
  tieredDiscount = null,
  isFirstPurchase = false,
  bundleDiscountAmount = 0,
  tieredDiscountAmount = 0,
  isLoyaltyProgramEnabled = false,
  loyaltyBonusAmount = 0,
  onLoyaltyProgramToggle = () => {},
  totalDiscountAmount = 0,
  onOrderSuccess,
  isProfileLoading,
  isLoading = false,
  total,
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
      
      {isLoading || isProfileLoading ? (
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
          
          {/* Discounts section */}
          <div className="space-y-4">
            {/* Tiered discount section */}
            {tieredDiscount && (
              <TieredDiscount 
                tier={tieredDiscount}
                isFirstPurchase={isFirstPurchase}
                subtotal={subtotal}
                discountAmount={tieredDiscountAmount}
              />
            )}
            
            {/* Bundle discount section */}
            {bundleDiscount && (
              <BundleDiscount 
                discount={bundleDiscount}
                subtotal={subtotal}
                applicable={isDiscountApplicable}
              />
            )}
            
            {/* Loyalty program section */}
            <LoyaltyProgram
              enabled={isLoyaltyProgramEnabled}
              onToggle={onLoyaltyProgramToggle}
              bonusAmount={loyaltyBonusAmount}
              userId={customerInfo?.userId || null}
            />
          </div>
          
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
                  discounts: {
                    bundle: isDiscountApplicable ? bundleDiscount : null,
                    tiered: tieredDiscount,
                    isFirstPurchase,
                    loyaltyProgram: isLoyaltyProgramEnabled ? {
                      enabled: true,
                      bonusAmount: loyaltyBonusAmount
                    } : null,
                    totalDiscount: totalDiscountAmount
                  }
                }}
                customerInfo={customerInfo}
                onSuccess={onOrderSuccess}
                finalAmount={total}
              />
            </Elements>
          ) : (
            <PayPalButton 
              amount={total}
              packageDetails={{
                ...packageDetails,
                addOns: selectedAddOns,
                discounts: {
                  bundle: isDiscountApplicable ? bundleDiscount : null,
                  tiered: tieredDiscount,
                  isFirstPurchase,
                  loyaltyProgram: isLoyaltyProgramEnabled ? {
                    enabled: true,
                    bonusAmount: loyaltyBonusAmount
                  } : null,
                  totalDiscount: totalDiscountAmount
                }
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
