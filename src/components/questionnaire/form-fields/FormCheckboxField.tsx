
import React from "react";
import { useQuestionnaireContext } from "@/contexts/questionnaire-context";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

interface FormCheckboxFieldProps {
  name: string;
  label: string;
  description?: string;
  className?: string;
}

/**
 * Reusable checkbox field component that integrates with the questionnaire form context
 */
export const FormCheckboxField: React.FC<FormCheckboxFieldProps> = ({
  name,
  label,
  description,
  className
}) => {
  const { form } = useQuestionnaireContext();
  
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={`flex flex-row items-start space-x-3 space-y-0 ${className}`}>
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          
          <div className="space-y-1 leading-none">
            <FormLabel className="cursor-pointer">{label}</FormLabel>
            {description && (
              <FormDescription>{description}</FormDescription>
            )}
          </div>
          
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormCheckboxField;
