
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
import { Textarea } from "@/components/ui/textarea";

interface FormTextAreaFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  rows?: number;
  maxLength?: number;
  className?: string;
  showCharCount?: boolean;
}

/**
 * Reusable textarea field component that integrates with the questionnaire form context
 */
export const FormTextAreaField: React.FC<FormTextAreaFieldProps> = ({
  name,
  label,
  placeholder,
  description,
  required = false,
  rows = 4,
  maxLength,
  className,
  showCharCount = true
}) => {
  const { form } = useQuestionnaireContext();
  const fieldValue = form.watch(name) || "";
  
  const charCount = fieldValue.length;
  const charCountColor = maxLength && maxLength - charCount < 20 
    ? "text-amber-500" 
    : maxLength && maxLength - charCount < 10 
      ? "text-red-500" 
      : "text-muted-foreground";
  
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
          
          <FormControl>
            <Textarea
              {...field}
              placeholder={placeholder}
              rows={rows}
              maxLength={maxLength}
              className={`w-full resize-y ${field.value ? "border-primary" : ""}`}
            />
          </FormControl>
          
          {showCharCount && (
            <div className={`text-xs ${charCountColor} text-right`}>
              {charCount} {maxLength ? `/ ${maxLength}` : ''} characters
            </div>
          )}
          
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormTextAreaField;
