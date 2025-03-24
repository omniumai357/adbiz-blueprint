
import React from 'react';
import BaseTemplate, { InvoiceTemplateProps } from './BaseTemplate';

const PremiumTemplate: React.FC<InvoiceTemplateProps> = ({ invoiceData, companyInfo }) => {
  return (
    <div className="invoice-template premium-template">
      <div className="vip-banner">
        Premium Customer Invoice
      </div>
      
      <BaseTemplate 
        invoiceData={invoiceData} 
        companyInfo={companyInfo}
      />
      
      <div className="mt-8 pt-4 border-t">
        <div className="additional-info">
          <h3 className="font-medium text-lg mb-2">Thank You for Choosing Our Premium Package</h3>
          <p>As a premium customer, you have access to priority support and exclusive benefits.</p>
          <ul className="list-disc pl-5 mt-4">
            <li>24/7 Priority Customer Support</li>
            <li>Dedicated Account Manager</li>
            <li>Monthly Strategy Sessions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PremiumTemplate;
