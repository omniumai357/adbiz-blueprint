
import { FC } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useQuestionnaireContext } from "@/contexts/questionnaire-context";

const BusinessDescription: FC = () => {
  const { form } = useQuestionnaireContext();
  
  return (
    <div className="md:col-span-2">
      <FormField
        control={form.control}
        name="businessDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Description (what do you do?) *</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Describe your business and the services you provide..."
                className="min-h-24"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BusinessDescription;
