
import { useState, useEffect } from "react";

export function useLoyaltyProgram(userId: string | null, subtotal: number) {
  const [isLoyaltyProgramEnabled, setIsLoyaltyProgramEnabled] = useState<boolean>(false);
  const [loyaltyBonusAmount, setLoyaltyBonusAmount] = useState<number>(0);
  
  // Calculate loyalty bonus (5% of subtotal if loyalty program is enabled)
  useEffect(() => {
    if (isLoyaltyProgramEnabled && userId) {
      setLoyaltyBonusAmount(subtotal * 0.05);
    } else {
      setLoyaltyBonusAmount(0);
    }
  }, [isLoyaltyProgramEnabled, subtotal, userId]);
  
  // Handle loyalty program toggle
  const handleLoyaltyProgramToggle = () => {
    if (userId) {
      setIsLoyaltyProgramEnabled(!isLoyaltyProgramEnabled);
    }
  };

  return {
    isLoyaltyProgramEnabled,
    loyaltyBonusAmount,
    handleLoyaltyProgramToggle
  };
}
