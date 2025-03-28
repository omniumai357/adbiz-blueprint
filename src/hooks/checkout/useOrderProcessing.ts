
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/ui/use-toast";
import { invoiceService } from "@/services/invoice/invoice-service";
import { CustomerInfo } from "@/types/checkout";
import { AddOnItem } from "@/components/checkout/add-on-item";
import { BundleDiscountInfo } from "@/components/checkout/bundle-discount";
import { useService } from "@/hooks/services/useService";

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

/**
 * Hook for processing orders after payment is complete.
 * Handles invoice generation, order recording, and success notifications.
 * 
 * @param props UseOrderProcessingProps containing all order details
 * @returns Object containing order processing state and handlers
 */
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
  const invoicesService = useService("invoices");
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);

  const handleOrderSuccess = async (id: string) => {
    setOrderId(id);
    setIsGeneratingInvoice(true);
    
    try {
      const deliveryMethod = customerInfo.invoiceDeliveryMethod || 'email';
      
      // Validate delivery method selection
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
          
          // If loyalty program was enabled, store this in the status field instead of metadata
          if (isLoyaltyProgramEnabled) {
            // Update the status field to include loyalty program info
            await supabase.from('orders').update({
              payment_method: loyaltyBonusAmount 
                ? `loyalty_program_enabled_${loyaltyBonusAmount}` 
                : 'loyalty_program_enabled'
            }).eq('id', id);
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
