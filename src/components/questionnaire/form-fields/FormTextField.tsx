
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
import { Input } from "@/components/ui/input";

interface FormTextFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
  className?: string;
  showCharCount?: boolean;
}

/**
 * Reusable text field component that integrates with the questionnaire form context
 */
export const FormTextField: React.FC<FormTextFieldProps> = ({
  name,
  label,
  placeholder,
  description,
  required = false,
  autoFocus = false,
  maxLength,
  className,
  showCharCount = false
}) => {
  const { form } = useQuestionnaireContext();
  const fieldValue = form.watch(name) || "";
  
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
            <Input
              {...field}
              placeholder={placeholder}
              autoFocus={autoFocus}
              maxLength={maxLength}
              className={`w-full ${field.value ? "border-primary" : ""}`}
            />
          </FormControl>
          
          {showCharCount && maxLength && (
            <div className="text-xs text-muted-foreground text-right">
              {fieldValue.length} / {maxLength}
            </div>
          )}
          
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormTextField;
