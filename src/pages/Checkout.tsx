
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useToast } from "@/hooks/ui/use-toast";
import Header from "@/components/Header";
import { Elements } from "@stripe/react-stripe-js";
import CustomerInfoForm, { CustomerInfo } from "@/components/checkout/customer-info-form";
import OrderSummary from "@/components/checkout/order-summary";
import CardPaymentForm from "@/components/checkout/card-payment-form";
import PayPalButton from "@/components/PayPalButton";
import PaymentSelector from "@/components/PaymentSelector";
import DownloadOptions from "@/components/DownloadOptions";
import { stripePromise } from "@/services/payment/stripe-service";
import { invoiceService } from "@/services/invoice/invoice-service";
import { supabase } from "@/integrations/supabase/client";

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
  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  const packageName = location.state?.packageName || "Standard Package";
  const packagePrice = location.state?.packagePrice || 199;
  const packageDetails = location.state?.packageDetails || { 
    id: "default-package", 
    title: packageName,
    price: packagePrice,
    description: "Standard package with basic features",
    features: ["Feature 1", "Feature 2", "Feature 3"]
  };

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    
    checkUser();
  }, []);

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
  };

  const handleOrderSuccess = async (id: string) => {
    setOrderId(id);
    
    try {
      // Create and send invoice
      const invoice = await invoiceService.createInvoiceFromOrder(
        id,
        packageDetails,
        customerInfo,
        userId
      );
      
      if (invoice) {
        setInvoiceNumber(invoice.invoice_number);
        toast({
          title: "Invoice sent!",
          description: `An invoice has been emailed to ${customerInfo.email}`,
        });
      }
      
      setShowDownloadOptions(true);
      
      toast({
        title: "Payment successful!",
        description: `You've purchased the ${packageName} package.`,
      });
    } catch (error) {
      console.error("Failed to create invoice:", error);
      // Still show download options even if invoice creation fails
      setShowDownloadOptions(true);
      
      toast({
        title: "Payment successful!",
        description: `You've purchased the ${packageName} package.`,
      });
    }
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
            invoiceNumber={invoiceNumber}
          />
          
          {showDownloadOptions && orderId ? (
            <div className="space-y-8">
              <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
                <h2 className="text-2xl font-bold text-green-700 mb-4">Thank You For Your Purchase!</h2>
                <p className="mb-2">Your order has been successfully processed. Order ID: {orderId}</p>
                {invoiceNumber && (
                  <p className="mb-6 text-sm text-green-600">
                    Invoice #{invoiceNumber} has been sent to your email address.
                  </p>
                )}
                <DownloadOptions purchaseId={orderId} packageName={packageName} />
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <CustomerInfoForm 
                customerInfo={customerInfo}
                onChange={setCustomerInfo}
              />
              
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
