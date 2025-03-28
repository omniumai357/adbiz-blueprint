
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CustomerInfoFormProps } from "@/types/checkout";
import { customerInfoSchema, CustomerInfoFormValues } from "@/schemas/checkout-validation";
import { Info } from "lucide-react";

/**
 * CustomerInfoForm Component
 * 
 * A responsive form for collecting customer information during checkout
 * with built-in validation
 */
const CustomerInfoForm: React.FC<CustomerInfoFormProps> = ({
  customerInfo,
  onChange,
  isLoading
}) => {
  // Initialize the form with React Hook Form and Zod validation
  const form = useForm<CustomerInfoFormValues>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      firstName: customerInfo.firstName || "",
      lastName: customerInfo.lastName || "",
      email: customerInfo.email || "",
      phone: customerInfo.phone || "",
      company: customerInfo.company || "",
      invoiceDeliveryMethod: customerInfo.invoiceDeliveryMethod || "email"
    },
    mode: "onBlur" // Validate on blur for better UX
  });
  
  // Update parent component when form values change
  const handleFormChange = (values: Partial<CustomerInfoFormValues>) => {
    onChange({ ...customerInfo, ...values });
  };
  
  // Handle individual field changes
  const handleFieldChange = (field: keyof CustomerInfoFormValues, value: any) => {
    form.setValue(field, value);
    handleFormChange({ [field]: value });
  };
  
  // Get if phone is required based on delivery method
  const isPhoneRequired = 
    form.watch("invoiceDeliveryMethod") === "sms" || 
    form.watch("invoiceDeliveryMethod") === "both";
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">Customer Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onChange={form.handleSubmit(handleFormChange)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      First Name <span className="ml-1 text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        disabled={isLoading}
                        placeholder="Enter your first name"
                        className={form.formState.errors.firstName ? "border-destructive" : ""}
                        onChange={(e) => handleFieldChange("firstName", e.target.value)}
                      />
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
                    <FormLabel className="flex items-center">
                      Last Name <span className="ml-1 text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        disabled={isLoading}
                        placeholder="Enter your last name"
                        className={form.formState.errors.lastName ? "border-destructive" : ""}
                        onChange={(e) => handleFieldChange("lastName", e.target.value)}
                      />
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
                  <FormLabel className="flex items-center">
                    Email <span className="ml-1 text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="email"
                      disabled={isLoading}
                      placeholder="Enter your email address"
                      className={form.formState.errors.email ? "border-destructive" : ""}
                      onChange={(e) => handleFieldChange("email", e.target.value)}
                    />
                  </FormControl>
                  <FormDescription className="text-xs flex items-center">
                    <Info className="h-3 w-3 mr-1" /> 
                    We'll send your invoice to this email address
                  </FormDescription>
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
                    {isPhoneRequired && <span className="ml-1 text-red-500">*</span>}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="tel"
                      disabled={isLoading}
                      placeholder="+1 (555) 123-4567"
                      className={form.formState.errors.phone ? "border-destructive" : ""}
                      onChange={(e) => handleFieldChange("phone", e.target.value)}
                    />
                  </FormControl>
                  <FormDescription className="text-xs flex items-center">
                    <Info className="h-3 w-3 mr-1" />
                    Required for SMS invoice delivery
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      disabled={isLoading}
                      placeholder="Enter your company name (optional)"
                      onChange={(e) => handleFieldChange("company", e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="invoiceDeliveryMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Invoice Delivery Method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={(value) => {
                        handleFieldChange("invoiceDeliveryMethod", value as "email" | "sms" | "both");
                      }}
                      className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4"
                    >
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="email" id="delivery-email" />
                        <Label htmlFor="delivery-email" className="cursor-pointer">Email</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="sms" id="delivery-sms" />
                        <Label htmlFor="delivery-sms" className="cursor-pointer">SMS</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="both" id="delivery-both" />
                        <Label htmlFor="delivery-both" className="cursor-pointer">Both</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CustomerInfoForm;
