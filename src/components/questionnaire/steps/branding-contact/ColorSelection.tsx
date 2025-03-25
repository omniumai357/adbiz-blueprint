
import { FC } from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface ColorSelectionProps {
  form: UseFormReturn<any>;
}

const ColorSelection: FC<ColorSelectionProps> = ({ form }) => {
  return (
    <div className="md:col-span-2">
      <FormLabel className="block mb-2">Brand Color Preferences</FormLabel>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="primaryColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-muted-foreground">Primary Color</FormLabel>
              <FormControl>
                <Input 
                  type="color" 
                  {...field} 
                  className="h-10 p-1 cursor-pointer"
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="secondaryColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-muted-foreground">Secondary Color</FormLabel>
              <FormControl>
                <Input 
                  type="color" 
                  {...field} 
                  className="h-10 p-1 cursor-pointer"
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="accentColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-muted-foreground">Accent Color</FormLabel>
              <FormControl>
                <Input 
                  type="color" 
                  {...field} 
                  className="h-10 p-1 cursor-pointer"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default ColorSelection;
