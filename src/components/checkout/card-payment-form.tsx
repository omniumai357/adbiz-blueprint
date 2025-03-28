
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/ui/use-toast";
import { CustomerInfo } from "@/types/checkout";

interface CardPaymentFormProps {
  amount: number;
  packageName: string;
  customerInfo: Partial<CustomerInfo>; // Changed from CustomerInfo to Partial<CustomerInfo>
  onSuccess: (orderId: string) => void;
}

/**
 * CardPaymentForm Component
 * 
 * This component provides a form for credit card payment details
 * and handles the payment processing logic.
 * 
 * @param props CardPaymentFormProps containing amount, package name, and callbacks
 */
const CardPaymentForm = ({
  amount,
  packageName,
  customerInfo,
  onSuccess
}: CardPaymentFormProps) => {
  // Form state
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { toast } = useToast();
  
  // Validate form
  const isFormValid = () => {
    // Basic validation
    if (!cardNumber || !expiryDate || !cvv || !nameOnCard) {
      toast({
        title: "Missing information",
        description: "Please fill out all card details",
        variant: "destructive",
      });
      return false;
    }
    
    // Check if we have required customer info
    if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email) {
      toast({
        title: "Missing customer information",
        description: "Please provide your name and email address",
        variant: "destructive",
      });
      return false;
    }
    
    // Additional validations could be added here
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // In a real implementation, this would connect to a payment processor
      // Simulating API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate fake order ID
      const orderId = `order-${Date.now()}`;
      
      toast({
        title: "Payment successful",
        description: `Your payment for ${packageName} has been processed.`,
      });
      
      onSuccess(orderId);
    } catch (error) {
      console.error("Payment processing error:", error);
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Card Number
        </label>
        <Input
          id="cardNumber"
          type="text"
          placeholder="4242 4242 4242 4242"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          className="w-full"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Date
          </label>
          <Input
            id="expiryDate"
            type="text"
            placeholder="MM/YY"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
            CVV
          </label>
          <Input
            id="cvv"
            type="text"
            placeholder="123"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            className="w-full"
            required
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700 mb-1">
          Name on Card
        </label>
        <Input
          id="nameOnCard"
          type="text"
          placeholder="John Doe"
          value={nameOnCard}
          onChange={(e) => setNameOnCard(e.target.value)}
          className="w-full"
          required
        />
      </div>
      
      <div className="pt-2">
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : `Pay $${amount.toFixed(2)}`}
        </Button>
      </div>
    </form>
  );
};

export default CardPaymentForm;
