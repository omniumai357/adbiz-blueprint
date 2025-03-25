
import { InvoiceTemplate, invoiceTemplates } from '../../types';

/**
 * Default company information to use in templates
 * 
 * @returns {Object} Company information including name, address, phone, email, and website
 */
export function getDefaultCompanyInfo() {
  return {
    name: 'AdBiz Pro',
    address: '123 Business Ave, Suite 101, San Francisco, CA 94107',
    phone: '(555) 123-4567',
    email: 'billing@adbizpro.com',
    website: 'www.adbizpro.com'
  };
}

/**
 * Determine the appropriate template based on package ID or name
 * 
 * This function selects the most appropriate invoice template
 * based on the package tier or identifier provided.
 * 
 * @param {string} packageIdentifier - The package ID or name to determine template for
 * @returns {string} Template name to use ('standard', 'premium', or 'platinum')
 */
export function getTemplateForPackage(packageIdentifier: string): string {
  // Convert to lowercase for case-insensitive matching
  const packageId = packageIdentifier.toLowerCase();
  
  // Check for platinum packages
  if (packageId.includes('platinum')) {
    return 'platinum';
  }
  
  // Check for premium packages (tier3 also indicates premium level)
  if (packageId.includes('premium') || packageId.includes('tier3')) {
    return 'premium';
  }
  
  // Default to standard template
  return 'standard';
}
