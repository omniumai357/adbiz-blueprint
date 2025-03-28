
import { useState, useEffect } from "react";
import { useOrderDetails } from "./useOrderDetails";
import { useCheckoutState } from "./useCheckoutState";
import { useCheckoutActions } from "./useCheckoutActions";
import { useCheckoutDiscounts } from "./useCheckoutDiscounts";
import { useCheckoutAddOns } from "./useCheckoutAddOns";
import { useCheckoutTotals } from "./useCheckoutTotals";
import { useProfile } from "@/hooks/data/useProfile";
import { useOrderProcessing } from "./useOrderProcessing";
import { PackageDetails, CustomerInfo } from "@/types/checkout";

/**
 * A consolidated hook that brings together all checkout functionality
 * This simplifies the API for the checkout page
 */
export function useCheckoutConsolidated(packageDetails: PackageDetails, userId: string | undefined) {
  // Initialize with package details
  const orderDetails = {
    userId: userId || null,
    packageName: packageDetails.title,
    packagePrice: packageDetails.price,
    packageDetails: packageDetails
  };
  
  // Get invoice number (could be generated or loaded)
  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  
  // Use profile data if available (for pre-filling)
  const { profile, isLoading: isProfileLoading } = useProfile(userId);
  
  // Use customer and payment state management
  const checkoutState = useCheckoutState();
  const { customerInfo, setCustomerInfo, paymentMethod, setPaymentMethod } = checkoutState;
  
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

  // Use add-ons management
  const addOns = useCheckoutAddOns();
  
  // Track total discount amount for calculations
  const [totalDiscountAmount, setTotalDiscountAmount] = useState(0);
  
  // Calculate totals based on package, add-ons, and discounts
  const totals = useCheckoutTotals({
    packagePrice: packageDetails.price,
    selectedAddOns: addOns.selectedItems,
    totalDiscountAmount
  });
  
  // Use discounts management, passing the current subtotal
  const discounts = useCheckoutDiscounts(
    userId || null,
    totals.subtotal,
    addOns.total
  );
  
  // Update total discount amount when any discount changes
  useEffect(() => {
    const newTotalDiscount = discounts.getTotalDiscount();
    setTotalDiscountAmount(newTotalDiscount);
  }, [
    discounts.bundle.amount,
    discounts.tiered.amount,
    discounts.loyalty.amount,
    discounts.offers.amount,
    discounts.coupons.amount,
    discounts.rewards.amount
  ]);
  
  // Create order processing handler
  const orderProcessing = useOrderProcessing({
    userId: userId || null,
    packageName: packageDetails.title,
    packageDetails,
    selectedAddOns: addOns.selectedItems,
    isDiscountApplicable: discounts.bundle.applicable,
    bundleDiscount: discounts.bundle.info,
    tieredDiscount: discounts.tiered.info,
    isFirstPurchase: discounts.tiered.isFirstPurchase,
    isLoyaltyProgramEnabled: discounts.loyalty.enabled,
    loyaltyBonusAmount: discounts.loyalty.amount,
    totalDiscountAmount,
    total: totals.total,
    customerInfo: customerInfo as CustomerInfo // Use type assertion since CustomerInfo won't be partial when used
  });
  
  // Handle order success
  const handleOrderSuccess = (id: string) => {
    setOrderId(id);
    orderProcessing.handleOrderSuccess(id);
    setShowDownloadOptions(true);
    setInvoiceNumber(orderProcessing.invoiceNumber);
  };

  return {
    // Order details
    orderDetails,
    
    // Customer info
    customerInfo,
    setCustomerInfo,
    
    // Payment method
    paymentMethod,
    setPaymentMethod,
    
    // Invoice info
    invoiceNumber: orderProcessing.invoiceNumber || invoiceNumber,
    orderId: orderProcessing.orderId || orderId,
    isGeneratingInvoice: orderProcessing.isGeneratingInvoice,
    showDownloadOptions: orderProcessing.showDownloadOptions || showDownloadOptions,
    
    // Add-ons
    addOns,
    
    // Discounts and offers
    discounts,
    
    // Totals
    totals,
    
    // Actions
    handleOrderSuccess,
    
    // Loading state
    isLoading: false,
    isProfileLoading
  };
}
