
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { formatCurrency } from "@/lib/utils/format-utils";
import { Star, Gift, UserPlus } from "lucide-react";

interface LoyaltyProgramProps {
  enabled: boolean;
  onToggle: () => void;
  bonusAmount: number;
  userId: string | null;
}

const LoyaltyProgram = ({ enabled, onToggle, bonusAmount, userId }: LoyaltyProgramProps) => {
  const isLoggedIn = !!userId;
  
  return (
    <div className="border rounded-lg p-4 transition-all border-border bg-muted/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Star className={`h-5 w-5 ${enabled ? "text-amber-500" : "text-muted-foreground"}`} />
          <div>
            <h4 className="font-medium flex items-center">
              Loyalty Program
              {enabled && (
                <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200">
                  <Gift className="h-3 w-3 mr-1 text-amber-500" />
                  Active
                </Badge>
              )}
            </h4>
            <p className="text-sm text-muted-foreground">
              Join our loyalty program and get exclusive benefits
            </p>
          </div>
        </div>
        <Switch 
          checked={enabled} 
          onCheckedChange={onToggle}
          disabled={!isLoggedIn}
        />
      </div>

      <Separator className="my-3" />
      
      {enabled ? (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Loyalty bonus:</span>
            <span className="font-medium text-amber-600">- {formatCurrency(bonusAmount)}</span>
          </div>
          <div className="text-xs bg-amber-50 border border-amber-100 rounded p-2 text-amber-700">
            <div className="flex items-center">
              <Gift className="h-4 w-4 mr-2 text-amber-500" />
              <span className="font-medium">Loyalty benefits include:</span>
            </div>
            <ul className="mt-1 ml-6 list-disc text-amber-600">
              <li>Special promotional offers</li>
              <li>Early access to new services</li>
              <li>Priority customer support</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Potential loyalty bonus:</span>
            <span className="font-medium">{formatCurrency(bonusAmount)}</span>
          </div>
          
          {!isLoggedIn && (
            <div className="text-xs bg-blue-50 border border-blue-100 rounded p-2 text-blue-700">
              <div className="flex items-center">
                <UserPlus className="h-4 w-4 mr-2 text-blue-500" />
                <span className="font-medium">Please sign in to join our loyalty program</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LoyaltyProgram;
