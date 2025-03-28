
import { useCallback } from "react";

interface UseCheckoutActionsProps {
  handleBaseOrderSuccess: (orderId: string) => void;
  handleOrderSuccessWithRewards: (orderId: string, orderTotal: number) => Promise<void>;
}

/**
 * Hook for managing checkout action handlers
 * 
 * Coordinates different success handlers for the checkout process
 * 
 * @param props Object containing base handlers for order success
 * @returns Object containing combined handlers
 */
export function useCheckoutActions({
  handleBaseOrderSuccess,
  handleOrderSuccessWithRewards
}: UseCheckoutActionsProps) {
  // Combined order success handler
  const handleOrderSuccess = useCallback(async (orderId: string) => {
    // First call the base handler
    handleBaseOrderSuccess(orderId);
    
    // Then call the rewards handler
    try {
      await handleOrderSuccessWithRewards(orderId, 0); // Total will be calculated inside
    } catch (error) {
      console.error("Failed to process rewards for order:", error);
      // Non-critical error, we don't want to block the order success flow
    }
  }, [handleBaseOrderSuccess, handleOrderSuccessWithRewards]);
  
  return {
    handleOrderSuccess
  };
}
