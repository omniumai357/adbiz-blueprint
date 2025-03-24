
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useToast } from "@/hooks/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { invoiceService } from "@/services/invoice/invoice-service";
import { CustomerInfo } from "@/components/checkout/customer-info-form";
import { useProfile } from "@/hooks/data/useProfile";
import { AddOnItem } from "@/components/checkout/add-on-item";
import { BundleDiscountInfo } from "@/components/checkout/bundle-discount";

type PaymentMethod = "credit-card" | "paypal";

// Example add-ons
const availableAddOns: AddOnItem[] = [
  {
    id: "addon-seo",
    name: "SEO Optimization",
    description: "Boost visibility with search engine optimization",
    price: 49,
    popular: true
  },
  {
    id: "addon-socialmedia",
    name: "Social Media Setup",
    description: "Get your business profiles set up on major platforms",
    price: 29
  },
  {
    id: "addon-analytics",
    name: "Advanced Analytics",
    description: "Detailed performance tracking and reporting",
    price: 39
  }
];

// Example bundle discount
const bundleDiscount: BundleDiscountInfo = {
  id: "bundle-discount-1",
  name: "Bundle Discount",
  description: "Save when you add more services",
  discountAmount: 10,
  discountType: "percentage",
  threshold: 50, // Minimum add-on value to qualify
  active: true
};

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
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  
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

  // Calculate totals for add-ons
  const selectedAddOns = availableAddOns.filter(addon => selectedAddOnIds.includes(addon.id));
  const addOnsTotal = selectedAddOns.reduce((total, addon) => total + addon.price, 0);
  
  // Check if discount is applicable
  const isDiscountApplicable = addOnsTotal >= bundleDiscount.threshold;

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

  // Handle add-on toggle
  const handleAddOnToggle = (id: string) => {
    setSelectedAddOnIds(prevSelected => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter(itemId => itemId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
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
      
      // Calculate final price including add-ons and discounts
      const finalTotal = packagePrice + addOnsTotal;
      const discountedTotal = isDiscountApplicable 
        ? finalTotal * (1 - bundleDiscount.discountAmount / 100)
        : finalTotal;
      
      // Include add-ons and discounts in package details
      const enhancedPackageDetails = {
        ...packageDetails,
        addOns: selectedAddOns,
        discount: isDiscountApplicable ? bundleDiscount : null,
        finalPrice: discountedTotal
      };
      
      // Real-time invoice generation
      const invoice = await invoiceService.createInvoiceFromOrder(
        id,
        enhancedPackageDetails,
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
    handleOrderSuccess,
    // Add-ons related
    availableAddOns,
    selectedAddOnIds,
    handleAddOnToggle,
    selectedAddOns,
    // Bundle discount related
    bundleDiscount,
    isDiscountApplicable,
    // Calculated total
    subtotal: packagePrice + addOnsTotal,
    discountAmount: isDiscountApplicable ? (packagePrice + addOnsTotal) * bundleDiscount.discountAmount / 100 : 0,
    total: isDiscountApplicable 
      ? (packagePrice + addOnsTotal) * (1 - bundleDiscount.discountAmount / 100) 
      : (packagePrice + addOnsTotal)
  };
}
