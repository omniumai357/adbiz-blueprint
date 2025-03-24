
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CustomerInfo } from "./customer-info-form";
import { Info } from "lucide-react";

interface CustomerPersonalInfoProps {
  form: UseFormReturn<CustomerInfo>;
  phoneRequired: boolean;
}

const CustomerPersonalInfo = ({ form, phoneRequired }: CustomerPersonalInfoProps) => {
  return (
    <>
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
                  placeholder="John" 
                  {...field} 
                  className={form.formState.errors.firstName ? "border-red-500" : ""}
                />
              </FormControl>
              <FormMessage className="font-medium" />
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
                  placeholder="Doe" 
                  {...field} 
                  className={form.formState.errors.lastName ? "border-red-500" : ""}
                />
              </FormControl>
              <FormMessage className="font-medium" />
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
                type="email" 
                placeholder="john.doe@example.com" 
                {...field} 
                className={form.formState.errors.email ? "border-red-500" : ""}
              />
            </FormControl>
            <FormDescription className="text-xs flex items-center">
              <Info className="h-3 w-3 mr-1" /> 
              We'll send your invoice to this email address
            </FormDescription>
            <FormMessage className="font-medium" />
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
                className={form.formState.errors.phone ? "border-red-500" : ""}
              />
            </FormControl>
            <FormDescription className="text-xs flex items-center">
              <Info className="h-3 w-3 mr-1" />
              Required for SMS invoice delivery
            </FormDescription>
            <FormMessage className="font-medium" />
          </FormItem>
        )}
      />
    </>
  );
};

export default CustomerPersonalInfo;
