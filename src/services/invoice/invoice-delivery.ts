
import { InvoiceDeliveryMethod, InvoiceDeliveryResult, InvoiceData } from "./types";

/**
 * Handles invoice delivery through different channels
 */
export const invoiceDelivery = {
  /**
   * Sends an invoice via email
   */
  async sendInvoiceEmail(invoiceId: string, email: string, name: string, invoiceData: Partial<InvoiceData>) {
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
  async deliverInvoice(invoice: any, deliveryMethod: InvoiceDeliveryMethod, customerInfo: {
    email: string;
    name: string;
    phone?: string;
  }, invoiceData: Partial<InvoiceData>): Promise<InvoiceDeliveryResult> {
    const results: InvoiceDeliveryResult = {
      email: null,
      sms: null,
      errors: []
    };
    
    // Send via email if method is 'email' or 'both'
    if (deliveryMethod === 'email' || deliveryMethod === 'both') {
      try {
        results.email = await this.sendInvoiceEmail(
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
  }
};
