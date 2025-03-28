
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  required?: boolean;
}

/**
 * InputField Component
 * 
 * A responsive form input with label and error handling.
 * Optimized for both desktop and mobile viewports.
 */
const InputField = ({
  label,
  error,
  containerClassName,
  labelClassName,
  required = false,
  id,
  className,
  ...props
}: InputFieldProps) => {
  return (
    <div className={cn("space-y-2 w-full", containerClassName)}>
      <div className="flex justify-between items-center">
        <Label 
          htmlFor={id} 
          className={cn("text-sm font-medium leading-none", labelClassName)}
        >
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
        {error && (
          <span className="text-xs text-destructive">{error}</span>
        )}
      </div>
      <Input
        id={id}
        className={cn(
          "w-full py-2",
          error && "border-destructive focus-visible:ring-destructive",
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <span 
          id={`${id}-error`} 
          className="sr-only"
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default InputField;
