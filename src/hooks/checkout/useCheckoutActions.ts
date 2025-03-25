
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
    
    try {
      // Award milestone points if applicable
      // We use a default total of 0 if it's not provided by the caller
      await handleOrderSuccessWithRewards(orderId, 0);
    } catch (error) {
      console.error("Error processing rewards after order success:", error);
      // We don't want to break the main success flow if rewards fail
    }
  };
  
  return {
    handleOrderSuccess
  };
}
