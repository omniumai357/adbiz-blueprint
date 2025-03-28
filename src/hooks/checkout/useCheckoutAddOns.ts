
import { useState } from "react";
import { AddOnItem } from "@/components/checkout/add-on-item";

/**
 * Hook for managing add-ons in the checkout process
 * 
 * Extracted from useCheckout to improve modularity and maintainability
 * 
 * @returns Object containing add-on state and handlers
 */
export function useCheckoutAddOns() {
  // Available add-ons (in a real app, these would come from the API)
  const available = [
    {
      id: "addon-1",
      name: "Priority Support",
      description: "Get priority access to our support team",
      price: 19.99,
    },
    {
      id: "addon-2",
      name: "Extended Coverage",
      description: "Extend your coverage period by 3 months",
      price: 29.99,
    },
    {
      id: "addon-3",
      name: "Customization Package",
      description: "Custom branding and personalization options",
      price: 49.99,
    },
  ];
  
  // Selected add-ons
  const [selected, setSelected] = useState<string[]>([]);
  
  // Toggle an add-on selection
  const toggle = (addonId: string) => {
    setSelected(prev => 
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };
  
  // Get selected add-on items with full details
  const selectedItems = available.filter(addon => 
    selected.includes(addon.id)
  );
  
  // Calculate total price of selected add-ons
  const total = selectedItems.reduce(
    (sum, addon) => sum + addon.price, 
    0
  );
  
  return {
    // Data
    available,
    selected,
    selectedItems,
    total,
    
    // Actions
    toggle,
  };
}
