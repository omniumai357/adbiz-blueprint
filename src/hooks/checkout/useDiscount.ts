
import { BundleDiscountInfo } from "@/components/checkout/bundle-discount";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Bundle discount with clearer benefits
export const bundleDiscount: BundleDiscountInfo = {
  id: "bundle-discount-1",
  name: "Bundle Discount",
  description: "Save when you add more services to your package",
  discountAmount: 10,
  discountType: "percentage",
  threshold: 50, // Minimum add-on value to qualify
  active: true
};

// Tiered discount structure
export const discountTiers = [
  {
    id: "tier-1",
    name: "Basic Discount",
    description: "Standard savings on your first purchase",
    minTotal: 0,
    maxTotal: 199.99,
    discountAmount: 5,
    discountType: "percentage",
    firstPurchaseBonus: 2, // Additional percentage for first purchase
  },
  {
    id: "tier-2",
    name: "Silver Discount",
    description: "Enhanced savings for mid-range purchases",
    minTotal: 200,
    maxTotal: 499.99,
    discountAmount: 10,
    discountType: "percentage",
    firstPurchaseBonus: 3,
  },
  {
    id: "tier-3",
    name: "Gold Discount",
    description: "Premium savings for larger purchases",
    minTotal: 500,
    maxTotal: Infinity,
    discountAmount: 15,
    discountType: "percentage",
    firstPurchaseBonus: 5,
  }
];

export function useDiscount(subtotal: number, addOnsTotal: number, userId: string | null = null) {
  // Bundle discount logic
  const isDiscountApplicable = addOnsTotal >= bundleDiscount.threshold;
  
  const bundleDiscountAmount = isDiscountApplicable 
    ? (bundleDiscount.discountType === "percentage" 
      ? (subtotal * bundleDiscount.discountAmount / 100) 
      : bundleDiscount.discountAmount)
    : 0;
  
  // New tiered discount state
  const [isFirstPurchase, setIsFirstPurchase] = useState<boolean>(false);
  const [appliedTier, setAppliedTier] = useState<typeof discountTiers[0] | null>(null);
  const [tieredDiscountAmount, setTieredDiscountAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Check if this is user's first purchase when userId changes
  useEffect(() => {
    const checkFirstPurchase = async () => {
      if (!userId) {
        setIsFirstPurchase(false);
        return;
      }

      setIsLoading(true);
      try {
        // Check if user has any previous orders
        const { count, error } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('status', 'completed');

        if (error) {
          console.error('Error checking order history:', error);
          setIsFirstPurchase(false);
        } else {
          // If count is 0, this is their first purchase
          setIsFirstPurchase(count === 0);
        }
      } catch (err) {
        console.error('Error in first purchase check:', err);
        setIsFirstPurchase(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkFirstPurchase();
  }, [userId]);

  // Determine which tier applies based on subtotal
  useEffect(() => {
    // Find the applicable tier
    const tier = discountTiers.find(
      tier => subtotal >= tier.minTotal && subtotal <= tier.maxTotal
    ) || null;
    
    setAppliedTier(tier);

    // Calculate tiered discount
    if (tier) {
      let discountPercentage = tier.discountAmount;
      
      // Add first purchase bonus if applicable
      if (isFirstPurchase) {
        discountPercentage += tier.firstPurchaseBonus;
      }
      
      const discountAmount = (subtotal * discountPercentage / 100);
      setTieredDiscountAmount(discountAmount);
    } else {
      setTieredDiscountAmount(0);
    }
  }, [subtotal, isFirstPurchase]);

  // Calculate total discount (bundle + tier)
  const totalDiscountAmount = bundleDiscountAmount + tieredDiscountAmount;

  return {
    // Bundle discount
    bundleDiscount,
    isDiscountApplicable,
    bundleDiscountAmount,
    
    // Tiered discount
    discountTiers,
    appliedTier,
    tieredDiscountAmount,
    isFirstPurchase,
    firstPurchaseBonus: appliedTier?.firstPurchaseBonus || 0,
    
    // Total discount
    totalDiscountAmount,
    isLoading
  };
}
