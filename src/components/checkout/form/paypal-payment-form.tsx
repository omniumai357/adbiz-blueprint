
import React, { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/ui/use-toast';
import { Card, CardContent } from "@/components/ui/card";
import { CustomerInfo, PackageDetails } from "@/types/checkout";
import OrderReviewConfirmation from "./order-review-confirmation";
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { paymentService } from '@/services/payment/payment-service';

interface PayPalPaymentFormProps {
  amount: number;
  packageDetails: PackageDetails;
  customerInfo: Partial<CustomerInfo>;
  onSuccess: (orderId: string) => void;
  packageName?: string;
}

/**
 * Enhanced PayPal Payment Form Component
 * 
 * Provides a user-friendly PayPal payment form with order review before submission
 */
const PayPalPaymentForm: React.FC<PayPalPaymentFormProps> = ({ 
  amount, 
  packageDetails,
  customerInfo,
  onSuccess,
  packageName = "Selected Package"
}) => {
  const paypalBtnRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(true); // Start with confirmation screen
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if all customer information is provided
  const isCustomerInfoComplete = () => {
    return !!(
      customerInfo.firstName && 
      customerInfo.lastName && 
      customerInfo.email && 
      (customerInfo.invoiceDeliveryMethod !== "sms" && 
       customerInfo.invoiceDeliveryMethod !== "both" || 
       customerInfo.phone)
    );
  };

  // Return to payment form
  const handleEdit = () => {
    setShowConfirmation(false);
  };
  
  // Proceed with payment
  const handleProceedToPayment = () => {
    if (!isCustomerInfoComplete()) {
      toast({
        title: "Missing customer information",
        description: "Please complete your personal information first",
        variant: "destructive",
      });
      return;
    }
    setShowConfirmation(false);
  };

  // Initialize PayPal button when ready
  useEffect(() => {
    if (showConfirmation || !paypalBtnRef.current) {
      return;
    }
    
    const loadPayPalButton = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await paymentService.processPayPalPayment(
          amount,
          packageDetails as any,
          customerInfo as CustomerInfo,
          paypalBtnRef.current,
          (orderId) => {
            // Handle success
            toast({
              title: "Payment successful!",
              description: `You've purchased the ${packageDetails.title} package.`,
            });
            
            // Call onSuccess callback
            onSuccess(orderId);
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
  }, [amount, packageDetails, customerInfo, onSuccess, showConfirmation]);
  
  // If showing confirmation, render the confirmation component
  if (showConfirmation) {
    return (
      <OrderReviewConfirmation
        customerInfo={customerInfo}
        amount={amount}
        packageName={packageName}
        onConfirm={handleProceedToPayment}
        onEdit={handleEdit}
      />
    );
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => setShowConfirmation(true)}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Review
        </Button>
        
        {loading && <div className="text-center py-4">Loading PayPal...</div>}
        
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-md">
            {error}
          </div>
        )}
        
        <div ref={paypalBtnRef} className="min-h-14" />
      </CardContent>
    </Card>
  );
};

export default PayPalPaymentForm;
