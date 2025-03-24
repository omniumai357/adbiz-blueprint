
import React from 'react';
import BaseTemplate, { InvoiceTemplateProps } from './BaseTemplate';

const PlatinumTemplate: React.FC<InvoiceTemplateProps> = ({ invoiceData, companyInfo }) => {
  return (
    <div className="invoice-template platinum-template">
      <div className="platinum-banner">
        Exclusive Platinum Member Invoice
      </div>
      
      <BaseTemplate 
        invoiceData={invoiceData} 
        companyInfo={companyInfo}
      />
      
      <div className="mt-8 pt-4 border-t">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-slate-50 p-4 rounded border border-slate-200">
            <h3 className="font-semibold text-slate-700 mb-2">Executive Benefits</h3>
            <ul className="list-disc pl-5">
              <li>24/7 VIP Support Hotline</li>
              <li>Executive Strategy Consultations</li>
              <li>Quarterly Business Review</li>
            </ul>
          </div>
          
          <div className="bg-slate-50 p-4 rounded border border-slate-200">
            <h3 className="font-semibold text-slate-700 mb-2">Platinum Exclusives</h3>
            <ul className="list-disc pl-5">
              <li>Priority Feature Requests</li>
              <li>Industry Networking Events</li>
              <li>Complimentary Workshops</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatinumTemplate;
