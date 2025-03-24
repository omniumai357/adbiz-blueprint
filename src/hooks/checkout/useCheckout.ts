
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useToast } from "@/hooks/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { invoiceService } from "@/services/invoice/invoice-service";
import { CustomerInfo } from "@/components/checkout/customer-info-form";
import { useProfile } from "@/hooks/data/useProfile";

type PaymentMethod = "credit-card" | "paypal";

export function useCheckout() {
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

  return {
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
    handleOrderSuccess
  };
}
