
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  invoiceDeliveryMethod?: 'email' | 'sms' | 'both';
}

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  website: z.string().optional(),
  invoiceDeliveryMethod: z.enum(['email', 'sms', 'both']).default('email')
}).refine(data => {
  // If invoiceDeliveryMethod is 'sms' or 'both', phone is required
  return !((['sms', 'both'].includes(data.invoiceDeliveryMethod)) && !data.phone);
}, {
  message: "Phone number is required for SMS delivery",
  path: ["phone"],
});

interface CustomerInfoFormProps {
  customerInfo: CustomerInfo;
  onChange: (data: CustomerInfo) => void;
  isLoading?: boolean;
}

const CustomerInfoForm = ({ customerInfo, onChange, isLoading = false }: CustomerInfoFormProps) => {
  const form = useForm<CustomerInfo>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: customerInfo.firstName || "",
      lastName: customerInfo.lastName || "",
      email: customerInfo.email || "",
      phone: customerInfo.phone || "",
      company: customerInfo.company || "",
      website: customerInfo.website || "",
      invoiceDeliveryMethod: customerInfo.invoiceDeliveryMethod || "email"
    },
  });

  const onSubmit = (values: CustomerInfo) => {
    onChange(values);
  };

  // Update parent component whenever form values change
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      onChange(value as CustomerInfo);
    });
    return () => subscription.unsubscribe();
  }, [form, onChange]);

  // Get the current delivery method to conditionally show content
  const deliveryMethod = form.watch("invoiceDeliveryMethod");
  const phoneRequired = deliveryMethod === 'sms' || deliveryMethod === 'both';

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <p>Loading your information...</p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Phone Number
                    {phoneRequired && <span className="ml-1 text-red-500">*</span>}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="tel" 
                      placeholder="+1 (555) 123-4567" 
                      {...field} 
                      className={phoneRequired ? "border-primary" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="www.example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator className="my-4" />

            <div>
              <h3 className="text-md font-medium mb-3">Invoice Delivery Preferences</h3>
              <FormField
                control={form.control}
                name="invoiceDeliveryMethod"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                        className="flex flex-col space-y-3"
                      >
                        <div className="flex items-start space-x-3 rounded-md border p-3 hover:bg-gray-50">
                          <RadioGroupItem value="email" id="email" />
                          <div className="flex-1">
                            <label htmlFor="email" className="font-medium text-sm cursor-pointer">Email Only</label>
                            <p className="text-xs text-gray-500">
                              Receive your invoice at the email address provided above
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3 rounded-md border p-3 hover:bg-gray-50">
                          <RadioGroupItem value="sms" id="sms" />
                          <div className="flex-1">
                            <label htmlFor="sms" className="font-medium text-sm cursor-pointer">SMS Only</label>
                            <p className="text-xs text-gray-500">
                              Receive your invoice as a text message (requires phone number)
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3 rounded-md border p-3 hover:bg-gray-50">
                          <RadioGroupItem value="both" id="both" />
                          <div className="flex-1">
                            <label htmlFor="both" className="font-medium text-sm cursor-pointer">Both Email and SMS</label>
                            <p className="text-xs text-gray-500">
                              Receive your invoice through both channels for your convenience (requires phone number)
                            </p>
                          </div>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      )}
    </Card>
  );
};

export default CustomerInfoForm;
