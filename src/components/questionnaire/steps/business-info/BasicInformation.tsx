
import { FC } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

interface BasicInformationProps {
  form: UseFormReturn<any>;
}

const BasicInformation: FC<BasicInformationProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="businessName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Name *</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Your business name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="industry"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Industry/Sector *</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Industry" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="cleaning">Cleaning Services</SelectItem>
                <SelectItem value="plumbing">Plumbing</SelectItem>
                <SelectItem value="electrical">Electrical</SelectItem>
                <SelectItem value="painting">Painting</SelectItem>
                <SelectItem value="landscaping">Landscaping</SelectItem>
                <SelectItem value="flooring">Flooring</SelectItem>
                <SelectItem value="construction">Construction</SelectItem>
                <SelectItem value="homeRepair">Home Repair</SelectItem>
                <SelectItem value="other">Other (specify below)</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {form.watch("industry") === "other" && (
        <FormField
          control={form.control}
          name="otherIndustry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Please specify your industry</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Your specific industry" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
};

export default BasicInformation;
