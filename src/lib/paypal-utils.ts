import { initializePayPal, savePayPalOrder } from '@/lib/paypal';
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

// Function to initialize PayPal SDK and render button
export const renderPayPalButton = async (
  amount: number,
  packageDetails: Package,
  customerInfo: CustomerInfo,
  containerRef: React.RefObject<HTMLDivElement>,
  onSuccess: () => void,
  onError: (errorMessage: string) => void
) => {
  try {
    // Use the client ID from environment variable
    const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
    
    if (!paypalClientId) {
      throw new Error('PayPal client ID is not configured');
    }
    
    const paypal = await initializePayPal(paypalClientId);
    
    if (containerRef.current && paypal) {
      // Clear existing button
      containerRef.current.innerHTML = '';
      
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
            console.log('PayPal order captured:', order);
            
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
            
            await savePayPalOrder(orderDetails);
            onSuccess();
          } catch (err) {
            console.error('Error processing PayPal payment:', err);
            onError('Payment succeeded but we encountered an error processing your order. Please contact support.');
          }
        },
        
        onError: (err: any) => {
          console.error('PayPal error:', err);
          onError('An error occurred with PayPal. Please try again or use a different payment method.');
        },
      }).render(containerRef.current);
      
      return true;
    }
    
    return false;
  } catch (err) {
    console.error('Error loading PayPal:', err);
    onError('Failed to load PayPal checkout. Please try again later.');
    return false;
  }
};
