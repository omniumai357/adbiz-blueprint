
import { InvoiceData } from '../types';
import { renderToString } from 'react-dom/server';
import React from 'react';
import StandardTemplate from './StandardTemplate';
import PremiumTemplate from './PremiumTemplate';
import PlatinumTemplate from './PlatinumTemplate';
import { baseStyles, templateStylesMap } from './styles/templateStyles';
import { getTemplateForPackage, getDefaultCompanyInfo } from './utils/templateSelector';

// Re-export the template selector function for use elsewhere
export { getTemplateForPackage } from './utils/templateSelector';

/**
 * Generate HTML content based on template and invoice data
 */
export const generateInvoiceHtml = (invoiceData: InvoiceData, templateType: string): string => {
  // Get the appropriate template style
  const templateStyle = templateStylesMap[templateType as keyof typeof templateStylesMap] || templateStylesMap.standard;
  
  // Get default company info
  const companyInfo = getDefaultCompanyInfo();

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
        ${templateStyle}
      </style>
    </head>
    <body>
      ${templateContent}
    </body>
    </html>
  `;
};
