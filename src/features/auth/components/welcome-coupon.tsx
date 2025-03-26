
import { useState, useEffect } from "react";
import { PartyPopper } from "lucide-react"; // Changed from Confetti to PartyPopper
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

type WelcomeCouponProps = {
  userId: string;
};

// Define a proper type for the coupon to avoid infinite type instantiation
interface Coupon {
  id: string;
  code: string;
  type?: string;
  discount_percentage: number;
  description?: string;
  expires_at?: string;
  is_active?: boolean;
  created_at?: string;
}

export function WelcomeCoupon({ userId }: WelcomeCouponProps) {
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        // Check if there's an existing coupon first
        const { data: existingCoupons, error: fetchError } = await supabase
          .from('coupons')
          .select('*')
          .eq('user_id', userId)
          .eq('type', 'welcome')
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error("Error fetching coupon:", fetchError);
          setLoading(false);
          return;
        }

        if (existingCoupons) {
          setCoupon(existingCoupons as Coupon);
          setLoading(false);
          return;
        }

        // Generate a welcome coupon if none exists
        const discountAmount = 15; // 15% welcome discount
        const couponCode = `WELCOME-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        
        const { data: newCoupon, error: insertError } = await supabase
          .from('coupons')
          .insert({
            user_id: userId,
            code: couponCode,
            type: 'welcome',
            discount_percentage: discountAmount,
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            description: 'Welcome discount for new users',
            max_uses: 1,
            is_active: true
          })
          .select()
          .single();
          
        if (insertError) {
          console.error("Error creating coupon:", insertError);
        } else {
          setCoupon(newCoupon as Coupon);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchCoupon();
    }
  }, [userId]);

  const handleCopy = () => {
    if (coupon?.code) {
      navigator.clipboard.writeText(coupon.code);
      setCopySuccess(true);
      toast({
        title: "Copied!",
        description: "Coupon code copied to clipboard"
      });
      
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    }
  };

  if (loading) {
    return (
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-48 bg-purple-200" />
          <Skeleton className="h-4 w-36 mt-1 bg-purple-200" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-16 w-full bg-purple-200 mb-4" />
          <Skeleton className="h-10 w-full bg-purple-200" />
        </CardContent>
      </Card>
    );
  }

  if (!coupon) {
    return null;
  }

  return (
    <Card className="border-purple-200 bg-purple-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center text-purple-800">
          <PartyPopper className="h-5 w-5 mr-2 text-purple-600" />
          Welcome Discount
        </CardTitle>
        <CardDescription className="text-purple-700">
          A special offer just for you!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-white p-4 rounded-md border border-purple-200 mb-4 text-center">
          <p className="text-sm text-purple-700 mb-2">Your coupon code:</p>
          <div className="flex items-center justify-center space-x-3">
            <code className="relative rounded bg-purple-100 px-[0.5rem] py-[0.3rem] font-mono text-lg font-semibold text-purple-900">
              {coupon.code}
            </code>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-purple-300 text-purple-700 hover:bg-purple-100"
              onClick={handleCopy}
            >
              {copySuccess ? "Copied!" : "Copy"}
            </Button>
          </div>
          <div className="mt-2 flex justify-center">
            <Badge className="bg-purple-600">
              {coupon.discount_percentage}% OFF
            </Badge>
          </div>
        </div>
        <p className="text-xs text-purple-700 text-center">
          Apply this coupon during checkout. Expires in 30 days.
        </p>
      </CardContent>
    </Card>
  );
}
