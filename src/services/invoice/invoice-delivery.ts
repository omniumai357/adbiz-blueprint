
import { InvoiceDeliveryMethod, InvoiceDeliveryResult } from './types';
import { supabase } from '@/integrations/supabase/client';
import { getTemplateForPackage, generateInvoiceHtml } from './templates/templateFactory';

/**
 * Invoice delivery service responsible for sending invoices through various channels
 */
export const invoiceDelivery = {
  /**
   * Sends an invoice via email
   */
  async sendInvoiceEmail(
    invoiceId: string,
    email: string,
    name: string,
    invoiceData: any
  ): Promise<any> {
    try {
      // Determine the right template to use based on package
      const templateType = getTemplateForPackage(invoiceData.items[0]?.description?.toLowerCase() || '');
      
      // Generate HTML email from the template
      const invoiceHtml = generateInvoiceHtml(invoiceData, templateType);

      // Use the Supabase Edge Function to send the email
      const { data, error } = await supabase.functions.invoke('send-invoice', {
        body: {
          invoiceId,
          email,
          name,
          orderId: invoiceData.orderId,
          items: invoiceData.items,
          amount: invoiceData.amount,
          invoiceNumber: invoiceData.invoiceNumber,
          dueDate: invoiceData.dueDate,
          invoiceHtml // Pass the generated HTML from our template
        },
      });

      if (error) throw error;
      
      console.log('Email delivery response:', data);
      return data;
    } catch (error) {
      console.error('Failed to send invoice email:', error);
      return { error };
    }
  },

  /**
   * Sends an invoice via SMS
   */
  async sendInvoiceSMS(
    invoiceId: string,
    phoneNumber: string,
    invoiceNumber: string,
    customMessage?: string
  ): Promise<any> {
    try {
      // Default message if none provided
      const message = customMessage || 
        `Your invoice #${invoiceNumber} is ready. Log in to your account to view or download it.`;
      
      // Use the Supabase Edge Function to send the SMS
      const { data, error } = await supabase.functions.invoke('send-invoice', {
        body: {
          invoiceId,
          phoneNumber,
          invoiceNumber,
          message,
          sendSms: true
        },
      });

      if (error) throw error;
      
      console.log('SMS delivery response:', data);
      return data;
    } catch (error) {
      console.error('Failed to send invoice SMS:', error);
      return { error };
    }
  },

  /**
   * Delivers an invoice through selected channels (email, SMS, or both)
   */
  async deliverInvoice(
    invoice: any,
    deliveryMethod: InvoiceDeliveryMethod,
    customerInfo: {
      email: string;
      name: string;
      phone?: string;
    },
    invoiceData: any
  ): Promise<InvoiceDeliveryResult> {
    const result: InvoiceDeliveryResult = {
      email: null,
      sms: null,
      errors: []
    };

    try {
      // Email delivery
      if (deliveryMethod === 'email' || deliveryMethod === 'both') {
        const emailResponse = await this.sendInvoiceEmail(
          invoice.id,
          customerInfo.email,
          customerInfo.name,
          invoiceData
        );
        
        result.email = emailResponse;
        
        if (emailResponse.error) {
          result.errors.push(new Error(`Email delivery failed: ${emailResponse.error.message}`));
        }
      }
      
      // SMS delivery
      if ((deliveryMethod === 'sms' || deliveryMethod === 'both') && customerInfo.phone) {
        const smsResponse = await this.sendInvoiceSMS(
          invoice.id,
          customerInfo.phone,
          invoice.invoice_number
        );
        
        result.sms = smsResponse;
        
        if (smsResponse.error) {
          result.errors.push(new Error(`SMS delivery failed: ${smsResponse.error.message}`));
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error in invoice delivery:', error);
      result.errors.push(error as Error);
      return result;
    }
  }
};
