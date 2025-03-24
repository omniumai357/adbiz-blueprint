
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Package, packages } from "@/lib/data";
import { CheckCircle, AlertCircle } from "lucide-react";

export const Checkout = () => {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const location = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    // Get package ID from URL query parameters
    const searchParams = new URLSearchParams(location.search);
    const packageId = searchParams.get("package");
    
    if (packageId) {
      const pkg = packages.find((p) => p.id === packageId);
      if (pkg) {
        setSelectedPackage(pkg);
      }
    }
  }, [location.search]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPackage) {
      toast({
        title: "No package selected",
        description: "Please select a package to continue.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      toast({
        title: "Payment successful!",
        description: `Thank you for purchasing the ${selectedPackage.title} package.`,
      });
    }, 1500);
  };
  
  if (success) {
    return (
      <div className="max-w-md mx-auto p-6 bg-card border border-border rounded-lg shadow-sm animate-fade-in">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
          <p className="text-muted-foreground">Thank you for your purchase.</p>
        </div>
        
        <div className="border border-border rounded-lg p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Package:</span>
            <span className="font-medium">{selectedPackage?.title}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Amount paid:</span>
            <span className="font-medium">${selectedPackage?.price}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order ID:</span>
            <span className="font-medium">ORD-{Math.floor(Math.random() * 1000000)}</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-6">
          We've sent a confirmation email with all the details. Our team will contact you shortly to get started.
        </p>
        
        <Button asChild className="w-full">
          <a href="/">Return to Home</a>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Checkout form */}
        <div className="md:col-span-3">
          <div className="bg-card border border-border rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6">Checkout</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Contact information */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input id="first-name" placeholder="Enter first name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input id="last-name" placeholder="Enter last name" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="you@example.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="(123) 456-7890" required />
                    </div>
                  </div>
                </div>
                
                {/* Company information */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Company Information</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Input id="company" placeholder="Enter company name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website (Optional)</Label>
                      <Input id="website" placeholder="https://example.com" />
                    </div>
                  </div>
                </div>
                
                {/* Payment method */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={setPaymentMethod}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <Label htmlFor="credit-card" className="flex-1 cursor-pointer">
                        Credit Card
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                        PayPal
                      </Label>
                    </div>
                  </RadioGroup>
                  
                  {paymentMethod === "credit-card" && (
                    <div className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input id="card-number" placeholder="1234 5678 9012 3456" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input id="cvc" placeholder="123" required />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <Button type="submit" className="w-full" disabled={loading || !selectedPackage}>
                  {loading ? 'Processing...' : `Pay $${selectedPackage?.price || ''}`}
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Order summary */}
        <div className="md:col-span-2">
          <div className="bg-card border border-border rounded-lg shadow-sm p-6 sticky top-24">
            <h3 className="text-lg font-medium mb-4">Order Summary</h3>
            
            {selectedPackage ? (
              <div>
                <div className="border-b border-border pb-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{selectedPackage.title} Package</span>
                    <span>${selectedPackage.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedPackage.description}</p>
                </div>
                
                <div className="space-y-1 mb-4">
                  {selectedPackage.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                  {selectedPackage.features.length > 3 && (
                    <div className="text-sm text-muted-foreground">
                      + {selectedPackage.features.length - 3} more features
                    </div>
                  )}
                </div>
                
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>${selectedPackage.price}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6">
                <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground text-center">
                  No package selected. Please go back to the services page to select a package.
                </p>
                <Button 
                  asChild 
                  variant="outline" 
                  className="mt-4"
                >
                  <a href="/services">View Packages</a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
