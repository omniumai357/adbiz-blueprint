
import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { CustomerInfo } from "./customer-info-form";
import { paymentService } from "@/services/payment/payment-service";

interface CardPaymentFormProps {
  packagePrice: number;
  packageDetails: any;
  customerInfo: CustomerInfo;
  onSuccess: (orderId: string) => void;
}

const CardPaymentForm = ({
  packagePrice,
  packageDetails,
  customerInfo,
  onSuccess,
}: CardPaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setProcessing(true);
    setError(null);
    
    try {
      // Create payment intent
      const clientSecret = await paymentService.createPaymentIntent(packagePrice, 'usd');
      
      // Process the payment
      const result = await paymentService.processCardPayment(
        clientSecret,
        elements.getElement(CardElement)!,
        packageDetails,
        customerInfo
      );
      
      if (!result.success) {
        throw new Error(result.error || 'Payment failed');
      }
      
      onSuccess(result.orderId || 'order-processed');
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.message || "An error occurred with your payment");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="card-element" className="block text-sm font-medium">
          Credit or debit card
        </label>
        <div className="p-3 border rounded-md">
          <CardElement id="card-element" />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
      
      <Button 
        type="submit" 
        disabled={!stripe || processing} 
        className="w-full"
      >
        {processing ? "Processing..." : `Pay $${packagePrice.toFixed(2)}`}
      </Button>
    </form>
  );
};

export default CardPaymentForm;
