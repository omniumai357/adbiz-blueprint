
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CustomerInfo } from "@/types/checkout";
import { Info } from "lucide-react";

interface CustomerBusinessInfoProps {
  form: UseFormReturn<CustomerInfo>;
}

const CustomerBusinessInfo = ({ form }: CustomerBusinessInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="company"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company (Optional)</FormLabel>
            <FormControl>
              <Input 
                placeholder="Acme Inc." 
                {...field} 
                className={form.formState.errors.company ? "border-red-500" : ""}
              />
            </FormControl>
            <FormDescription className="text-xs">
              Leave blank if not applicable
            </FormDescription>
            <FormMessage className="font-medium" />
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
              <Input 
                placeholder="https://example.com" 
                {...field} 
                className={form.formState.errors.website ? "border-red-500" : ""}
              />
            </FormControl>
            <FormDescription className="text-xs flex items-center">
              <Info className="h-3 w-3 mr-1" />
              Include https:// for valid URLs
            </FormDescription>
            <FormMessage className="font-medium" />
          </FormItem>
        )}
      />
    </div>
  );
};

export default CustomerBusinessInfo;
