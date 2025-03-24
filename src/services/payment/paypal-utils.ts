
import { PayPalService } from './paypal-service';
import { Package } from '@/lib/data';
import { CustomerInfo } from '@/components/checkout/customer-info-form';

// This is a simple wrapper around the PayPalService
// Kept for backward compatibility with existing code
export const renderPayPalButton = async (
  amount: number,
  packageDetails: Package,
  customerInfo: CustomerInfo,
  containerRef: React.RefObject<HTMLDivElement>,
  onSuccess: () => void,
  onError: (errorMessage: string) => void
) => {
  if (!containerRef.current) return false;
  
  const paypalService = new PayPalService();
  return paypalService.renderAndProcessPayment(
    amount,
    packageDetails,
    customerInfo,
    containerRef.current,
    (orderId) => onSuccess(),
    onError
  );
};
