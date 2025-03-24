
import React, { useState } from "react";
import { Check, Copy, BadgePercent, Sparkles, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils/format-utils";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

export interface PersonalizedCouponInfo {
  code: string;
  description: string;
  discountAmount: number;
  discountType: "percentage" | "fixed";
  validUntil: Date;
  isPersonalized: boolean;
}

interface PersonalizedCouponProps {
  coupon: PersonalizedCouponInfo | null;
  onApply: (code: string) => void;
  isApplied: boolean;
  subtotal: number;
  appliedDiscount: number;
  isLoading?: boolean;
}

const PersonalizedCoupon = ({ 
  coupon, 
  onApply, 
  isApplied, 
  subtotal, 
  appliedDiscount,
  isLoading = false
}: PersonalizedCouponProps) => {
  const [couponCode, setCouponCode] = useState<string>(coupon?.code || "");
  const [isCopied, setIsCopied] = useState(false);
  
  const handleApply = () => {
    if (couponCode.trim()) {
      onApply(couponCode.trim());
    }
  };
  
  const handleCopy = () => {
    if (coupon?.code) {
      navigator.clipboard.writeText(coupon.code);
      setIsCopied(true);
      toast({
        title: "Coupon copied!",
        description: "The coupon code has been copied to clipboard",
      });
      
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };
  
  const formattedDiscount = coupon && coupon.discountType === "percentage"
    ? `${coupon.discountAmount}%`
    : formatCurrency(coupon?.discountAmount || 0);
  
  const formattedDate = coupon?.validUntil 
    ? new Date(coupon.validUntil).toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    : null;
  
  return (
    <div className="border rounded-lg p-4 space-y-4 bg-gradient-to-br from-white to-violet-50 border-violet-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-violet-500" />
          <h4 className="font-medium">
            {coupon?.isPersonalized 
              ? "Your Personal Coupon" 
              : "Have a Coupon Code?"}
          </h4>
        </div>
        
        {coupon?.isPersonalized && (
          <div className="bg-violet-100 px-2 py-1 rounded-full text-xs font-medium text-violet-700 flex items-center">
            <Sparkles className="h-3 w-3 mr-1 text-violet-500" />
            Just for you
          </div>
        )}
      </div>
      
      {coupon?.isPersonalized && (
        <>
          <div className="bg-white border-2 border-violet-300 rounded-md p-2 flex justify-between items-center">
            <span className="font-mono font-bold text-violet-800 tracking-wider">{coupon.code}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCopy}
              className="h-8 text-violet-700 hover:text-violet-900 hover:bg-violet-100"
            >
              {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Discount:</span>
              <span className="font-medium text-violet-700">{formattedDiscount}</span>
            </div>
            {formattedDate && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valid until:</span>
                <span>{formattedDate}</span>
              </div>
            )}
            <p className="text-xs text-muted-foreground">{coupon.description}</p>
          </div>
        </>
      )}
      
      <div className="flex space-x-2">
        <Input
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="border-violet-200 focus-visible:ring-violet-500"
          disabled={isApplied || isLoading}
        />
        <Button 
          onClick={handleApply} 
          variant="outline"
          className="border-violet-200 text-violet-700 hover:text-violet-900 hover:bg-violet-100"
          disabled={!couponCode || isApplied || isLoading}
        >
          {isLoading ? "Checking..." : isApplied ? "Applied" : "Apply"}
        </Button>
      </div>
      
      {isApplied && appliedDiscount > 0 && (
        <div className="bg-violet-100 rounded-md p-2 text-sm flex justify-between items-center">
          <span className="flex items-center">
            <BadgePercent className="h-4 w-4 mr-1.5 text-violet-600" />
            Coupon applied!
          </span>
          <span className="font-medium text-violet-800">-{formatCurrency(appliedDiscount)}</span>
        </div>
      )}
    </div>
  );
};

export default PersonalizedCoupon;
