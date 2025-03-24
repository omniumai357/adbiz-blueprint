
import { CustomerInfo } from "@/components/checkout/customer-info-form";
import { invoiceGenerator } from "./invoice-generator";
import { invoiceRepository } from "./invoice-repository";
import { invoiceDelivery } from "./invoice-delivery";
import { InvoiceData, InvoiceItem, InvoiceDeliveryMethod } from "./types";

export { InvoiceItem, InvoiceData } from "./types";

/**
 * Invoice service facade that combines all invoice related operations
 */
export const invoiceService = {
  /**
   * Creates a new invoice in the database
   */
  async createInvoice(data: InvoiceData) {
    return invoiceRepository.createInvoice(data);
  },

  /**
   * Sends an invoice via email
   */
  async sendInvoice(invoiceId: string, email: string, name: string, invoiceData: Partial<InvoiceData>) {
    return invoiceDelivery.sendInvoiceEmail(invoiceId, email, name, invoiceData);
  },

  /**
   * Sends an invoice via SMS
   */
  async sendInvoiceSMS(invoiceId: string, phoneNumber: string, invoiceNumber: string, customMessage?: string) {
    return invoiceDelivery.sendInvoiceSMS(invoiceId, phoneNumber, invoiceNumber, customMessage);
  },

  /**
   * Delivers an invoice through selected channels (email, SMS, or both)
   */
  async deliverInvoice(invoice: any, deliveryMethod: InvoiceDeliveryMethod, customerInfo: {
    email: string;
    name: string;
    phone?: string;
  }, invoiceData: Partial<InvoiceData>) {
    return invoiceDelivery.deliverInvoice(invoice, deliveryMethod, customerInfo, invoiceData);
  },

  /**
   * Generates a unique invoice number
   */
  generateInvoiceNumber() {
    return invoiceGenerator.generateInvoiceNumber();
  },

  /**
   * Creates an invoice from order and customer information
   */
  async createInvoiceFromOrder(
    orderId: string, 
    packageDetails: any, 
    customerInfo: CustomerInfo,
    deliveryMethod: InvoiceDeliveryMethod = 'email',
    userId?: string
  ) {
    // Create invoice data
    const invoiceData = invoiceGenerator.createInvoiceDataFromOrder(
      orderId,
      packageDetails,
      customerInfo,
      deliveryMethod,
      userId
    );

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
