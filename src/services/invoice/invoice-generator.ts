
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
    
    // Create invoice items from package with enhanced details
    const items: InvoiceItem[] = [{
      description: packageDetails.title,
      quantity: 1,
      price: packageDetails.price,
      details: packageDetails.description,
      features: Array.isArray(packageDetails.features) ? packageDetails.features.slice(0, 3) : undefined
    }];
    
    // Add any add-ons with details
    if (packageDetails.addOns && Array.isArray(packageDetails.addOns) && packageDetails.addOns.length > 0) {
      packageDetails.addOns.forEach((addon: any) => {
        items.push({
          description: addon.name || addon.title,
          quantity: 1,
          price: addon.price,
          details: addon.description
        });
      });
    }

    // Get the template type for this package
    const templateType = getTemplateForPackage(packageDetails.id) as "standard" | "premium" | "platinum";
    
    // Add custom notes based on template type
    let notes;
    if (templateType === 'premium') {
      notes = "Premium customers receive priority support and monthly strategy sessions. Thank you for your valued business!";
    } else if (templateType === 'platinum') {
      notes = "As a Platinum member, you receive exclusive access to our executive support team and quarterly business reviews. We value your partnership!";
    }

    // Create invoice data
    return {
      orderId,
      customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      amount: packageDetails.finalPrice || packageDetails.price,
      items,
      dueDate: dueDate.toISOString(),
      invoiceNumber: this.generateInvoiceNumber(),
      userId,
      deliveryMethod,
      templateType,
      notes
    };
  }
};
