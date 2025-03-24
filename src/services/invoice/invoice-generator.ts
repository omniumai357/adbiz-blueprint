
import { InvoiceData, InvoiceItem } from "./types";
import { CustomerInfo } from "@/components/checkout/customer-info-form";
import { getTemplateForPackage } from "./templates/templateFactory";

/**
 * Invoice generation utilities
 */
export const invoiceGenerator = {
  /**
   * Generates a unique invoice number
   */
  generateInvoiceNumber(): string {
    const prefix = 'INV';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
  },

  /**
   * Creates invoice data from order and customer information
   */
  createInvoiceDataFromOrder(
    orderId: string, 
    packageDetails: any, 
    customerInfo: CustomerInfo,
    deliveryMethod: 'email' | 'sms' | 'both' = 'email',
    userId?: string
  ): InvoiceData {
    // Set due date to 14 days from now
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);
    
    // Create invoice items from package
    const items: InvoiceItem[] = [{
      description: packageDetails.title,
      quantity: 1,
      price: packageDetails.price
    }];

    // Get the template type for this package
    const templateType = getTemplateForPackage(packageDetails.id) as "standard" | "premium" | "platinum";

    // Create invoice data
    return {
      orderId,
      customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      amount: packageDetails.price,
      items,
      dueDate: dueDate.toISOString(),
      invoiceNumber: this.generateInvoiceNumber(),
      userId,
      deliveryMethod,
      templateType // Store the template type
    };
  }
};
