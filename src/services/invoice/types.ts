import { InvoiceDeliveryMethod } from "./types";
import { CustomerInfo } from "@/types/checkout";

export interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  details?: string;
  features?: string[];
  timeframe?: string;
}

export interface InvoiceData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  amount: number;
  items: InvoiceItem[];
  dueDate: string;
  invoiceNumber: string;
  userId?: string;
  deliveryMethod?: 'email' | 'sms' | 'both';
  templateType?: 'standard' | 'premium' | 'platinum';
  taxRate?: number;
  notes?: string;
}

export type InvoiceDeliveryMethod = 'email' | 'sms' | 'both';

export interface InvoiceDeliveryResult {
  email: any;
  sms: any;
  errors: Error[];
}

export interface InvoiceTemplate {
  name: string;
  displayName: string;
  description: string;
  forPackageTypes: string[];
}

// Available invoice templates
export const invoiceTemplates: InvoiceTemplate[] = [
  {
    name: 'standard',
    displayName: 'Standard Template',
    description: 'Basic template suitable for standard packages',
    forPackageTypes: ['basic', 'standard', 'tier1', 'tier2', 'monthly-basic', 'monthly-standard', 'custom-tier1', 'custom-tier2']
  },
  {
    name: 'premium',
    displayName: 'Premium Template',
    description: 'Enhanced template with VIP styling for premium customers',
    forPackageTypes: ['premium', 'tier3', 'monthly-premium', 'custom-tier3']
  },
  {
    name: 'platinum',
    displayName: 'Platinum Executive Template',
    description: 'Exclusive template for platinum customers with executive styling',
    forPackageTypes: ['platinum']
  }
];
