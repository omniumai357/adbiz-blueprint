
/**
 * @deprecated This file is being replaced by the service-based approach
 * Import directly from @/services/payment/stripe-service or @/services/payment/payment-service
 */

import { stripePromise } from '@/services/payment/stripe-service';
import { paymentService } from '@/services/payment/payment-service';

// For backward compatibility
export { stripePromise };

// For backward compatibility - these delegate to the payment service
export const createPaymentIntent = async (amount: number, currency = 'USD') => {
  return paymentService.createPaymentIntent(amount, currency);
};

export const saveOrder = async (orderDetails: any) => {
  return paymentService.saveOrder(orderDetails);
};
