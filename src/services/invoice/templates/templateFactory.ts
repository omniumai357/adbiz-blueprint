
import { InvoiceData } from '../types';
import { renderToString } from 'react-dom/server';
import React from 'react';
import StandardTemplate from './StandardTemplate';
import PremiumTemplate from './PremiumTemplate';
import PlatinumTemplate from './PlatinumTemplate';

// Returns the appropriate template type based on package ID
export const getTemplateForPackage = (packageId: string): string => {
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

  // Company info for all templates
  const companyInfo = {
    name: 'AdBiz Pro',
    address: '123 Marketing Ave, Digital City, CA 90210',
    phone: '(555) 123-4567',
    email: 'info@adbiz.pro',
    website: 'www.adbiz.pro'
  };

  // Render the appropriate React component to a string
  let templateContent;
  switch (templateType) {
    case 'premium':
      templateContent = renderToString(
        React.createElement(PremiumTemplate, { invoiceData, companyInfo })
      );
      break;
    case 'platinum':
      templateContent = renderToString(
        React.createElement(PlatinumTemplate, { invoiceData, companyInfo })
      );
      break;
    default:
      templateContent = renderToString(
        React.createElement(StandardTemplate, { invoiceData, companyInfo })
      );
      break;
  }

  // Combine all components into a complete HTML document
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
      ${templateContent}
    </body>
    </html>
  `;
};
