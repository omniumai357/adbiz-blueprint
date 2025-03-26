
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
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import { Path } from "react-hook-form";
import { QuestionnaireFormValues } from "@/hooks/useQuestionnaireForm";

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface FormRadioGroupFieldProps {
  name: Path<QuestionnaireFormValues>;
  label: string;
  options: RadioOption[];
  description?: string;
  required?: boolean;
  className?: string;
  orientation?: "horizontal" | "vertical";
}

/**
 * Reusable radio group field component that integrates with the questionnaire form context
 */
export const FormRadioGroupField: React.FC<FormRadioGroupFieldProps> = ({
  name,
  label,
  options,
  description,
  required = false,
  className,
  orientation = "vertical"
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
          
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value as string}
              value={field.value as string}
              className={orientation === "horizontal" ? "flex flex-row space-x-4" : "space-y-3"}
            >
              {options.map((option) => (
                <div key={option.value} className="flex items-start space-x-2">
                  <RadioGroupItem value={option.value} id={`${name}-${option.value}`} />
                  <div className="grid gap-1">
                    <label
                      htmlFor={`${name}-${option.value}`}
                      className="font-medium leading-none cursor-pointer"
                    >
                      {option.label}
                    </label>
                    {option.description && (
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormRadioGroupField;
