
import { Package } from '@/lib/data';
import { CustomerInfo } from '@/types/checkout';
import { PayPalService } from './paypal-service';
import { StripeService } from './stripe-service';

// Define a common interface for order details
export interface OrderDetails {
  packageId: string;
  total_amount: number;
  contact_info: CustomerInfo;
  company_info: {
    name: string;
    website: string;
  };
  payment_method: 'credit-card' | 'paypal';
  payment_id?: string;
}

// Payment result interface
export interface PaymentResult {
  success: boolean;
  orderId?: string;
  error?: string;
}

export class PaymentService {
  private paypalService: PayPalService;
  private stripeService: StripeService;

  constructor() {
    this.paypalService = new PayPalService();
    this.stripeService = new StripeService();
  }

  async processPayPalPayment(
    amount: number,
    packageDetails: Package,
    customerInfo: CustomerInfo,
    paypalButtonContainer: HTMLElement,
    onSuccess: (orderId: string) => void,
    onError: (errorMessage: string) => void
  ): Promise<boolean> {
    return this.paypalService.renderAndProcessPayment(
      amount,
      packageDetails,
      customerInfo,
      paypalButtonContainer,
      onSuccess,
      onError
    );
  }

  async processCardPayment(
    clientSecret: string,
    cardElement: any, 
    packageDetails: Package,
    customerInfo: CustomerInfo
  ): Promise<PaymentResult> {
    return this.stripeService.processPayment(
      clientSecret,
      cardElement,
      packageDetails,
      customerInfo
    );
  }

  async createPaymentIntent(amount: number, currency = 'usd'): Promise<string> {
    return this.stripeService.createPaymentIntent(amount, currency);
  }
  
  /**
   * Save order details to the database
   * @param orderDetails Order information to save
   * @returns Promise resolving to the saved order data
   */
  async saveOrder(orderDetails: any): Promise<any> {
    // Delegate to Stripe service for saving the order
    return this.stripeService.saveOrder(orderDetails);
  }
}

// Create a singleton instance
export const paymentService = new PaymentService();
