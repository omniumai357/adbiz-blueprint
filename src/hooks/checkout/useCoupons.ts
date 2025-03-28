
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/ui/use-toast";

export interface CouponInfo {
  code: string;
  description: string;
  discountAmount: number | null;
  discountPercentage: number | null;
  validUntil: Date | null;
  isPersonalized: boolean;
  id?: string;
  name?: string;
  discount?: number;
}

export function useCoupons(userId: string | null, subtotal: number) {
  const { toast } = useToast();
  const [couponCode, setCouponCode] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<CouponInfo | null>(null);
  const [personalizedCoupon, setPersonalizedCoupon] = useState<CouponInfo | null>(null);
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);
  const [couponDiscountAmount, setCouponDiscountAmount] = useState<number>(0);

  useEffect(() => {
    const fetchPersonalizedCoupon = async () => {
      if (!userId) return;
      
      try {
        const { data, error } = await supabase
          .from('coupons')
          .select('*')
          .eq('user_id', userId)
          .eq('active', true)
          .lt('current_uses', 'max_uses')
          .gt('valid_until', new Date().toISOString())
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (error) {
          console.error("Error fetching personalized coupon:", error);
          return;
        }
        
        if (data) {
          setPersonalizedCoupon({
            code: data.code,
            description: data.description || "Personal discount coupon",
            discountAmount: data.discount_amount,
            discountPercentage: data.discount_percentage,
            validUntil: data.valid_until ? new Date(data.valid_until) : null,
            isPersonalized: true
          });
        }
      } catch (err) {
        console.error("Error in personalized coupon fetch:", err);
      }
    };
    
    fetchPersonalizedCoupon();
  }, [userId]);
  
  const applyCoupon = async (code: string) => {
    if (!code) return;
    
    setCouponCode(code);
    setIsCheckingCoupon(true);
    
    try {
      if (personalizedCoupon && code.toUpperCase() === personalizedCoupon.code.toUpperCase()) {
        setAppliedCoupon(personalizedCoupon);
        calculateDiscountAmount(personalizedCoupon, subtotal);
        toast({
          title: "Personal coupon applied!",
          description: "Your personal discount has been applied to your order.",
        });
        setIsCheckingCoupon(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .ilike('code', code)
        .eq('active', true)
        .lt('current_uses', 'max_uses')
        .gt('valid_until', new Date().toISOString())
        .single();
      
      if (error) {
        toast({
          title: "Invalid coupon",
          description: "This coupon code is invalid or has expired.",
          variant: "destructive"
        });
        setAppliedCoupon(null);
        setCouponDiscountAmount(0);
        setIsCheckingCoupon(false);
        return;
      }
      
      if (data) {
        if (data.user_id && data.user_id !== userId) {
          toast({
            title: "Invalid coupon",
            description: "This coupon is personalized for another customer.",
            variant: "destructive"
          });
          setAppliedCoupon(null);
          setCouponDiscountAmount(0);
          setIsCheckingCoupon(false);
          return;
        }
        
        const couponInfo: CouponInfo = {
          code: data.code,
          description: data.description || "Discount coupon",
          discountAmount: data.discount_amount,
          discountPercentage: data.discount_percentage,
          validUntil: data.valid_until ? new Date(data.valid_until) : null,
          isPersonalized: !!data.user_id,
          id: data.id, // Add id for compatibility
          name: data.description || "Coupon", // Add name for compatibility
          discount: data.discount_percentage || 0 // Add discount for compatibility
        };
        
        setAppliedCoupon(couponInfo);
        calculateDiscountAmount(couponInfo, subtotal);
        
        toast({
          title: "Coupon applied!",
          description: "Your discount has been applied to your order.",
        });
      }
    } catch (err) {
      console.error("Error applying coupon:", err);
      toast({
        title: "Error checking coupon",
        description: "There was a problem verifying your coupon. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCheckingCoupon(false);
    }
  };
  
  const calculateDiscountAmount = (coupon: CouponInfo, total: number) => {
    if (coupon.discountPercentage) {
      const discount = (total * coupon.discountPercentage) / 100;
      setCouponDiscountAmount(discount);
    } else if (coupon.discountAmount) {
      setCouponDiscountAmount(Math.min(coupon.discountAmount, total));
    } else {
      setCouponDiscountAmount(0);
    }
  };
  
  useEffect(() => {
    if (appliedCoupon) {
      calculateDiscountAmount(appliedCoupon, subtotal);
    }
  }, [subtotal, appliedCoupon]);
  
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponDiscountAmount(0);
  };
  
  const updateAmount = (total: number) => {
    if (appliedCoupon) {
      calculateDiscountAmount(appliedCoupon, total);
    }
  };
  
  return {
    couponCode,
    personalizedCoupon,
    appliedCoupon,
    couponDiscountAmount,
    isCheckingCoupon,
    applyCoupon,
    removeCoupon,
    updateAmount
  };
}
