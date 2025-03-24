
import { supabase } from "@/integrations/supabase/client";
import { CustomerInfo } from "@/components/checkout/customer-info-form";
import { formatDate } from "@/lib/utils/format-utils";

export interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}

export interface InvoiceData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  items: InvoiceItem[];
  dueDate: string;
  invoiceNumber: string;
  userId?: string;
}

export const invoiceService = {
  /**
   * Creates a new invoice in the database
   */
  async createInvoice(data: InvoiceData) {
    try {
      const { data: invoice, error } = await supabase
        .from('invoices')
        .insert({
          order_id: data.orderId,
          user_id: data.userId,
          customer_email: data.customerEmail,
          customer_name: data.customerName,
          amount: data.amount,
          invoice_number: data.invoiceNumber,
          due_date: data.dueDate,
          items: data.items,
          status: 'pending'
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
      console.error("Error sending invoice:", error);
      throw error;
    }
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
      amount: packageDetails.price,
      items,
      dueDate: dueDate.toISOString(),
      invoiceNumber,
      userId
    };

    // Create invoice in database
    const { invoice, error } = await this.createInvoice(invoiceData);
    
    if (error) {
      throw error;
    }
    
    // Send invoice via email
    if (invoice) {
      await this.sendInvoice(
        invoice.id,
        invoiceData.customerEmail,
        invoiceData.customerName,
        invoiceData
      );
    }
    
    return invoice;
  }
};
