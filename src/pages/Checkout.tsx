
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise, createPaymentIntent } from "@/lib/stripe";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // In a real implementation, get these from state or query params
  const packageName = location.state?.packageName || "Standard Package";
  const packagePrice = location.state?.packagePrice || 199;

  const CardForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!stripe || !elements) {
        return;
      }
      
      setProcessing(true);
      setError(null);
      
      try {
        // In real implementation, call the edge function
        // const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        //   body: { amount: packagePrice, currency: 'usd' }
        // });
        
        // if (error) throw error;
        
        // const { clientSecret } = data;
        
        // const { error: paymentError } = await stripe.confirmCardPayment(clientSecret, {
        //   payment_method: {
        //     card: elements.getElement(CardElement)!,
        //   },
        // });
        
        // if (paymentError) {
        //   throw new Error(paymentError.message);
        // }

        // For the demo, we'll simulate success
        toast({
          title: "Payment successful!",
          description: `You've purchased the ${packageName} package.`,
        });
        
        navigate("/");
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
        
        <div className="p-4 bg-gray-50 rounded-md">
          <h3 className="text-lg font-medium">Order Summary</h3>
          <div className="mt-2 flex justify-between">
            <span>{packageName}</span>
            <span>${packagePrice.toFixed(2)}</span>
          </div>
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container px-4 mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          
          <Elements stripe={stripePromise}>
            <CardForm />
          </Elements>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
