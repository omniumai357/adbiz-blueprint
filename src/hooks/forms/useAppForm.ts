
import { useForm, UseFormProps, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

// Generic hook for form state management with React Hook Form and zod validation
export function useAppForm<TSchema extends z.ZodType>(
  schema: TSchema,
  options: Omit<UseFormProps<z.infer<TSchema>>, "resolver"> = {}
): UseFormReturn<z.infer<TSchema>> & {
  isSubmitting: boolean;
  submitError: string | null;
  setSubmitError: (error: string | null) => void;
} {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const form = useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema),
    ...options,
  });

  // Extend the original handleSubmit to manage loading state
  const originalHandleSubmit = form.handleSubmit;
  
  form.handleSubmit = ((onValid, onInvalid) => {
    return originalHandleSubmit(async (...args) => {
      setIsSubmitting(true);
      setSubmitError(null);
      try {
        await onValid(...args);
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : "An unexpected error occurred");
        console.error("Form submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    }, onInvalid);
  }) as typeof originalHandleSubmit;

  return {
    ...form,
    isSubmitting,
    submitError,
    setSubmitError,
  };
}
