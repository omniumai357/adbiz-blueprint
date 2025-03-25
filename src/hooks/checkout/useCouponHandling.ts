
import { useState } from "react";
import { useToast } from "@/hooks/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook to manage coupon application, validation, and discount calculation.
 * 
 * @returns Object containing coupon state and handlers
 */
export function useCouponHandling() {
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);
  const [couponDiscountAmount, setCouponDiscountAmount] = useState<number>(0);
  const { toast } = useToast();

  const applyCoupon = async (code: string) => {
    setIsCheckingCoupon(true);
    try {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", code)
        .single();

      if (error) {
        throw error;
      }

      if (data && data.active && new Date(data.valid_until) > new Date()) {
        setAppliedCoupon(data);
        toast({
          title: "Coupon Applied!",
          description: `Coupon ${code} applied successfully.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Invalid Coupon",
          description: "This coupon is either invalid or expired.",
        });
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to apply coupon. Please try again.",
      });
    } finally {
      setIsCheckingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast({
      title: "Coupon Removed",
      description: "The applied coupon has been removed.",
    });
  };

  // Update coupon discount amount based on applied coupon and subtotal
  const updateCouponDiscountAmount = (subtotal: number) => {
    if (appliedCoupon) {
      if (appliedCoupon.discount_percentage) {
        setCouponDiscountAmount((subtotal * appliedCoupon.discount_percentage) / 100);
      } else if (appliedCoupon.discount_amount) {
        setCouponDiscountAmount(appliedCoupon.discount_amount);
      }
    } else {
      setCouponDiscountAmount(0);
    }
  };

  return {
    appliedCoupon,
    isCheckingCoupon,
    couponDiscountAmount,
    applyCoupon,
    removeCoupon,
    updateCouponDiscountAmount,
    setAppliedCoupon
  };
}
