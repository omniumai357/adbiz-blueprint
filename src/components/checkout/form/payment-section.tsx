
import React from "react";
import { useToast } from "@/hooks/ui/use-toast";
import PayPalButton from "@/components/PayPalButton";
import CardPaymentForm from "@/components/checkout/card-payment-form";
import { CustomerInfo } from "@/types/checkout";
import { BundleDiscountInfo } from "../bundle-discount";
import { LimitedTimeOfferInfo } from "../limited-time-offer";

interface PaymentSectionProps {
  paymentMethod: "credit-card" | "paypal";
  setPaymentMethod: (method: "credit-card" | "paypal") => void;
  subtotal: number;
  packageDetails: any;
  selectedAddOns: any[];
  customerInfo: CustomerInfo;
  onOrderSuccess: (id: string) => void;
  bundleDiscount?: BundleDiscountInfo;
  isDiscountApplicable?: boolean;
  tieredDiscount?: any;
  isFirstPurchase?: boolean;
  isLoyaltyProgramEnabled?: boolean;
  loyaltyBonusAmount?: number;
  availableOffer?: LimitedTimeOfferInfo | null;
  offerDiscountAmount?: number;
  appliedCoupon?: any;
  couponDiscountAmount?: number;
  totalDiscountAmount?: number;
  total: number;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
  paymentMethod,
  packageDetails,
  customerInfo,
  onOrderSuccess,
  total,
}) => {
  const { toast } = useToast();

  const handleOrderSuccess = (orderId: string) => {
    toast({
      title: "Payment successful!",
      description: "Your order has been processed successfully.",
    });
    
    onOrderSuccess(orderId);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Payment</h2>
      
      {paymentMethod === "credit-card" ? (
        <CardPaymentForm
          packagePrice={packageDetails.price}
          packageDetails={packageDetails}
          customerInfo={customerInfo}
          onSuccess={handleOrderSuccess}
          finalAmount={total}
        />
      ) : (
        <PayPalButton
          amount={total}
          packageDetails={packageDetails}
          customerInfo={customerInfo}
          onSuccess={handleOrderSuccess}
        />
      )}
    </div>
  );
};

export default PaymentSection;
