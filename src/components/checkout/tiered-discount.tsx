
import React from "react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/format-utils";
import { Sparkles, Award, BadgePercent } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface TieredDiscountProps {
  tier: {
    id: string;
    name: string;
    description: string;
    minTotal: number;
    maxTotal: number;
    discountAmount: number;
    discountType: string;
    firstPurchaseBonus: number;
  } | null;
  isFirstPurchase: boolean;
  subtotal: number;
  discountAmount: number;
}

const TieredDiscount = ({ 
  tier, 
  isFirstPurchase, 
  subtotal, 
  discountAmount 
}: TieredDiscountProps) => {
  if (!tier) return null;

  const renderDiscountDetails = () => {
    const baseDiscount = tier.discountAmount;
    const bonusDiscount = isFirstPurchase ? tier.firstPurchaseBonus : 0;
    const totalDiscount = baseDiscount + bonusDiscount;
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Base tier discount ({baseDiscount}%):</span>
          <span className="font-medium text-primary">
            - {formatCurrency(subtotal * baseDiscount / 100)}
          </span>
        </div>
        
        {isFirstPurchase && (
          <div className="flex justify-between text-sm">
            <span className="flex items-center">
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-yellow-500" />
              First purchase bonus ({bonusDiscount}%):
            </span>
            <span className="font-medium text-yellow-500">
              - {formatCurrency(subtotal * bonusDiscount / 100)}
            </span>
          </div>
        )}
        
        <div className="flex justify-between font-medium pt-1">
          <span>Total tier savings:</span>
          <span className="text-primary">{formatCurrency(discountAmount)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className={cn(
      "border rounded-lg p-4 transition-all",
      "border-primary/30 bg-primary/5"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Award className="h-5 w-5 text-primary" />
          <div>
            <h4 className="font-medium flex items-center">
              {tier.name}
              {isFirstPurchase && (
                <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200">
                  <Sparkles className="h-3 w-3 mr-1 text-yellow-500" />
                  First Purchase
                </Badge>
              )}
            </h4>
            <p className="text-sm text-muted-foreground">{tier.description}</p>
          </div>
        </div>
      </div>

      <Separator className="my-3" />
      
      {renderDiscountDetails()}
      
      {isFirstPurchase && (
        <div className="mt-3 text-sm bg-yellow-50 border border-yellow-100 rounded p-2 text-yellow-700">
          <div className="flex items-center">
            <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
            <span className="font-medium">First purchase bonus applied!</span>
          </div>
          <p className="text-xs mt-1 text-yellow-600">
            New customers receive an additional {tier.firstPurchaseBonus}% discount on their first order.
          </p>
        </div>
      )}
    </div>
  );
};

export default TieredDiscount;
