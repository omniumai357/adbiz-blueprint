
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle, BadgePercent } from "lucide-react";
import { toast } from "@/hooks/ui/use-toast";

type WelcomeCouponProps = {
  userId: string;
};

export function WelcomeCoupon({ userId }: WelcomeCouponProps) {
  const [copied, setCopied] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  useEffect(() => {
    // Generate a unique welcome coupon code based on userId
    const generateCouponCode = () => {
      // Use the first 6 characters of userId and add a prefix
      const userIdPart = userId.substring(0, 6);
      return `WELCOME-${userIdPart}`;
    };

    setCouponCode(generateCouponCode());
  }, [userId]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    toast({
      title: "Copied to clipboard!",
      description: "Use this code at checkout for your discount.",
    });
    
    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center text-green-800">
          <BadgePercent className="h-5 w-5 mr-2 text-green-600" />
          Welcome Discount!
        </CardTitle>
        <CardDescription className="text-green-700">
          Use this code on your first purchase
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-white p-3 rounded-md border border-green-200 flex justify-between items-center">
          <div className="font-mono font-bold text-lg tracking-wide text-green-800">
            {couponCode}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleCopyCode}
            className="text-green-700 hover:text-green-900 hover:bg-green-100"
          >
            {copied ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="mt-3 text-xs text-green-700">
          Redeem for 15% off your first purchase. Valid for 30 days.
        </p>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="text-xs text-green-600 w-full text-center">
          One-time use only. Cannot be combined with other offers.
        </div>
      </CardFooter>
    </Card>
  );
};
