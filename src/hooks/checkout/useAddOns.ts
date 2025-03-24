
import { useState } from "react";
import { AddOnItem } from "@/components/checkout/add-on-item";
import { formatCurrency } from "@/lib/utils/format-utils";
import { useToast } from "@/hooks/ui/use-toast";

// Enhanced add-ons with value propositions
export const availableAddOns: AddOnItem[] = [
  {
    id: "addon-seo",
    name: "SEO Optimization",
    description: "Boost visibility with search engine optimization",
    price: 49,
    popular: true,
    valueProposition: "Increase your site traffic up to 30%"
  },
  {
    id: "addon-socialmedia",
    name: "Social Media Setup",
    description: "Get your business profiles set up on major platforms",
    price: 29,
    valueProposition: "Establish presence on 5 major platforms"
  },
  {
    id: "addon-analytics",
    name: "Advanced Analytics",
    description: "Detailed performance tracking and reporting",
    price: 39,
    valueProposition: "Gain valuable insights with monthly reports"
  }
];

export function useAddOns(
  bundleDiscountThreshold: number
) {
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const { toast } = useToast();

  // Get selected add-ons and calculate total
  const selectedAddOns = availableAddOns.filter(addon => 
    selectedAddOnIds.includes(addon.id)
  );
  
  const addOnsTotal = selectedAddOns.reduce(
    (total, addon) => total + addon.price, 
    0
  );

  // Handle add-on toggle with feedback
  const handleAddOnToggle = (id: string) => {
    setSelectedAddOnIds(prevSelected => {
      const newSelected = prevSelected.includes(id)
        ? prevSelected.filter(itemId => itemId !== id)
        : [...prevSelected, id];
        
      // Show toast when an add-on is added that makes the discount applicable
      const newAddOnsTotal = availableAddOns
        .filter(addon => newSelected.includes(addon.id))
        .reduce((total, addon) => total + addon.price, 0);
        
      const wasDiscountApplicable = addOnsTotal >= bundleDiscountThreshold;
      const isNowDiscountApplicable = newAddOnsTotal >= bundleDiscountThreshold;
      
      if (!wasDiscountApplicable && isNowDiscountApplicable) {
        const discountValue = (bundleDiscountThreshold * 0.1); // Assuming 10% discount
          
        toast({
          title: "Discount Applied!",
          description: `You've qualified for a 10% discount, saving you ${formatCurrency(discountValue)}!`,
        });
      }
      
      return newSelected;
    });
  };

  return {
    selectedAddOnIds,
    setSelectedAddOnIds,
    selectedAddOns,
    addOnsTotal,
    handleAddOnToggle
  };
}
