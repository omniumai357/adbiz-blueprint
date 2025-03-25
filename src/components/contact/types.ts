
import { ReactNode } from "react";

export interface ContactMethod {
  id: string;
  icon: ReactNode;
  label: string;
  prompt: string;
  action: string;
  href: string;
  priority: number;
}

export type ContactFormData = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  preferredContact?: string;
  company?: string;
  serviceInterest?: string[];
};

export type FAQ = {
  question: string;
  answer: string;
};
