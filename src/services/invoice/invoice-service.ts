
import { supabase } from "@/integrations/supabase/client";
import { CustomerInfo } from "@/components/checkout/customer-info-form";
import { formatDate } from "@/lib/utils/format-utils";
import { Json } from "@/integrations/supabase/types";

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

export const invoiceService = {
  /**
   * Creates a new invoice in the database
   */
  async createInvoice(data: InvoiceData) {
    try {
      // Convert the InvoiceItem[] to Json type expected by Supabase
      const itemsAsJson = data.items as unknown as Json;
      
      const { data: invoice, error } = await supabase
        .from('invoices')
        .insert({
          order_id: data.orderId,
          user_id: data.userId,
          customer_email: data.customerEmail,
          customer_name: data.customerName,
          customer_phone: data.customerPhone,
          amount: data.amount,
          invoice_number: data.invoiceNumber,
          due_date: data.dueDate,
          items: itemsAsJson,
          status: 'pending',
          delivery_method: data.deliveryMethod || 'email'
        })
        .select()
        .single();

      if (error) throw error;
      
      return { invoice, error: null };
    } catch (error) {
      console.error("Error creating invoice:", error);
      return { invoice: null, error };
    }
  },

  /**
   * Sends an invoice via email
   */
  async sendInvoice(invoiceId: string, email: string, name: string, invoiceData: Partial<InvoiceData>) {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-invoice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          invoiceId,
          email,
          name,
          ...invoiceData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send invoice');
      }

      return await response.json();
    } catch (error) {
      console.error("Error sending invoice via email:", error);
      throw error;
    }
  },

  /**
   * Sends an invoice via SMS
   */
  async sendInvoiceSMS(invoiceId: string, phoneNumber: string, invoiceNumber: string, customMessage?: string) {
    try {
      if (!phoneNumber) {
        throw new Error('Phone number is required for SMS delivery');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-sms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          invoiceId,
          phoneNumber,
          invoiceNumber,
          message: customMessage
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send invoice SMS');
      }

      return await response.json();
    } catch (error) {
      console.error("Error sending invoice via SMS:", error);
      throw error;
    }
  },

  /**
   * Delivers an invoice through selected channels (email, SMS, or both)
   */
  async deliverInvoice(invoice: any, deliveryMethod: 'email' | 'sms' | 'both', customerInfo: {
    email: string;
    name: string;
    phone?: string;
  }, invoiceData: Partial<InvoiceData>) {
    const results = {
      email: null as any,
      sms: null as any,
      errors: [] as Error[]
    };
    
    // Send via email if method is 'email' or 'both'
    if (deliveryMethod === 'email' || deliveryMethod === 'both') {
      try {
        results.email = await this.sendInvoice(
          invoice.id,
          customerInfo.email,
          customerInfo.name,
          invoiceData
        );
      } catch (error) {
        console.error("Failed to deliver invoice via email:", error);
        results.errors.push(error as Error);
      }
    }
    
    // Send via SMS if method is 'sms' or 'both'
    if ((deliveryMethod === 'sms' || deliveryMethod === 'both') && customerInfo.phone) {
      try {
        results.sms = await this.sendInvoiceSMS(
          invoice.id,
          customerInfo.phone,
          invoice.invoice_number
        );
      } catch (error) {
        console.error("Failed to deliver invoice via SMS:", error);
        results.errors.push(error as Error);
      }
    }
    
    return results;
  },

  /**
   * Generates a unique invoice number
   */
  generateInvoiceNumber() {
    const prefix = 'INV';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
  },

  /**
   * Creates an invoice from order and customer information
   */
  async createInvoiceFromOrder(
    orderId: string, 
    packageDetails: any, 
    customerInfo: CustomerInfo,
    deliveryMethod: 'email' | 'sms' | 'both' = 'email',
    userId?: string
  ) {
    const invoiceNumber = this.generateInvoiceNumber();
    
    // Set due date to 14 days from now
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);
    
    // Create invoice items from package
    const items: InvoiceItem[] = [{
      description: packageDetails.title,
      quantity: 1,
      price: packageDetails.price
    }];

    // Create invoice data
    const invoiceData: InvoiceData = {
      orderId,
      customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      amount: packageDetails.price,
      items,
      dueDate: dueDate.toISOString(),
      invoiceNumber,
      userId,
      deliveryMethod
    };

    // Create invoice in database
    const { invoice, error } = await this.createInvoice(invoiceData);
    
    if (error) {
      throw error;
    }
    
    // Deliver invoice via selected channels
    if (invoice) {
      await this.deliverInvoice(
        invoice,
        deliveryMethod,
        {
          email: invoiceData.customerEmail,
          name: invoiceData.customerName,
          phone: invoiceData.customerPhone
        },
        invoiceData
      );
    }
    
    return invoice;
  }
};
