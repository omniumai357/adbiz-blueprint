
import { FC } from "react";
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useQuestionnaireContext } from "@/contexts/questionnaire-context";

const AudienceSection: FC = () => {
  const { form } = useQuestionnaireContext();
  
  return (
    <div className="grid grid-cols-1 gap-6">
      <FormField
        control={form.control}
        name="targetAudience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Target Audience</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Describe your ideal customers (age range, demographics, needs, etc.)"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="uniqueSellingPoints"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Unique Selling Points</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="What makes your business different from competitors?"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="competitorNotes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Competitor Information</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="List your main competitors and what you know about their marketing"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AudienceSection;
