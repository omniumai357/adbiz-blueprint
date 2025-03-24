
// Type definitions for the contact components and forms

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ContactFormFieldsProps {
  formState: ContactFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export interface ContactSuccessMessageProps {
  onReset: () => void;
}
