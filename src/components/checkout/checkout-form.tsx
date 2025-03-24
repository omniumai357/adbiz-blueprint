
import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/services/payment/stripe-service";
import CustomerInfoForm, { CustomerInfo } from "@/components/checkout/customer-info-form";
import PaymentSelector from "@/components/PaymentSelector";
import CardPaymentForm from "@/components/checkout/card-payment-form";
import PayPalButton from "@/components/PayPalButton";
import { Skeleton } from "@/components/ui/skeleton";

type PaymentMethod = "credit-card" | "paypal";

interface CheckoutFormProps {
  customerInfo: CustomerInfo;
  setCustomerInfo: (info: CustomerInfo) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  packagePrice: number;
  packageDetails: any;
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
  onOrderSuccess,
  isProfileLoading,
}: CheckoutFormProps) => {
  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
  };

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
          <PaymentSelector 
            selectedMethod={paymentMethod}
            onMethodChange={handlePaymentMethodChange}
          />
          
          {paymentMethod === "credit-card" ? (
            <Elements stripe={stripePromise}>
              <CardPaymentForm 
                packagePrice={packagePrice}
                packageDetails={packageDetails}
                customerInfo={customerInfo}
                onSuccess={onOrderSuccess}
              />
            </Elements>
          ) : (
            <PayPalButton 
              amount={packagePrice} 
              packageDetails={packageDetails}
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
