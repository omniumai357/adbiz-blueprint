
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LimitedTimeOfferInfo } from "@/components/checkout/limited-time-offer";

// Extend the LimitedTimeOfferInfo to include endTime
interface TimeOffer extends LimitedTimeOfferInfo {
  expiresAt: string;
  endTime: Date;
}

export function useLimitedTimeOffers(subtotal: number) {
  const [activeOffers, setActiveOffers] = useState<TimeOffer[]>([]);
  const [availableOffer, setAvailableOffer] = useState<TimeOffer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [offerDiscountAmount, setOfferDiscountAmount] = useState<number>(0);

  // Demo offers for now - in a real app, these would come from the database
  useEffect(() => {
    const fetchLimitedTimeOffers = async () => {
      setIsLoading(true);
      
      try {
        // In a real implementation, fetch from the database
        // For now, generate a demo offer that expires in a random time
        const now = new Date();
        
        // Create a demo offer that expires in a random time between 10 minutes and 4 hours
        const randomMinutes = 10 + Math.floor(Math.random() * 230); // 10 min to 4 hours
        const endTime = new Date(now.getTime() + (randomMinutes * 60 * 1000));
        const expiresAt = endTime.toISOString();
        
        const demoOffer: TimeOffer = {
          id: "flash-sale-1",
          name: "Flash Sale",
          description: "Limited time offer - act fast!",
          discountAmount: 15,
          discountType: "percentage",
          active: true,
          expiresAt: expiresAt,
          endTime: endTime
        };
        
        setActiveOffers([demoOffer]);
        
        // Check if the offer applies to the current subtotal
        // For this demo, let's say it applies to orders over $100
        if (subtotal >= 100) {
          setAvailableOffer(demoOffer);
          
          // Calculate discount amount
          const discountAmount = demoOffer.discountType === "percentage"
            ? (subtotal * demoOffer.discountAmount / 100)
            : demoOffer.discountAmount;
            
          setOfferDiscountAmount(discountAmount);
        } else {
          setAvailableOffer(null);
          setOfferDiscountAmount(0);
        }
      } catch (err) {
        console.error("Error fetching limited time offers:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLimitedTimeOffers();
    
    // Set up a timer to check for offer expiration
    const intervalId = setInterval(() => {
      setActiveOffers(prevOffers => {
        const now = new Date();
        const updatedOffers = prevOffers.filter(offer => 
          offer.endTime.getTime() > now.getTime()
        );
        
        if (updatedOffers.length !== prevOffers.length) {
          setAvailableOffer(null);
          setOfferDiscountAmount(0);
        }
        
        return updatedOffers;
      });
    }, 10000); // Check every 10 seconds
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Recalculate when subtotal changes
  useEffect(() => {
    if (availableOffer) {
      // Update eligibility based on subtotal
      if (subtotal >= 100) {
        const discountAmount = availableOffer.discountType === "percentage"
          ? (subtotal * availableOffer.discountAmount / 100)
          : availableOffer.discountAmount;
          
        setOfferDiscountAmount(discountAmount);
      } else {
        setAvailableOffer(null);
        setOfferDiscountAmount(0);
      }
    }
  }, [subtotal, availableOffer]);

  return {
    activeOffers,
    availableOffer,
    offerDiscountAmount,
    isLoading
  };
}
