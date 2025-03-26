
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckIcon, CopyIcon, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/ui/use-toast";

type WelcomeCouponProps = {
  userId: string;
};

export function WelcomeCoupon({ userId }: WelcomeCouponProps) {
  const [coupon, setCoupon] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchWelcomeCoupon = async () => {
      try {
        // Check if user already has a welcome coupon
        const { data: existingCoupons, error: checkError } = await supabase
          .from("user_coupons")
          .select("*, coupons(*)")
          .eq("user_id", userId)
          .eq("coupon_type", "welcome")
          .single();

        if (checkError && checkError.code !== "PGRST116") {
          console.error("Error checking for existing coupon:", checkError);
          throw checkError;
        }

        if (existingCoupons) {
          setCoupon(existingCoupons.coupons);
          setIsLoading(false);
          return;
        }

        // No existing coupon, create one
        const welcomeCode = `WELCOME${Math.floor(1000 + Math.random() * 9000)}`;
        
        // Create new coupon in coupons table
        const { data: newCoupon, error: couponError } = await supabase
          .from("coupons")
          .insert({
            code: welcomeCode,
            discount_percentage: 10,
            valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
            active: true,
            description: "Welcome discount for new users",
            coupon_type: "welcome"
          })
          .select()
          .single();

        if (couponError) {
          console.error("Error creating welcome coupon:", couponError);
          throw couponError;
        }

        // Link coupon to user
        const { error: linkError } = await supabase
          .from("user_coupons")
          .insert({
            user_id: userId,
            coupon_id: newCoupon.id,
            coupon_type: "welcome",
            created_at: new Date().toISOString()
          });

        if (linkError) {
          console.error("Error linking coupon to user:", linkError);
          throw linkError;
        }

        setCoupon(newCoupon);
      } catch (error) {
        console.error("Error generating welcome coupon:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchWelcomeCoupon();
    }
  }, [userId]);

  const handleCopyCode = () => {
    if (coupon?.code) {
      navigator.clipboard.writeText(coupon.code);
      setIsCopied(true);
      toast({
        title: "Code copied!",
        description: "Coupon code has been copied to clipboard.",
      });
      
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-32">
            <div className="animate-pulse">
              <div className="h-4 w-48 bg-muted rounded mb-4"></div>
              <div className="h-8 w-32 bg-muted rounded mx-auto mb-4"></div>
              <div className="h-10 w-full bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!coupon) {
    return (
      <Card className="border-primary/20 bg-destructive/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Something went wrong</CardTitle>
          <CardDescription>
            We couldn't generate your welcome coupon. Please try refreshing the page.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const validUntil = new Date(coupon.valid_until).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-primary" />
              Welcome Discount
            </CardTitle>
            <CardDescription>
              Special offer for new accounts
            </CardDescription>
          </div>
          <div className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-bold">
            {coupon.discount_percentage}% OFF
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">
          {coupon.description || "Use this coupon on your first purchase!"}
          <span className="block text-xs text-muted-foreground mt-1">
            Valid until {validUntil}
          </span>
        </p>
        
        <div className="flex gap-2">
          <div className="bg-muted/70 flex-grow rounded-md p-2.5 flex items-center justify-center font-mono text-sm">
            {coupon.code}
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleCopyCode}
            className="shrink-0"
          >
            {isCopied ? <CheckIcon className="h-4 w-4 text-green-500" /> : <CopyIcon className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
