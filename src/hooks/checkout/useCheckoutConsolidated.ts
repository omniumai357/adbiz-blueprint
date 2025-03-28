
/**
 * Consolidated checkout hook
 * 
 * This hook brings together all checkout-related functionality into a single interface,
 * reducing complexity and making the checkout flow easier to understand and maintain.
 */

import { useState, useEffect } from "react";
import { useService } from "@/hooks/services/useService";
import { useToast } from "@/hooks/ui/use-toast";
import { useCheckoutAddOns } from "./useCheckoutAddOns";
import { useCheckoutDiscounts } from "./useCheckoutDiscounts";
import { useCheckoutTotals } from "./useCheckoutTotals";
import { useProfile } from "@/hooks/data/useProfile";
import { CustomerInfo, PackageDetails } from "@/types/checkout";
import { useCheckoutState } from "./useCheckoutState";
import { useOrderDetails } from "./useOrderDetails";
import { Profile } from "@/types/api";

/**
 * Consolidated checkout hook
 * 
 * This hook brings together all checkout-related functionality into a single interface,
 * reducing complexity and making the checkout flow easier to understand and maintain.
 * 
 * @param packageDetails Details of the package being purchased
 * @param userId Current user ID
 * @returns A consolidated object with all checkout state and handlers
 */
export function useCheckoutConsolidated(
  packageDetails: PackageDetails,
  userId: string | null | undefined
) {
  const api = useService('api');
  const { toast } = useToast();
  
  // Core checkout state
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  
  // Get user profile data
  const { profile, isLoading: isProfileLoading } = useProfile(userId);
  
  // Get order details
  const orderDetails = useOrderDetails();
  
  // Customer and payment state
  const checkoutState = useCheckoutState();
  const { customerInfo, setCustomerInfo, paymentMethod, setPaymentMethod } = checkoutState;
  
  // Add-ons management
  const addOns = useCheckoutAddOns();
  
  // Totals calculations
  const totals = useCheckoutTotals({
    packagePrice: packageDetails.price,
    selectedAddOns: addOns.selectedItems,
    totalDiscountAmount: 0 // Initial value, will be updated
  });
  
  // Discounts management
  const discounts = useCheckoutDiscounts(
    userId,
    totals.subtotal,
    addOns.total
  );
  
  // Update totals when discounts change
  useEffect(() => {
    totals.recalculate();
  }, [discounts.total]);
  
  // Pre-fill customer info with profile data if available
  useEffect(() => {
    if (profile) {
      setCustomerInfo({
        userId: profile.id,
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        company: profile.company || "",
        email: profile.email || "",
        invoiceDeliveryMethod: "email"
      });
    }
  }, [profile, setCustomerInfo]);
  
  // Order success handler
  const handleOrderSuccess = async (newOrderId: string) => {
    setOrderId(newOrderId);
    setIsGeneratingInvoice(true);
    
    try {
      // Generate invoice logic here
      setInvoiceNumber(`INV-${Date.now()}`);
      setShowDownloadOptions(true);
      
      // Award milestone points if applicable
      if (userId) {
        try {
          await api.milestones.updateMilestoneProgress({
            userId,
            points: Math.floor(totals.total),
            activityType: 'order_completed',
            referenceId: newOrderId,
            referenceType: 'order'
          });
        } catch (error) {
          console.error("Error updating milestone progress:", error);
          // Non-critical error, we don't want to block the order success flow
        }
      }
      
      toast({
        title: "Payment successful!",
        description: `You've purchased the ${packageDetails.title} package.`,
      });
    } catch (error) {
      console.error("Error handling order success:", error);
      toast({
        title: "Error completing order",
        description: "There was an error processing your order.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingInvoice(false);
    }
  };
  
  return {
    // Order details (added this to fix the TypeScript error)
    orderDetails: {
      showDownloadOptions,
      orderId,
      invoiceNumber,
      isGeneratingInvoice,
      userId: userId || '',
      packageName: packageDetails.title,
      packagePrice: packageDetails.price,
      packageDetails,
      isProfileLoading,
      profile: profile as Profile,
      handleOrderSuccess
    },
    
    // State
    isLoading,
    isProfileLoading,
    orderId,
    showDownloadOptions,
    invoiceNumber,
    isGeneratingInvoice,
    packageDetails,
    
    // Customer info
    customerInfo,
    setCustomerInfo,
    
    // Payment method
    paymentMethod,
    setPaymentMethod,
    
    // Add-ons
    addOns,
    
    // Discounts
    discounts,
    
    // Totals
    totals,
    
    // Actions
    handleOrderSuccess
  };
}
