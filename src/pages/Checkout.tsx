
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise, createPaymentIntent } from "@/lib/stripe";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CreditCard, Wallet } from "lucide-react";
import PayPalButton from "@/components/PayPalButton";
import { supabase } from "@/integrations/supabase/client";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    website: "",
  });
  
  // In a real implementation, get these from state or query params
  const packageName = location.state?.packageName || "Standard Package";
  const packagePrice = location.state?.packagePrice || 199;
  const packageDetails = location.state?.packageDetails || { 
    id: "default-package", 
    title: packageName,
    price: packagePrice,
    description: "Standard package with basic features",
    features: ["Feature 1", "Feature 2", "Feature 3"]
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
          
          <div className="mb-8 p-4 bg-gray-50 rounded-md">
            <h3 className="text-lg font-medium mb-4">Order Summary</h3>
            <div className="flex justify-between">
              <span>{packageName}</span>
              <span>${packagePrice.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="space-y-8">
            {/* Customer Information Form */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Customer Information</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    name="firstName" 
                    value={customerInfo.firstName} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    name="lastName" 
                    value={customerInfo.lastName} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={customerInfo.email} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  value={customerInfo.phone} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input 
                  id="company" 
                  name="company" 
                  value={customerInfo.company} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Website (optional)</Label>
                <Input 
                  id="website" 
                  name="website" 
                  value={customerInfo.website} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
            
            {/* Payment Method Selector */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Payment Method</h2>
              
              <RadioGroup 
                value={paymentMethod} 
                onValueChange={setPaymentMethod}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer">
                  <RadioGroupItem value="credit-card" id="credit-card" />
                  <Label htmlFor="credit-card" className="flex items-center space-x-2 cursor-pointer">
                    <CreditCard className="h-5 w-5" />
                    <span>Credit Card</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="flex items-center space-x-2 cursor-pointer">
                    <Wallet className="h-5 w-5" />
                    <span>PayPal</span>
                  </Label>
                </div>
              </RadioGroup>
              
              {/* Render appropriate payment form based on selection */}
              {paymentMethod === "credit-card" ? (
                <Elements stripe={stripePromise}>
                  <CardForm />
                </Elements>
              ) : (
                <PayPalButton 
                  amount={packagePrice} 
                  packageDetails={packageDetails}
                  customerInfo={customerInfo}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
