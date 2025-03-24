
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '@/integrations/supabase/client';
import { Package } from '@/lib/data';
import { CustomerInfo } from '@/components/checkout/customer-info-form';
import { PaymentResult } from './payment-service';

export class StripeService {
  private stripePromise: Promise<any>;

  constructor() {
    this.stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx');
  }

  /**
   * Create a payment intent
   */
  async createPaymentIntent(amount: number, currency = 'usd'): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: { amount: amount * 100, currency }
      });
      
      if (error) throw new Error(error.message);
      
      return data.clientSecret;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  /**
   * Process a card payment
   */
  async processPayment(
    clientSecret: string,
    cardElement: any,
    packageDetails: Package,
    customerInfo: CustomerInfo
  ): Promise<PaymentResult> {
    try {
      const stripe = await this.stripePromise;
      
      const { error: paymentError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });
      
      if (paymentError) {
        throw new Error(paymentError.message);
      }

      // Save the order
      const { data: orderData, error: orderError } = await supabase.functions.invoke('save-order', {
        body: {
          packageId: packageDetails.id,
          total_amount: packageDetails.price,
          contact_info: customerInfo,
          company_info: {
            name: customerInfo.company,
            website: customerInfo.website || '',
          },
          payment_method: 'credit-card',
        }
      });
      
      if (orderError) throw new Error(orderError.message);
      
      return {
        success: true,
        orderId: orderData.id
      };
    } catch (err: any) {
      console.error("Payment error:", err);
      return {
        success: false,
        error: err.message || "An error occurred with your payment"
      };
    }
  }
}

// Export Stripe Promise for Elements provider
export const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx'
);
