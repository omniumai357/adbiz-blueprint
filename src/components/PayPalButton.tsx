
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Package } from '@/lib/data';
import { renderPayPalButton } from '@/lib/paypal-utils';
import { CustomerInfo } from '@/components/checkout/CustomerInfoForm';

interface PayPalButtonProps {
  amount: number;
  packageDetails: Package;
  customerInfo: CustomerInfo;
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
      setLoading(true);
      setError(null);
      
      const success = await renderPayPalButton(
        amount,
        packageDetails,
        customerInfo,
        paypalBtnRef,
        () => {
          // Handle success
          toast({
            title: "Payment successful!",
            description: `You've purchased the ${packageDetails.title} package.`,
          });
          
          // Redirect to home page (or success page)
          navigate("/");
        },
        (errorMessage: string) => {
          // Handle error
          setError(errorMessage);
        }
      );
      
      setLoading(false);
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
