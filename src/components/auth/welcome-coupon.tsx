
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Gift } from "lucide-react";
import { useToast } from "@/hooks/ui/use-toast";
import { formatDistance } from "date-fns";

interface WelcomeCouponProps {
  userId: string;
}

interface Coupon {
  id: string;
  code: string;
  description: string;
  discount_percentage: number;
  valid_until: string;
  max_uses: number;
  current_uses: number;
}

export function WelcomeCoupon({ userId }: WelcomeCouponProps) {
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("coupons")
          .select("*")
          .eq("user_id", userId)
          .eq("active", true)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (error) {
          console.error("Error fetching coupon:", error);
          return;
        }

        setCoupon(data);
      } catch (error) {
        console.error("Error in fetchCoupon:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchCoupon();
    }
  }, [userId]);

  const copyToClipboard = () => {
    if (coupon) {
      navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      toast({
        title: "Coupon code copied!",
        description: "You can use it during checkout.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="h-24 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!coupon) {
    return null;
  }

  const expiryDate = new Date(coupon.valid_until);
  const timeUntilExpiry = formatDistance(expiryDate, new Date(), { addSuffix: true });

  return (
    <Card className="w-full relative overflow-hidden">
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-primary/10 flex items-end justify-start p-2">
        <Gift className="w-6 h-6 text-primary" />
      </div>
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm font-semibold mr-2">
            {coupon.discount_percentage}% OFF
          </span>
          Welcome Discount
        </CardTitle>
        <CardDescription>
          Expires {timeUntilExpiry}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center my-2">
          <div className="bg-gray-100 border border-gray-200 px-4 py-2 rounded-md text-center font-mono text-lg">
            {coupon.code}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={copyToClipboard} 
            className="ml-2"
            aria-label="Copy coupon code"
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-muted-foreground text-sm text-center mt-2">
          {coupon.description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <Button variant="outline" onClick={() => window.location.href = "/"}>
          Continue to Homepage
        </Button>
      </CardFooter>
    </Card>
  );
}
