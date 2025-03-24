
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializePayPal, savePayPalOrder } from '@/lib/paypal';
import { useToast } from '@/hooks/use-toast';
import { Package } from '@/lib/data';

interface PayPalButtonProps {
  amount: number;
  packageDetails: Package;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
    website?: string;
  };
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ 
  amount, 
  packageDetails,
  customerInfo
}) => {
  const paypalBtnRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPayPalButton = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use the client ID from environment variable
        const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
        
        if (!paypalClientId) {
          setError('PayPal client ID is not configured');
          setLoading(false);
          return;
        }
        
        const paypal = await initializePayPal(paypalClientId);
        
        if (paypalBtnRef.current && paypal) {
          // Clear existing button
          paypalBtnRef.current.innerHTML = '';
          
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
              // Capture the order
              const order = await actions.order.capture();
              console.log('PayPal order captured:', order);
              
              // Save order details
              const orderDetails = {
                packageId: packageDetails.id,
                total_amount: amount,
                contact_info: customerInfo,
                company_info: {
                  name: customerInfo.company,
                  website: customerInfo.website || '',
                },
                payment_id: order.id,
              };
              
              try {
                const savedOrder = await savePayPalOrder(orderDetails);
                
                toast({
                  title: "Payment successful!",
                  description: `You've purchased the ${packageDetails.title} package.`,
                });
                
                // Redirect to home page (or success page)
                navigate("/");
              } catch (err) {
                console.error('Error saving order:', err);
                setError('Payment succeeded but we encountered an error processing your order. Please contact support.');
              }
            },
            
            onError: (err: any) => {
              console.error('PayPal error:', err);
              setError('An error occurred with PayPal. Please try again or use a different payment method.');
            },
          }).render(paypalBtnRef.current);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading PayPal:', err);
        setError('Failed to load PayPal checkout. Please try again later.');
        setLoading(false);
      }
    };
    
    loadPayPalButton();
  }, [amount, packageDetails, customerInfo, navigate, toast]);
  
  return (
    <div className="mt-6">
      {loading && <div className="text-center py-4">Loading PayPal...</div>}
      
      {error && (
        <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}
      
      <div ref={paypalBtnRef} />
    </div>
  );
};

export default PayPalButton;
