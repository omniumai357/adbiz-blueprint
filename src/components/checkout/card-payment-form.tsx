import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { CustomerInfo } from "./customer-info-form";

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
      // Call the Supabase Edge Function to create payment intent
      const { data, error: funcError } = await supabase.functions.invoke('create-payment-intent', {
        body: { amount: packagePrice * 100, currency: 'usd' }
      });
      
      if (funcError) throw new Error(funcError.message);
      
      const { clientSecret } = data;
      
      const { error: paymentError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });
      
      if (paymentError) {
        throw new Error(paymentError.message);
      }

      // Save the order
      const { data: orderData, error: orderError } = await supabase.functions.invoke('save-order', {
        body: {
          packageId: packageDetails.id,
          total_amount: packagePrice,
          contact_info: customerInfo,
          company_info: {
            name: customerInfo.company,
            website: customerInfo.website || '',
          },
          payment_method: 'credit-card',
        }
      });
      
      if (orderError) throw new Error(orderError.message);
      
      onSuccess(orderData.id);
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
