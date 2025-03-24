
import React from "react";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { CustomerInfo } from "./customer-info-form";

interface InvoiceDeliveryOptionsProps {
  form: UseFormReturn<CustomerInfo>;
}

const InvoiceDeliveryOptions = ({ form }: InvoiceDeliveryOptionsProps) => {
  return (
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
  );
};

export default InvoiceDeliveryOptions;
