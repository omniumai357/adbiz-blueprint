import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { useProfile } from "@/hooks/data/useProfile";
import { Loader2 } from "lucide-react";

type PaymentMethod = "credit-card" | "paypal";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit-card");
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    invoiceDeliveryMethod: "email"
  });
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  
  const packageName = location.state?.packageName || "Standard Package";
  const packagePrice = location.state?.packagePrice || 199;
  const packageDetails = location.state?.packageDetails || { 
    id: "default-package", 
    title: packageName,
    price: packagePrice,
    description: "Standard package with basic features",
    features: ["Feature 1", "Feature 2", "Feature 3"]
  };

  // Get user profile data if they're logged in
  const { profile, isLoading: isProfileLoading } = useProfile(userId);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    
    checkUser();
  }, []);

  // Pre-fill customer info with profile data if available
  useEffect(() => {
    if (profile && !customerInfo.firstName) {
      setCustomerInfo(prevInfo => ({
        ...prevInfo,
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        company: profile.company || "",
      }));
    }
  }, [profile]);

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
  };

  const handleOrderSuccess = async (id: string) => {
    setOrderId(id);
    setIsGeneratingInvoice(true);
    
    try {
      const deliveryMethod = customerInfo.invoiceDeliveryMethod || 'email';
      
      if ((deliveryMethod === 'sms' || deliveryMethod === 'both') && !customerInfo.phone) {
        toast({
          title: "Invoice delivery warning",
          description: "Phone number is required for SMS delivery. Invoice will be sent by email only.",
          variant: "destructive"
        });
      }
      
      // Real-time invoice generation
      const invoice = await invoiceService.createInvoiceFromOrder(
        id,
        packageDetails,
        customerInfo,
        deliveryMethod as 'email' | 'sms' | 'both',
        userId
      );
      
      if (invoice) {
        setInvoiceNumber(invoice.invoice_number);
        
        // Save receipt to customer account if logged in
        if (userId) {
          await supabase.from('orders').update({
            status: 'completed',
          }).eq('id', id);
          
          toast({
            title: "Receipt saved",
            description: "A digital copy of your receipt has been stored in your account",
          });
        }
        
        // Show success notifications based on delivery method
        if (deliveryMethod === 'both' && customerInfo.phone) {
          toast({
            title: "Invoice sent!",
            description: `An invoice has been emailed to ${customerInfo.email} and sent via SMS to ${customerInfo.phone}`,
          });
        } else if (deliveryMethod === 'sms' && customerInfo.phone) {
          toast({
            title: "Invoice sent!",
            description: `An invoice has been sent via SMS to ${customerInfo.phone}`,
          });
        } else {
          toast({
            title: "Invoice sent!",
            description: `An invoice has been emailed to ${customerInfo.email}`,
          });
        }
      }
      
      setShowDownloadOptions(true);
      
      toast({
        title: "Payment successful!",
        description: `You've purchased the ${packageName} package.`,
      });
    } catch (error) {
      console.error("Failed to create invoice:", error);
      toast({
        title: "Invoice generation issue",
        description: "Your payment was successful, but there was an issue generating your invoice. Our team will contact you shortly.",
        variant: "destructive"
      });
      setShowDownloadOptions(true);
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  const viewAllReceipts = () => {
    navigate("/receipts");
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
                {isGeneratingInvoice ? (
                  <div className="flex justify-center items-center mb-6">
                    <Loader2 className="h-6 w-6 animate-spin text-green-600 mr-2" />
                    <p className="text-green-600">Generating your invoice...</p>
                  </div>
                ) : invoiceNumber ? (
                  <p className="mb-6 text-sm text-green-600">
                    Invoice #{invoiceNumber} has been sent via your preferred delivery method.
                  </p>
                ) : null}
                <DownloadOptions purchaseId={orderId} packageName={packageName} />
                
                {userId && (
                  <div className="mt-6 pt-4 border-t border-green-200">
                    <p className="text-sm text-green-600 mb-2">
                      A copy of this receipt has been stored in your account.
                    </p>
                    <button 
                      onClick={viewAllReceipts}
                      className="text-sm underline text-green-700 hover:text-green-800 transition-colors"
                    >
                      View all receipts
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <CustomerInfoForm 
                customerInfo={customerInfo}
                onChange={setCustomerInfo}
                isLoading={isProfileLoading}
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
                  onSuccess={handleOrderSuccess}
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
