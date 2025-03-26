
import { useState, useEffect } from "react";
import { PartyPopper } from "lucide-react"; 
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

type WelcomeCouponProps = {
  userId: string;
};

// Define a proper type for the coupon to match the actual database structure
interface Coupon {
  id: string;
  code: string;
  discount_percentage: number;
  description?: string;
  valid_until?: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  current_uses?: number;
  max_uses?: number;
  discount_amount?: number;
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
          .eq('active', true)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error("Error fetching coupon:", fetchError);
          setLoading(false);
          return;
        }

        if (existingCoupons) {
          // Explicitly cast the data with the defined interface to avoid deep type instantiation
          const typedCoupon: Coupon = {
            id: existingCoupons.id,
            code: existingCoupons.code,
            discount_percentage: existingCoupons.discount_percentage,
            description: existingCoupons.description,
            valid_until: existingCoupons.valid_until,
            active: existingCoupons.active,
            created_at: existingCoupons.created_at,
            updated_at: existingCoupons.updated_at,
            user_id: existingCoupons.user_id,
            current_uses: existingCoupons.current_uses,
            max_uses: existingCoupons.max_uses,
            discount_amount: existingCoupons.discount_amount
          };
          setCoupon(typedCoupon);
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
            discount_percentage: discountAmount,
            valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days - converted to ISO string
            description: 'Welcome discount for new users',
            max_uses: 1,
            active: true
          })
          .select()
          .single();
          
        if (insertError) {
          console.error("Error creating coupon:", insertError);
        } else if (newCoupon) {
          // Explicitly cast the new coupon data to avoid deep type instantiation
          const typedNewCoupon: Coupon = {
            id: newCoupon.id,
            code: newCoupon.code,
            discount_percentage: newCoupon.discount_percentage,
            description: newCoupon.description,
            valid_until: newCoupon.valid_until,
            active: newCoupon.active,
            created_at: newCoupon.created_at,
            updated_at: newCoupon.updated_at,
            user_id: newCoupon.user_id,
            current_uses: newCoupon.current_uses,
            max_uses: newCoupon.max_uses,
            discount_amount: newCoupon.discount_amount
          };
          setCoupon(typedNewCoupon);
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
