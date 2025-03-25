
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CustomerPersonalInfo from "./customer-personal-info";
import CustomerBusinessInfo from "./customer-business-info";
import InvoiceDeliveryOptions from "./invoice-delivery-options";
import CustomerInfoSkeleton from "./customer-info-skeleton";
import { CustomerInfo, CustomerInfoFormProps } from "@/types/checkout";

// Define the form schema
const customerSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  company: z.string().optional(),
  website: z.string().optional(),
  invoiceDeliveryMethod: z.enum(["email", "sms", "both"]).default("email"),
  userId: z.string().optional()
});

/**
 * CustomerInfoForm Component
 * 
 * Renders a form for collecting customer information during checkout.
 * 
 * @param props CustomerInfoFormProps containing current values and change handler
 */
const CustomerInfoForm = ({ customerInfo, onChange, isLoading = false }: CustomerInfoFormProps) => {
  const form = useForm<CustomerInfo>({
    resolver: zodResolver(customerSchema),
    defaultValues: customerInfo,
  });

  const invoiceDeliveryMethod = form.watch("invoiceDeliveryMethod");
  
  function onSubmit(values: CustomerInfo) {
    onChange(values);
  }

  // Update form values when customerInfo prop changes
  React.useEffect(() => {
    if (!isLoading) {
      Object.entries(customerInfo).forEach(([key, value]) => {
        if (value !== undefined && value !== form.getValues(key as keyof CustomerInfo)) {
          form.setValue(key as keyof CustomerInfo, value);
        }
      });
    }
  }, [customerInfo, form, isLoading]);

  if (isLoading) {
    return <CustomerInfoSkeleton />;
  }

  // Determine if phone is required based on delivery method
  const phoneRequired = invoiceDeliveryMethod === "sms" || invoiceDeliveryMethod === "both";

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Customer Information</h2>
      <Form {...form}>
        <form onChange={form.handleSubmit(onSubmit)} className="space-y-8">
          <CustomerPersonalInfo form={form} phoneRequired={phoneRequired} />
          <CustomerBusinessInfo form={form} />
          <InvoiceDeliveryOptions form={form} />
        </form>
      </Form>
    </div>
  );
};

export default CustomerInfoForm;
