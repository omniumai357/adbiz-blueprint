
import { Json } from "@/integrations/supabase/types";
import { CustomerInfo } from "@/components/checkout/customer-info-form";

export interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
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
}

export type InvoiceDeliveryMethod = 'email' | 'sms' | 'both';

export interface InvoiceDeliveryResult {
  email: any;
  sms: any;
  errors: Error[];
}
