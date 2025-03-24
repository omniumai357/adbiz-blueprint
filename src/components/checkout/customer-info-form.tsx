import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { FormValidationMessage } from "@/components/ui/form-validation-message";
import CustomerPersonalInfo from "./customer-personal-info";
import CustomerBusinessInfo from "./customer-business-info";
import InvoiceDeliveryOptions from "./invoice-delivery-options";
import { isValidPhoneNumber, isValidEmail, isValidUrl } from "@/lib/utils/validation-utils";

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
  firstName: z.string()
    .min(1, "First name is required")
    .max(50, "First name cannot exceed 50 characters"),
  lastName: z.string()
    .min(1, "Last name is required")
    .max(50, "Last name cannot exceed 50 characters"),
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .refine(isValidEmail, "Please enter a valid email address"),
  phone: z.string()
    .optional()
    .refine(
      (val) => !val || isValidPhoneNumber(val),
      "Please enter a valid phone number (e.g., +1 555-123-4567)"
    ),
  company: z.string()
    .optional(),
  website: z.string()
    .optional()
    .refine(
      (val) => !val || isValidUrl(val),
      "Please enter a valid website URL (e.g., https://example.com)"
    ),
  invoiceDeliveryMethod: z.enum(['email', 'sms', 'both']).default('email')
}).refine((data) => {
  if (['sms', 'both'].includes(data.invoiceDeliveryMethod) && !data.phone) {
    return false;
  }
  return true;
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

  const { formState: { errors } } = form;
  const hasErrors = Object.keys(errors).length > 0;

  React.useEffect(() => {
    const subscription = form.watch((value) => {
      onChange(value as CustomerInfo);
    });
    return () => subscription.unsubscribe();
  }, [form, onChange]);

  const deliveryMethod = form.watch("invoiceDeliveryMethod");
  const phoneRequired = deliveryMethod === 'sms' || deliveryMethod === 'both';

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
      
      {hasErrors && (
        <FormValidationMessage 
          message="Please correct the errors below to continue" 
        />
      )}
      
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <p>Loading your information...</p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CustomerPersonalInfo form={form} phoneRequired={phoneRequired} />
            
            <CustomerBusinessInfo form={form} />
            
            <Separator className="my-6" />
            
            <InvoiceDeliveryOptions form={form} />
          </form>
        </Form>
      )}
    </Card>
  );
};

export default CustomerInfoForm;
