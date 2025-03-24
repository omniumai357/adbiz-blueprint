
import React from 'react';
import BaseTemplate, { InvoiceTemplateProps } from './BaseTemplate';

// Premium package template with VIP sections
const PremiumTemplate: React.FC<InvoiceTemplateProps> = (props) => {
  const { invoiceData } = props;
  
  return (
    <div className="premium-template">
      <div className="vip-banner bg-gradient-to-r from-amber-200 to-amber-100 p-3 text-center mb-4 rounded">
        <p className="text-amber-800 font-bold">★ VIP PREMIUM CUSTOMER ★</p>
      </div>
      
      <BaseTemplate {...props} />
      
      <div className="additional-info mt-8 border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">Premium Package Privileges</h3>
        <ul className="list-disc pl-5">
          <li>30 ads/posts per month</li>
          <li>Dedicated account manager</li>
          <li>Priority support - direct line: (555) 123-4567</li>
          <li>Monthly performance reports</li>
          <li>First strategy meeting: {new Date(new Date().setDate(new Date().getDate() + 3)).toLocaleDateString()}</li>
        </ul>
        
        <div className="mt-4 bg-amber-50 p-4 rounded border border-amber-200">
          <p className="font-medium">Your premium onboarding begins immediately. Check your email for VIP access details.</p>
        </div>
      </div>
    </div>
  );
};

export default PremiumTemplate;
