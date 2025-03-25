
/**
 * Hook to centralize checkout-related actions
 */
export function useCheckoutActions({
  handleBaseOrderSuccess,
  handleOrderSuccessWithRewards
}: {
  handleBaseOrderSuccess: (orderId: string) => void;
  handleOrderSuccessWithRewards: (orderId: string, total: number) => Promise<void>;
}) {
  // Combined order success handler
  const handleOrderSuccess = async (orderId: string) => {
    // Call the base order success handler
    handleBaseOrderSuccess(orderId);
    
    // Award milestone points if applicable - pass the order total if needed
    // Since this is optional in the main component, default to 0 if not provided
    await handleOrderSuccessWithRewards(orderId, 0);
  };
  
  return {
    handleOrderSuccess
  };
}
