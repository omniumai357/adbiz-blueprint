
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/format-utils";
import { Alarm, Clock, CalendarClock, BadgePercent, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

export interface LimitedTimeOfferInfo {
  id: string;
  name: string;
  description: string;
  discountAmount: number;
  discountType: "percentage" | "fixed";
  endTime: Date;
  active: boolean;
}

interface LimitedTimeOfferProps {
  offer: LimitedTimeOfferInfo;
  subtotal: number;
  available: boolean;
}

const LimitedTimeOffer = ({ offer, subtotal, available }: LimitedTimeOfferProps) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    expired: boolean;
  }>({ hours: 0, minutes: 0, seconds: 0, expired: false });
  
  // Calculate remaining time
  useEffect(() => {
    const calcTimeLeft = () => {
      const now = new Date();
      const endDate = new Date(offer.endTime);
      const difference = endDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, expired: true });
        return;
      }
      
      const hours = Math.floor((difference / (1000 * 60 * 60)));
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      
      setTimeLeft({ hours, minutes, seconds, expired: false });
    };
    
    calcTimeLeft();
    const timer = setInterval(calcTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [offer.endTime]);
  
  // Calculate discount value
  const discountValue = offer.discountType === "percentage"
    ? (subtotal * offer.discountAmount / 100)
    : offer.discountAmount;
  
  const formattedDiscount = offer.discountType === "percentage"
    ? `${offer.discountAmount}%`
    : formatCurrency(offer.discountAmount);
  
  // Progress towards expiration - higher number means less time left (0-100)
  const timeProgress = (() => {
    if (timeLeft.expired) return 100;
    
    // Calculate based on 24 hours max (adjust as needed)
    const hoursLeft = timeLeft.hours + (timeLeft.minutes / 60) + (timeLeft.seconds / 3600);
    const maxHours = 24; // Adjust based on your expected offer duration
    
    return Math.max(0, Math.min(100, 100 - ((hoursLeft / maxHours) * 100)));
  })();
  
  // Format time display
  const formatTime = (time: number) => time.toString().padStart(2, '0');
  
  return (
    <div className={cn(
      "border rounded-lg p-4 transition-all",
      available && !timeLeft.expired
        ? "border-red-300 bg-red-50" 
        : "border-gray-200 bg-gray-50 opacity-75"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {available && !timeLeft.expired ? (
            <Alarm className="h-5 w-5 text-red-500" />
          ) : (
            <Clock className="h-5 w-5 text-gray-400" />
          )}
          <div>
            <h4 className="font-medium flex items-center gap-2">
              {offer.name}
              {timeLeft.expired && (
                <span className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-600">
                  Expired
                </span>
              )}
              {!timeLeft.expired && timeLeft.hours < 1 && (
                <span className="text-xs bg-red-100 px-2 py-0.5 rounded text-red-600 animate-pulse flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Ending soon
                </span>
              )}
            </h4>
            <p className="text-sm text-muted-foreground">{offer.description}</p>
          </div>
        </div>
      </div>

      <Separator className="my-3" />
      
      {available && !timeLeft.expired ? (
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Limited time offer:</span>
            <span className="font-medium text-red-500">- {formattedDiscount}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>You save:</span>
            <span className="text-red-500 font-medium">{formatCurrency(discountValue)}</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Offer expires in</span>
              <span>{timeProgress}% elapsed</span>
            </div>
            <Progress value={timeProgress} className="h-2" indicatorClassName="bg-red-500" />
            
            <div className="text-center text-red-600 font-semibold mt-2 bg-red-50 rounded-md py-2 border border-red-100">
              {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3 opacity-60">
          <div className="flex justify-between text-sm">
            <span>Offer discount:</span>
            <span className="font-medium">{formattedDiscount}</span>
          </div>
          
          {timeLeft.expired ? (
            <div className="text-center text-gray-500 bg-gray-100 rounded-md py-2 text-sm">
              <CalendarClock className="inline-block h-4 w-4 mr-2" />
              This offer has expired
            </div>
          ) : (
            <div className="text-center text-gray-500 bg-gray-100 rounded-md py-2 text-sm">
              <BadgePercent className="inline-block h-4 w-4 mr-2" />
              Not applicable to your order
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LimitedTimeOffer;
