
import { initializePayPal } from '@/lib/paypal';
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

export class PayPalService {
  private _paypalInstance: any = null;

  /**
   * Initialize PayPal SDK
   */
  private async getPayPalInstance(): Promise<any> {
    if (this._paypalInstance) {
      return this._paypalInstance;
    }

    try {
      const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
      
      if (!paypalClientId) {
        throw new Error('PayPal client ID is not configured');
      }
      
      this._paypalInstance = await initializePayPal(paypalClientId);
      return this._paypalInstance;
    } catch (error) {
      console.error('Failed to initialize PayPal:', error);
      throw error;
    }
  }

  /**
   * Render PayPal button and handle payment processing
   */
  async renderAndProcessPayment(
    amount: number,
    packageDetails: Package,
    customerInfo: CustomerInfo,
    container: HTMLElement,
    onSuccess: (orderId: string) => void,
    onError: (errorMessage: string) => void
  ): Promise<boolean> {
    try {
      // Clear existing button
      container.innerHTML = '';
      
      const paypal = await this.getPayPalInstance();
      
      if (!paypal) {
        throw new Error('Failed to initialize PayPal');
      }
      
      paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'pay',
        },
        
        createOrder: async (_data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                description: packageDetails.title,
                amount: {
                  currency_code: 'USD',
                  value: amount.toFixed(2),
                },
              },
            ],
          });
        },
        
        onApprove: async (data: any, actions: any) => {
          try {
            // Capture the order
            const order = await actions.order.capture();
            
            // Save order details
            const orderDetails: PayPalOrderDetails = {
              packageId: packageDetails.id,
              total_amount: amount,
              contact_info: customerInfo,
              company_info: {
                name: customerInfo.company,
                website: customerInfo.website || '',
              },
              payment_id: order.id,
            };
            
            const result = await this.saveOrder(orderDetails);
            onSuccess(result.id || 'order-processed');
          } catch (err) {
            console.error('Error processing PayPal payment:', err);
            onError('Payment succeeded but we encountered an error processing your order. Please contact support.');
          }
        },
        
        onError: (err: any) => {
          console.error('PayPal error:', err);
          onError('An error occurred with PayPal. Please try again or use a different payment method.');
        },
      }).render(container);
      
      return true;
    } catch (err) {
      console.error('Error loading PayPal:', err);
      onError('Failed to load PayPal checkout. Please try again later.');
      return false;
    }
  }

  /**
   * Save order details
   */
  private async saveOrder(orderDetails: PayPalOrderDetails): Promise<any> {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/save-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...orderDetails,
          paymentMethod: 'paypal'
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save order');
      }
      
      return data;
    } catch (error) {
      console.error('Error saving order:', error);
      throw error;
    }
  }
}
