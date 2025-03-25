
import { ReactNode } from "react";

// Contact Form Data Types
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  preferredContact?: string;
  serviceInterest?: string[];
}

// Contact Component Props Types
export interface ContactFormFieldsProps {
  formState: ContactFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export interface ContactSuccessMessageProps {
  onReset: () => void;
}

// FAQ Types
export interface FAQ {
  question: string;
  answer: string;
}

// Contact Methods Types
export interface ContactMethod {
  id: string;
  icon: ReactNode;
  label: string;
  prompt: string;
  action: string;
  href: string;
  priority: number;
}

export interface PrimaryContactMethodProps {
  method: ContactMethod;
  onInteraction?: (id: string) => void;
}

export interface SecondaryContactMethodsProps {
  methods: ContactMethod[];
  onInteraction?: (id: string) => void;
}
