
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
  const handleOrderSuccess = async (orderId: string, total: number) => {
    // Call the base order success handler
    handleBaseOrderSuccess(orderId);
    
    // Award milestone points if applicable
    await handleOrderSuccessWithRewards(orderId, total);
  };
  
  return {
    handleOrderSuccess
  };
}
