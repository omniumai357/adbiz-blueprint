
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/ui/use-toast';
import { Package } from '@/lib/data';
import { CustomerInfo } from '@/types/checkout';
import { paymentService } from '@/services/payment/payment-service';

interface PayPalButtonProps {
  amount: number;
  packageDetails: Package;
  customerInfo: CustomerInfo;
  onSuccess?: (orderId: string) => void;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ 
  amount, 
  packageDetails,
  customerInfo,
  onSuccess
}) => {
  const paypalBtnRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPayPalButton = async () => {
      setLoading(true);
      setError(null);
      
      if (!paypalBtnRef.current) {
        setLoading(false);
        return;
      }
      
      try {
        await paymentService.processPayPalPayment(
          amount,
          packageDetails,
          customerInfo,
          paypalBtnRef.current,
          (orderId) => {
            // Handle success
            toast({
              title: "Payment successful!",
              description: `You've purchased the ${packageDetails.title} package.`,
            });
            
            // Call onSuccess callback if provided
            if (onSuccess) {
              onSuccess(orderId);
            } else {
              // Fallback to redirecting if no callback
              navigate("/");
            }
          },
          (errorMessage: string) => {
            // Handle error
            setError(errorMessage);
          }
        );
      } catch (err) {
        setError('Failed to initialize PayPal checkout.');
      } finally {
        setLoading(false);
      }
    };
    
    loadPayPalButton();
  }, [amount, packageDetails, customerInfo, navigate, toast, onSuccess]);
  
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
