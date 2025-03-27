
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/ui/use-toast';

interface WelcomeCouponProps {
  userId: string;
}

export function WelcomeCoupon({ userId }: WelcomeCouponProps) {
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Generate a welcome coupon code based on user ID
    const generateCouponCode = () => {
      setIsLoading(true);
      try {
        // Simple algorithm to generate a coupon based on user ID
        const prefix = 'WELCOME';
        const userPart = userId.substring(0, 4).toUpperCase();
        const randomPart = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        
        // Set discount between 10-20%
        const discount = Math.floor(Math.random() * 11) + 10;
        
        setCouponCode(`${prefix}${userPart}${randomPart}`);
        setDiscountAmount(discount);
      } catch (error) {
        console.error('Error generating coupon:', error);
        setCouponCode('WELCOME10');
        setDiscountAmount(10);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      generateCouponCode();
    }
  }, [userId]);
  
  const handleCopyCoupon = () => {
    navigator.clipboard.writeText(couponCode).then(() => {
      toast({
        title: "Coupon copied!",
        description: "Coupon code has been copied to clipboard.",
      });
    }).catch((error) => {
      console.error('Error copying coupon:', error);
      toast({
        title: "Failed to copy",
        description: "Please copy the code manually.",
        variant: "destructive",
      });
    });
  };

  if (isLoading) {
    return (
      <Card className="relative overflow-hidden border-2 border-dashed border-primary/50">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-primary/20 rounded w-2/3 mb-4"></div>
            <div className="h-10 bg-primary/20 rounded w-full mb-3"></div>
            <div className="h-4 bg-primary/20 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden border-2 border-dashed border-primary/50 bg-primary/5">
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/10"></div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Welcome Discount</CardTitle>
          <Badge className="bg-primary/90">{discountAmount}% OFF</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="font-mono text-xl font-bold tracking-wider bg-primary/10 text-primary py-2 px-4 rounded-md w-full text-center">
            {couponCode}
          </div>
          <Button 
            size="icon" 
            variant="outline" 
            className="shrink-0" 
            onClick={handleCopyCoupon}
            title="Copy coupon code"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Use this code at checkout for {discountAmount}% off your first order.
          Valid for 30 days.
        </p>
      </CardContent>
    </Card>
  );
}
