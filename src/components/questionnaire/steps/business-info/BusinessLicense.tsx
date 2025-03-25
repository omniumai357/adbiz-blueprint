
import { FC } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface BusinessLicenseProps {
  form: UseFormReturn<any>;
}

const BusinessLicense: FC<BusinessLicenseProps> = ({ form }) => {
  const hasBusinessLicense = form.watch("hasBusinessLicense");
  
  return (
    <>
      <FormField
        control={form.control}
        name="hasBusinessLicense"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Do you have a business license?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-row space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="license-yes" />
                  <label htmlFor="license-yes">Yes</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="license-no" />
                  <label htmlFor="license-no">No</label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {hasBusinessLicense === "yes" && (
        <FormField
          control={form.control}
          name="businessLicenseNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business License Number</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Your license number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
};

export default BusinessLicense;
