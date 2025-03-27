import React from "react";
import { formatCurrency } from "@/lib/utils/format-utils";
import { Clock, BadgePercent } from "lucide-react";
import { cva } from "class-variance-authority";
import { Progress } from "@/components/ui/progress";

export interface LimitedTimeOfferInfo {
  id: string;
  name: string;
  description: string;
  discountAmount: number;
  discountType: "percentage" | "fixed";
  threshold?: number;
  expiresAt: string;
  active: boolean;
  discount?: number; // For backward compatibility
}

interface LimitedTimeOfferProps {
  offer: LimitedTimeOfferInfo;
  subtotal: number;
  available: boolean;
}

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline:
          "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const LimitedTimeOffer = ({ offer, subtotal, available }: LimitedTimeOfferProps) => {
  const discountValue = offer.discountType === "percentage"
    ? (subtotal * offer.discountAmount / 100)
    : offer.discountAmount;
  
  const formattedDiscount = offer.discountType === "percentage"
    ? `${offer.discountAmount}%`
    : formatCurrency(offer.discountAmount);

  // Calculate time remaining until offer expires
  const timeLeft = new Date(offer.expiresAt).getTime() - new Date().getTime();
  const daysLeft = Math.ceil(timeLeft / (1000 * 3600 * 24));

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center space-x-3">
        <BadgePercent className="h-5 w-5 text-orange-500" />
        <div>
          <h4 className="font-medium">{offer.name}</h4>
          <p className="text-sm text-muted-foreground">{offer.description}</p>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Discount:</span>
          <span className="font-medium text-orange-600">{formattedDiscount}</span>
        </div>
        <div className="flex justify-between font-medium">
          <span>You save:</span>
          <span className="text-orange-600">{formatCurrency(discountValue)}</span>
        </div>
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          <span>
            {daysLeft > 0
              ? `Offer ends in ${daysLeft} day${daysLeft > 1 ? "s" : ""}`
              : "Offer ends today!"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LimitedTimeOffer;
