
import { InvoiceData } from '../types';

// Templates will be dynamically loaded based on package type
export const getTemplateForPackage = (packageId: string): string => {
  // Extract the package category/tier from the ID
  if (packageId.includes('premium') || packageId.includes('tier3')) {
    return 'premium';
  } else if (packageId.includes('platinum')) {
    return 'platinum';
  } else {
    // Default to standard template for basic and standard packages
    return 'standard';
  }
};

// Generate HTML content based on template and invoice data
export const generateInvoiceHtml = (invoiceData: InvoiceData, templateType: string): string => {
  // Base styles for all invoice templates
  const baseStyles = `
    * { font-family: Arial, sans-serif; box-sizing: border-box; }
    .invoice-template { max-width: 800px; margin: 0 auto; padding: 20px; }
    .invoice-header { display: flex; justify-content: space-between; margin-bottom: 30px; }
    .invoice-info { text-align: right; }
    .customer-info { margin-bottom: 20px; }
    .invoice-items table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    .invoice-items th, .invoice-items td { border-bottom: 1px solid #eee; padding: 10px; text-align: left; }
    .invoice-items th { background-color: #f8f8f8; }
    .text-right { text-align: right; }
    .font-bold { font-weight: bold; }
    .invoice-footer { margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; }
  `;

  // Template-specific styles
  const templateStyles = {
    standard: `
      .additional-info { background-color: #f9f9f9; padding: 15px; border-radius: 5px; }
      .mt-8 { margin-top: 2rem; }
      .border-t { border-top: 1px solid #eee; }
      .pt-4 { padding-top: 1rem; }
      .mt-4 { margin-top: 1rem; }
      .bg-gray-50 { background-color: #f9fafb; }
      .p-4 { padding: 1rem; }
      .rounded { border-radius: 0.25rem; }
      .font-medium { font-weight: 500; }
      .text-lg { font-size: 1.125rem; }
      .font-semibold { font-weight: 600; }
      .mb-2 { margin-bottom: 0.5rem; }
      .list-disc { list-style-type: disc; }
      .pl-5 { padding-left: 1.25rem; }
    `,
    premium: `
      .vip-banner { background: linear-gradient(to right, #f7dc6f, #fcf3cf); color: #7d6608; text-align: center; padding: 10px; margin-bottom: 20px; border-radius: 5px; }
      .additional-info { background-color: #fffbeb; padding: 15px; border-radius: 5px; border: 1px solid #fcd34d; }
      .mt-8 { margin-top: 2rem; }
      .border-t { border-top: 1px solid #eee; }
      .pt-4 { padding-top: 1rem; }
      .mt-4 { margin-top: 1rem; }
      .bg-amber-50 { background-color: #fffbeb; }
      .p-4 { padding: 1rem; }
      .rounded { border-radius: 0.25rem; }
      .border { border-width: 1px; }
      .border-amber-200 { border-color: #fde68a; }
      .font-medium { font-weight: 500; }
      .text-lg { font-size: 1.125rem; }
      .font-semibold { font-weight: 600; }
      .mb-2 { margin-bottom: 0.5rem; }
      .list-disc { list-style-type: disc; }
      .pl-5 { padding-left: 1.25rem; }
    `,
    platinum: `
      .platinum-banner { background: linear-gradient(to right, #334155, #475569); color: white; text-align: center; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
      .additional-info { background-color: #f8fafc; padding: 15px; border-radius: 5px; }
      .mt-8 { margin-top: 2rem; }
      .border-t { border-top: 1px solid #eee; }
      .pt-4 { padding-top: 1rem; }
      .mt-4 { margin-top: 1rem; }
      .mt-6 { margin-top: 1.5rem; }
      .bg-slate-50 { background-color: #f8fafc; }
      .bg-slate-100 { background-color: #f1f5f9; }
      .p-4 { padding: 1rem; }
      .rounded { border-radius: 0.25rem; }
      .border { border-width: 1px; }
      .border-slate-200 { border-color: #e2e8f0; }
      .border-slate-300 { border-color: #cbd5e1; }
      .font-medium { font-weight: 500; }
      .text-lg { font-size: 1.125rem; }
      .font-semibold { font-weight: 600; }
      .mb-2 { margin-bottom: 0.5rem; }
      .text-slate-700 { color: #334155; }
      .list-disc { list-style-type: disc; }
      .pl-5 { padding-left: 1.25rem; }
      .grid { display: grid; }
      .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
      .gap-4 { gap: 1rem; }
      @media (min-width: 768px) {
        .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      }
    `
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get the specific template HTML based on template type
  const getTemplateHtml = () => {
    const itemsHtml = invoiceData.items.map(item => `
      <tr>
        <td>${item.description}</td>
        <td>${item.quantity}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>$${(item.quantity * item.price).toFixed(2)}</td>
      </tr>
    `).join('');

    // Base template structure
    let html = `
      <div class="invoice-template">
        <div class="invoice-header">
          <div class="company-info">
            <h1>AdBiz Pro</h1>
            <p>123 Marketing Ave, Digital City, CA 90210</p>
            <p>Phone: (555) 123-4567</p>
            <p>Email: info@adbiz.pro</p>
          </div>
          <div class="invoice-info">
            <h2>INVOICE</h2>
            <p>Invoice #: ${invoiceData.invoiceNumber}</p>
            <p>Issue Date: ${formatDate(new Date().toISOString())}</p>
            <p>Due Date: ${formatDate(invoiceData.dueDate)}</p>
          </div>
        </div>

        <div class="customer-info">
          <h3>Bill To:</h3>
          <p>${invoiceData.customerName}</p>
          <p>Email: ${invoiceData.customerEmail}</p>
          ${invoiceData.customerPhone ? `<p>Phone: ${invoiceData.customerPhone}</p>` : ''}
        </div>

        <div class="invoice-items">
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="text-right font-bold">Total:</td>
                <td class="font-bold">$${invoiceData.amount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div class="invoice-footer">
          <p>Thank you for your business!</p>
          <p>Payment is due by ${formatDate(invoiceData.dueDate)}</p>
        </div>
    `;

    // Add template-specific extras
    if (templateType === 'premium') {
      html = `
        <div class="vip-banner">
          <p>★ VIP PREMIUM CUSTOMER ★</p>
        </div>
        ${html}
        <div class="additional-info mt-8 border-t pt-4">
          <h3 class="text-lg font-semibold mb-2">Premium Package Privileges</h3>
          <ul class="list-disc pl-5">
            <li>30 ads/posts per month</li>
            <li>Dedicated account manager</li>
            <li>Priority support - direct line: (555) 123-4567</li>
            <li>Monthly performance reports</li>
            <li>First strategy meeting: ${formatDate(new Date(new Date().setDate(new Date().getDate() + 3)).toISOString())}</li>
          </ul>
          
          <div class="mt-4 bg-amber-50 p-4 rounded border border-amber-200">
            <p class="font-medium">Your premium onboarding begins immediately. Check your email for VIP access details.</p>
          </div>
        </div>
      `;
    } else if (templateType === 'platinum') {
      html = `
        <div class="platinum-banner">
          <p class="text-lg">★★★ PLATINUM EXECUTIVE ★★★</p>
        </div>
        ${html}
        <div class="additional-info mt-8 border-t pt-4">
          <h3 class="text-lg font-semibold mb-2">Platinum Executive Benefits</h3>
          <p class="mb-2 text-slate-700">Thank you for choosing our ultimate marketing solution.</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div class="bg-slate-50 p-4 rounded border border-slate-200">
              <h4 class="font-medium mb-2">Your 12-Month Campaign</h4>
              <ul class="list-disc pl-5">
                <li>Full-service marketing campaign</li>
                <li>Bonus language optimization</li>
                <li>Weekly strategy calls</li>
                <li>Custom reporting dashboard</li>
              </ul>
            </div>
            
            <div class="bg-slate-50 p-4 rounded border border-slate-200">
              <h4 class="font-medium mb-2">Executive Support</h4>
              <p>Your dedicated executive account manager:</p>
              <p class="font-bold">John Executive</p>
              <p>Direct: (555) 987-6543</p>
              <p>Email: john@adbizpro.com</p>
            </div>
          </div>
          
          <div class="mt-6 bg-slate-100 p-4 rounded border border-slate-300">
            <p class="font-medium">Your executive onboarding session is scheduled for ${formatDate(new Date(new Date().setDate(new Date().getDate() + 2)).toISOString())}. Check your email for calendar invitation.</p>
          </div>
        </div>
      `;
    } else if (templateType === 'standard') {
      html = `
        ${html}
        <div class="additional-info mt-8 border-t pt-4">
          <h3 class="text-lg font-semibold mb-2">Standard Package Details</h3>
          <ul class="list-disc pl-5">
            <li>15 ads/posts per month</li>
            <li>24/7 support included</li>
            <li>Advanced analytics included</li>
            <li>First report delivery: ${formatDate(new Date(new Date().setDate(new Date().getDate() + 7)).toISOString())}</li>
          </ul>
          
          <div class="mt-4 bg-gray-50 p-4 rounded">
            <p class="font-medium">Your dedicated account representative will contact you within 1 business day.</p>
          </div>
        </div>
      `;
    }

    html += '</div>'; // Close the invoice-template div
    return html;
  };

  // Combine all the components into a complete HTML document
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice #${invoiceData.invoiceNumber}</title>
      <style>
        ${baseStyles}
        ${templateStyles[templateType as keyof typeof templateStyles] || templateStyles.standard}
      </style>
    </head>
    <body>
      ${getTemplateHtml()}
    </body>
    </html>
  `;
};
