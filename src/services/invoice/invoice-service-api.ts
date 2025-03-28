
import { supabase } from "@/integrations/supabase/client";

/**
 * API service for interacting with invoices
 */
export const invoiceServiceApi = {
  /**
   * Gets an invoice by ID
   * 
   * @param invoiceId The invoice ID or number
   * @param userId Optional user ID for authenticated users
   * @returns The invoice data including HTML and PDF URL
   */
  async getInvoiceById(invoiceId: string, userId: string | null = null) {
    // Query parameters
    const params: Record<string, string> = { 
      invoice_id: invoiceId 
    };
    
    // Add user ID if provided
    if (userId) {
      params.user_id = userId;
    }
    
    // Fetch the invoice from the Supabase function
    const { data, error } = await supabase.functions.invoke("get-invoice", {
      body: params,
    });
    
    if (error) {
      console.error("Error fetching invoice:", error);
      throw new Error(`Failed to fetch invoice: ${error.message}`);
    }
    
    return {
      id: data.id,
      invoiceNumber: data.invoice_number,
      html: data.html,
      pdfUrl: data.pdf_url,
      createdAt: data.created_at,
      status: data.status
    };
  },
  
  /**
   * Generates a PDF from the invoice HTML
   * 
   * @param invoiceId The invoice ID or number
   * @param userId Optional user ID for authenticated users
   * @returns The URL to the generated PDF
   */
  async generatePdf(invoiceId: string, userId: string | null = null) {
    // Query parameters
    const params: Record<string, string> = { 
      invoice_id: invoiceId 
    };
    
    // Add user ID if provided
    if (userId) {
      params.user_id = userId;
    }
    
    // Generate the PDF using the Supabase function
    const { data, error } = await supabase.functions.invoke("generate-invoice-pdf", {
      body: params,
    });
    
    if (error) {
      console.error("Error generating invoice PDF:", error);
      throw new Error(`Failed to generate invoice PDF: ${error.message}`);
    }
    
    return {
      pdfUrl: data.pdf_url
    };
  },
  
  /**
   * Resends an invoice to the customer
   * 
   * @param invoiceId The invoice ID or number
   * @param deliveryMethod The delivery method (email, sms, or both)
   * @returns Success status
   */
  async resendInvoice(invoiceId: string, deliveryMethod: "email" | "sms" | "both" = "email") {
    const { data, error } = await supabase.functions.invoke("resend-invoice", {
      body: { 
        invoice_id: invoiceId,
        delivery_method: deliveryMethod
      },
    });
    
    if (error) {
      console.error("Error resending invoice:", error);
      throw new Error(`Failed to resend invoice: ${error.message}`);
    }
    
    return {
      success: data.success,
      message: data.message
    };
  }
};
