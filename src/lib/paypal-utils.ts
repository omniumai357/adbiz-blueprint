
// This file is being replaced by the service-based approach
// Importing the new service for backward compatibility

import { paymentService } from '@/services/payment/payment-service';
import { Package } from '@/lib/data';
import { CustomerInfo } from '@/components/checkout/customer-info-form';

export interface PayPalOrderDetails {
  packageId: string;
  total_amount: number;
  contact_info: CustomerInfo;
  company_info: {
    name: string;
    website: string;
  };
  payment_id: string;
}

// Function to initialize PayPal SDK and render button - using the new service
export const renderPayPalButton = async (
  amount: number,
  packageDetails: Package,
  customerInfo: CustomerInfo,
  containerRef: React.RefObject<HTMLDivElement>,
  onSuccess: () => void,
  onError: (errorMessage: string) => void
) => {
  if (!containerRef.current) return false;
  
  return paymentService.processPayPalPayment(
    amount,
    packageDetails,
    customerInfo,
    containerRef.current,
    () => onSuccess(),
    onError
  );
};
