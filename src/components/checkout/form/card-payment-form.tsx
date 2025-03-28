
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/ui/use-toast";
import { CustomerInfo } from "@/types/checkout";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cardPaymentSchema, CardPaymentFormValues } from "@/schemas/checkout-validation";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface CardPaymentFormProps {
  amount: number;
  customerInfo: Partial<CustomerInfo>;
  onSuccess: (orderId: string) => void;
}

/**
 * Enhanced Credit Card Payment Form Component
 * 
 * Provides a user-friendly credit card payment form with validation and formatting
 */
const CardPaymentForm: React.FC<CardPaymentFormProps> = ({
  amount,
  customerInfo,
  onSuccess
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with validation
  const form = useForm<CardPaymentFormValues>({
    resolver: zodResolver(cardPaymentSchema),
    defaultValues: {
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: ""
    },
    mode: "onChange" // Real-time validation
  });
  
  // Format card number with spaces every 4 digits
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };
  
  // Format expiry date as MM/YY
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };
  
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
  
  // Form submission handler
  const onSubmit = async (data: CardPaymentFormValues) => {
    if (!isCustomerInfoComplete()) {
      toast({
        title: "Missing customer information",
        description: "Please complete your personal information first",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate fake order ID
      const orderId = `order-${Date.now()}`;
      
      toast({
        title: "Payment successful",
        description: `Your payment of $${amount.toFixed(2)} has been processed successfully.`,
      });
      
      onSuccess(orderId);
    } catch (error) {
      console.error("Payment failed:", error);
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="cardName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name on Card</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        placeholder="John Doe"
                        className={cn(
                          form.formState.errors.cardName && "border-destructive focus-visible:ring-destructive",
                          form.formState.touchedFields.cardName && !form.formState.errors.cardName && "border-green-500 focus-visible:ring-green-500"
                        )}
                      />
                      {form.formState.touchedFields.cardName && !form.formState.errors.cardName && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                      )}
                      {form.formState.errors.cardName && (
                        <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="4242 4242 4242 4242"
                        value={field.value}
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value);
                          field.onChange(formatted);
                        }}
                        maxLength={19}
                        className={cn(
                          form.formState.errors.cardNumber && "border-destructive focus-visible:ring-destructive",
                          form.formState.touchedFields.cardNumber && !form.formState.errors.cardNumber && "border-green-500 focus-visible:ring-green-500"
                        )}
                      />
                      {form.formState.touchedFields.cardNumber && !form.formState.errors.cardNumber && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                      )}
                      {form.formState.errors.cardNumber && (
                        <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="MM/YY"
                          value={field.value}
                          onChange={(e) => {
                            const formatted = formatExpiryDate(e.target.value);
                            field.onChange(formatted);
                          }}
                          maxLength={5}
                          className={cn(
                            form.formState.errors.expiryDate && "border-destructive focus-visible:ring-destructive",
                            form.formState.touchedFields.expiryDate && !form.formState.errors.expiryDate && "border-green-500 focus-visible:ring-green-500"
                          )}
                        />
                        {form.formState.touchedFields.expiryDate && !form.formState.errors.expiryDate && (
                          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                        )}
                        {form.formState.errors.expiryDate && (
                          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVV</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="123"
                          value={field.value}
                          onChange={(e) => {
                            const formatted = e.target.value.replace(/\D/g, "");
                            field.onChange(formatted);
                          }}
                          maxLength={4}
                          className={cn(
                            form.formState.errors.cvv && "border-destructive focus-visible:ring-destructive",
                            form.formState.touchedFields.cvv && !form.formState.errors.cvv && "border-green-500 focus-visible:ring-green-500"
                          )}
                        />
                        {form.formState.touchedFields.cvv && !form.formState.errors.cvv && (
                          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                        )}
                        {form.formState.errors.cvv && (
                          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={!form.formState.isValid || isSubmitting}
            >
              {isSubmitting ? "Processing..." : `Pay $${amount.toFixed(2)}`}
            </Button>
            
            {!form.formState.isValid && form.formState.submitCount > 0 && (
              <p className="text-sm text-destructive text-center">
                Please correct the errors in the form to proceed with payment.
              </p>
            )}
            
            {!isCustomerInfoComplete() && (
              <p className="text-sm text-amber-600 text-center">
                Please complete your personal information before proceeding with payment.
              </p>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CardPaymentForm;
