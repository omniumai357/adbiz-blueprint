
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Path } from "react-hook-form";
import { QuestionnaireFormValues } from "@/hooks/useQuestionnaireForm";

export interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectFieldProps {
  name: Path<QuestionnaireFormValues>;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  description?: string;
  required?: boolean;
  className?: string;
}

/**
 * Reusable select field component that integrates with the questionnaire form context
 */
export const FormSelectField: React.FC<FormSelectFieldProps> = ({
  name,
  label,
  options,
  placeholder = "Select an option",
  description,
  required = false,
  className
}) => {
  const { form } = useQuestionnaireContext();
  
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>
            {label} {required && <span className="text-destructive">*</span>}
          </FormLabel>
          
          {description && <FormDescription>{description}</FormDescription>}
          
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value as string}
            value={field.value as string}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            
            <SelectContent>
              {options.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormSelectField;
