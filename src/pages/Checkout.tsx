
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import CustomerInfoForm, { CustomerInfo } from "@/components/checkout/CustomerInfoForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import CardPaymentForm from "@/components/checkout/CardPaymentForm";
import PayPalButton from "@/components/PayPalButton";
import PaymentSelector from "@/components/PaymentSelector";
import DownloadOptions from "@/components/DownloadOptions";

type PaymentMethod = "credit-card" | "paypal";

const Checkout = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit-card");
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    website: "",
  });
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  // In a real implementation, get these from state or query params
  const packageName = location.state?.packageName || "Standard Package";
  const packagePrice = location.state?.packagePrice || 199;
  const packageDetails = location.state?.packageDetails || { 
    id: "default-package", 
    title: packageName,
    price: packagePrice,
    description: "Standard package with basic features",
    features: ["Feature 1", "Feature 2", "Feature 3"]
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
  };

  const handleOrderSuccess = (id: string) => {
    setOrderId(id);
    setShowDownloadOptions(true);
    
    toast({
      title: "Payment successful!",
      description: `You've purchased the ${packageName} package.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container px-4 mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          
          <OrderSummary packageName={packageName} packagePrice={packagePrice} />
          
          {showDownloadOptions && orderId ? (
            <div className="space-y-8">
              <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
                <h2 className="text-2xl font-bold text-green-700 mb-4">Thank You For Your Purchase!</h2>
                <p className="mb-6">Your order has been successfully processed. Order ID: {orderId}</p>
                <DownloadOptions purchaseId={orderId} packageName={packageName} />
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Customer Information Form */}
              <CustomerInfoForm 
                customerInfo={customerInfo}
                onChange={setCustomerInfo}
              />
              
              {/* Payment Method Selector */}
              <PaymentSelector 
                selectedMethod={paymentMethod}
                onMethodChange={handlePaymentMethodChange}
              />
              
              {/* Render appropriate payment form based on selection */}
              {paymentMethod === "credit-card" ? (
                <Elements stripe={stripePromise}>
                  <CardPaymentForm 
                    packagePrice={packagePrice}
                    packageDetails={packageDetails}
                    customerInfo={customerInfo}
                    onSuccess={handleOrderSuccess}
                  />
                </Elements>
              ) : (
                <PayPalButton 
                  amount={packagePrice} 
                  packageDetails={packageDetails}
                  customerInfo={customerInfo}
                />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Checkout;
