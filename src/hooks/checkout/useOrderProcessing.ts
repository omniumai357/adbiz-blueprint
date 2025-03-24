
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/ui/use-toast";
import { invoiceService } from "@/services/invoice/invoice-service";
import { CustomerInfo } from "@/components/checkout/customer-info-form";
import { AddOnItem } from "@/components/checkout/add-on-item";
import { BundleDiscountInfo } from "@/components/checkout/bundle-discount";

interface UseOrderProcessingProps {
  userId: string | null;
  packageName: string;
  packageDetails: any;
  selectedAddOns: AddOnItem[];
  isDiscountApplicable: boolean;
  bundleDiscount: BundleDiscountInfo;
  tieredDiscount?: {
    id: string;
    name: string;
    description: string;
    discountAmount: number;
    discountType: string;
    firstPurchaseBonus: number;
  } | null;
  isFirstPurchase?: boolean;
  isLoyaltyProgramEnabled?: boolean;
  loyaltyBonusAmount?: number;
  totalDiscountAmount: number;
  total: number;
  customerInfo: CustomerInfo;
}

export function useOrderProcessing({
  userId,
  packageName,
  packageDetails,
  selectedAddOns,
  isDiscountApplicable,
  bundleDiscount,
  tieredDiscount,
  isFirstPurchase,
  isLoyaltyProgramEnabled,
  loyaltyBonusAmount,
  totalDiscountAmount,
  total,
  customerInfo
}: UseOrderProcessingProps) {
  const { toast } = useToast();
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);

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
      
      // Construct discount information to include in the invoice
      const discountInfo = {
        bundleDiscount: isDiscountApplicable ? bundleDiscount : null,
        tieredDiscount: tieredDiscount ? {
          ...tieredDiscount,
          isFirstPurchase,
          appliedBonus: isFirstPurchase ? tieredDiscount.firstPurchaseBonus : 0
        } : null,
        loyaltyProgram: isLoyaltyProgramEnabled ? {
          enabled: true,
          bonusAmount: loyaltyBonusAmount || 0
        } : null,
        totalDiscountAmount
      };
      
      // Include add-ons and discounts in package details
      const enhancedPackageDetails = {
        ...packageDetails,
        addOns: selectedAddOns,
        discounts: discountInfo,
        finalPrice: total
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
          
          // If loyalty program was enabled, record this in the order metadata
          if (isLoyaltyProgramEnabled) {
            await supabase.from('order_metadata').insert({
              order_id: id,
              loyalty_program_enrolled: isLoyaltyProgramEnabled,
              loyalty_discount_applied: loyaltyBonusAmount || 0
            });
          }
          
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
      
      // Show different success message based on customer status
      if (isFirstPurchase) {
        toast({
          title: "First purchase complete! 🎉",
          description: `Thank you for your first purchase of the ${packageName} package. We've applied a special first-time buyer discount!`,
        });
      } else if (isLoyaltyProgramEnabled) {
        toast({
          title: "Purchase complete and loyalty program joined! 🌟",
          description: `Thank you for joining our loyalty program. You've received a special bonus on your ${packageName} package.`,
        });
      } else {
        toast({
          title: "Payment successful!",
          description: `You've purchased the ${packageName} package.`,
        });
      }
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
    showDownloadOptions,
    orderId,
    invoiceNumber,
    isGeneratingInvoice,
    handleOrderSuccess
  };
}
