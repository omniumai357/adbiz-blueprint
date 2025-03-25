
import { supabase } from "@/integrations/supabase/client";
import { InvoiceData, InvoiceItem } from "./types";
import { Json } from "@/integrations/supabase/types";

/**
 * Database operations for invoices
 * 
 * Repository pattern implementation for invoice data persistence,
 * providing a clean separation between database operations and
 * business logic.
 */
export const invoiceRepository = {
  /**
   * Creates a new invoice in the database
   * 
   * @param {InvoiceData} data - Invoice data to persist
   * @returns {Promise<Object>} Object containing the created invoice or error
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
  }
};
