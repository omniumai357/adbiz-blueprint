
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AddOnItem, CustomerInfo } from "@/types/checkout";

interface UseCheckoutDataOptions {
  userId?: string | null;
  profile?: any | null;
}

/**
 * Consolidated hook that manages add-on selection and customer information
 * for the checkout flow. This combines functionality previously spread across
 * multiple hooks.
 * 
 * @param options Configuration options including user ID and profile data
 * @returns Object containing add-on and customer info state and handlers
 */
export function useCheckoutData({ userId, profile }: UseCheckoutDataOptions = {}) {
  // Add-on selection state
  const [availableAddOns, setAvailableAddOns] = useState<AddOnItem[]>([]);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const { toast } = useToast();

  // Customer information state
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    invoiceDeliveryMethod: "email"
  });

  // Fetch available add-ons
  useEffect(() => {
    const fetchAddOns = async () => {
      try {
        const { data: addonsData, error: addonsError } = await supabase
          .from("packages")
          .select("*")
          .eq("category", "add-on");

        if (addonsError) {
          throw addonsError;
        }

        if (addonsData && Array.isArray(addonsData)) {
          const addOns: AddOnItem[] = addonsData.map((addon) => ({
            id: addon.id,
            name: addon.title,
            description: addon.description,
            price: addon.price,
          }));
          setAvailableAddOns(addOns);
        } else {
          console.warn("No add-ons found or invalid data format.");
          setAvailableAddOns([]);
        }
      } catch (error) {
        console.error("Error fetching add-ons:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch available add-ons.",
        });
      }
    };

    fetchAddOns();
  }, [toast]);

  // Handle add-on toggle
  const handleAddOnToggle = (id: string) => {
    setSelectedAddOnIds((prev) =>
      prev.includes(id) ? prev.filter((addOnId) => addOnId !== id) : [...prev, id]
    );
  };

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
  }, [profile]);

  // Compute selected add-ons based on IDs
  const selectedAddOns = availableAddOns.filter(addon => selectedAddOnIds.includes(addon.id));
  
  // Calculate add-ons total price
  const addOnsTotal = selectedAddOns.reduce((total, addon) => total + addon.price, 0);

  return {
    // Add-ons related
    availableAddOns,
    selectedAddOnIds,
    handleAddOnToggle,
    selectedAddOns,
    addOnsTotal,
    
    // Customer info related
    customerInfo,
    setCustomerInfo
  };
}
