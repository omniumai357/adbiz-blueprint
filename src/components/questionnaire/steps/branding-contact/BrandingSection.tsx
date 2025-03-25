
import { FC } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface BrandingSectionProps {
  form: UseFormReturn<any>;
}

const BrandingSection: FC<BrandingSectionProps> = ({ form }) => {
  return (
    <>
      <div className="md:col-span-2">
        <FormField
          control={form.control}
          name="slogan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slogan or Tagline</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="E.g., 'We clean so you don't have to'"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="md:col-span-2">
        <FormField
          control={form.control}
          name="missionStatement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mission Statement</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="What is your business mission or purpose?"
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

export default BrandingSection;
