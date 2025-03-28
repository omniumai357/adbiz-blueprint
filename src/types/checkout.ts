
import { ReactNode } from "react";

// Customer Information Types
export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  invoiceDeliveryMethod: "email" | "sms" | "both";
  userId?: string;
}

export interface CustomerInfoFormProps {
  customerInfo: Partial<CustomerInfo>;
  onChange: (values: Partial<CustomerInfo>) => void;
  isLoading?: boolean;
}

export interface CustomerBusinessInfoProps {
  form: any; // Replace with the actual form type when available
}

export interface CustomerPersonalInfoProps {
  form: any; // Replace with the actual form type when available
  phoneRequired: boolean;
}

export interface InvoiceDeliveryOptionsProps {
  form: any; // Replace with the actual form type when available
}

// Payment Related Types
export type PaymentMethod = "credit-card" | "paypal";

export interface PaymentOptionProps {
  id: string;
  value: string; 
  label: string;
  icon: ReactNode;
  isSelected: boolean;
}

// Checkout State Types
export interface CheckoutState {
  customerInfo: CustomerInfo;
  paymentMethod: PaymentMethod;
  showDownloadOptions: boolean;
  orderId: string | null;
  invoiceNumber: string | null;
  isGeneratingInvoice: boolean;
  userId: string | null;
  selectedAddOnIds: string[];
}

// Package Details Types
export interface PackageDetails {
  id: string;
  title: string;
  price: number;
  description: string;
  features: string[];
}

// Add-On Types
export interface AddOnItem {
  id: string;
  name: string;
  description: string;
  price: number;
}

// Discount Types
export interface BundleDiscountInfo {
  title: string;
  description: string;
  percentage: number;
}
