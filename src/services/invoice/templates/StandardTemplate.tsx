
import React from 'react';
import BaseTemplate, { InvoiceTemplateProps } from './BaseTemplate';

// Standard package template with basic sections
const StandardTemplate: React.FC<InvoiceTemplateProps> = (props) => {
  const { invoiceData } = props;
  
  return (
    <div className="standard-template">
      <BaseTemplate {...props} />
      
      <div className="additional-info mt-8 border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">Standard Package Details</h3>
        <ul className="list-disc pl-5">
          <li>15 ads/posts per month</li>
          <li>24/7 support included</li>
          <li>Advanced analytics included</li>
          <li>First report delivery: {new Date(new Date().setDate(new Date().getDate() + 7)).toLocaleDateString()}</li>
        </ul>
        
        <div className="mt-4 bg-gray-50 p-4 rounded">
          <p className="font-medium">Your dedicated account representative will contact you within 1 business day.</p>
        </div>
      </div>
    </div>
  );
};

export default StandardTemplate;
