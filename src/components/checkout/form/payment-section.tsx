
import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/services/payment/stripe-service";
import CardPaymentForm from "@/components/checkout/card-payment-form";
import PayPalButton from "@/components/PayPalButton";
import PaymentSelector from "@/components/PaymentSelector";
import { CustomerInfo } from "@/components/checkout/customer-info-form";
import { AddOnItem } from "../add-on-item";
import { BundleDiscountInfo } from "../bundle-discount";
import { LimitedTimeOfferInfo } from "../limited-time-offer";

interface PaymentSectionProps {
  paymentMethod: "credit-card" | "paypal";
  setPaymentMethod: (method: "credit-card" | "paypal") => void;
  subtotal: number;
  packageDetails: any;
  selectedAddOns: AddOnItem[];
  customerInfo: CustomerInfo;
  onOrderSuccess: (id: string) => void;
  bundleDiscount: BundleDiscountInfo | undefined;
  isDiscountApplicable: boolean;
  tieredDiscount: any;
  isFirstPurchase: boolean;
  isLoyaltyProgramEnabled: boolean;
  loyaltyBonusAmount: number;
  availableOffer: LimitedTimeOfferInfo | null;
  offerDiscountAmount: number;
  appliedCoupon: any;
  couponDiscountAmount: number;
  totalDiscountAmount: number;
  total: number;
}

const PaymentSection = ({
  paymentMethod,
  setPaymentMethod,
  subtotal,
  packageDetails,
  selectedAddOns,
  customerInfo,
  onOrderSuccess,
  bundleDiscount,
  isDiscountApplicable,
  tieredDiscount,
  isFirstPurchase,
  isLoyaltyProgramEnabled,
  loyaltyBonusAmount,
  availableOffer,
  offerDiscountAmount,
  appliedCoupon,
  couponDiscountAmount,
  totalDiscountAmount,
  total
}: PaymentSectionProps) => {
  const handlePaymentMethodChange = (method: "credit-card" | "paypal") => {
    setPaymentMethod(method);
  };

  const discountsData = {
    bundle: isDiscountApplicable ? bundleDiscount : null,
    tiered: tieredDiscount,
    isFirstPurchase,
    loyaltyProgram: isLoyaltyProgramEnabled ? {
      enabled: true,
      bonusAmount: loyaltyBonusAmount
    } : null,
    limitedTimeOffer: availableOffer ? {
      name: availableOffer.name,
      discountAmount: offerDiscountAmount
    } : null,
    coupon: appliedCoupon ? {
      code: appliedCoupon.code,
      discountAmount: couponDiscountAmount
    } : null,
    totalDiscount: totalDiscountAmount
  };

  const packageWithAddOns = {
    ...packageDetails,
    addOns: selectedAddOns,
    discounts: discountsData
  };

  return (
    <div className="space-y-6">
      <PaymentSelector 
        selectedMethod={paymentMethod}
        onMethodChange={handlePaymentMethodChange}
      />
      
      {paymentMethod === "credit-card" ? (
        <Elements stripe={stripePromise}>
          <CardPaymentForm 
            packagePrice={subtotal}
            packageDetails={packageWithAddOns}
            customerInfo={customerInfo}
            onSuccess={onOrderSuccess}
            finalAmount={total}
          />
        </Elements>
      ) : (
        <PayPalButton 
          amount={total}
          packageDetails={packageWithAddOns}
          customerInfo={customerInfo}
          onSuccess={onOrderSuccess}
        />
      )}
    </div>
  );
};

export default PaymentSection;
