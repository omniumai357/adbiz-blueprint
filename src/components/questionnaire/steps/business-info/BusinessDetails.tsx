
import { FC } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface BusinessDetailsProps {
  form: UseFormReturn<any>;
}

const BusinessDetails: FC<BusinessDetailsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="yearsInBusiness"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Years in Business</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Option" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="new">Just starting (less than 1 year)</SelectItem>
                <SelectItem value="1-3">1-3 years</SelectItem>
                <SelectItem value="4-7">4-7 years</SelectItem>
                <SelectItem value="8-15">8-15 years</SelectItem>
                <SelectItem value="15+">15+ years</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="businessSize"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Size</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Option" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="solo">Solo (just myself)</SelectItem>
                <SelectItem value="small">Small (2-5 employees)</SelectItem>
                <SelectItem value="medium">Medium (6-15 employees)</SelectItem>
                <SelectItem value="large">Large (16+ employees)</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="md:col-span-2">
        <FormField
          control={form.control}
          name="serviceArea"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Area/Location *</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="E.g., San Francisco Bay Area, Greater Chicago, etc."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default BusinessDetails;
