
import React from 'react';
import BaseTemplate, { InvoiceTemplateProps } from './BaseTemplate';

// Platinum package template with executive sections
const PlatinumTemplate: React.FC<InvoiceTemplateProps> = (props) => {
  const { invoiceData } = props;
  
  return (
    <div className="platinum-template">
      <div className="platinum-banner bg-gradient-to-r from-slate-700 to-slate-600 p-4 text-center mb-4 rounded">
        <p className="text-white font-bold text-lg">★★★ PLATINUM EXECUTIVE ★★★</p>
      </div>
      
      <BaseTemplate {...props} />
      
      <div className="additional-info mt-8 border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">Platinum Executive Benefits</h3>
        <p className="mb-2 text-slate-700">Thank you for choosing our ultimate marketing solution.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-slate-50 p-4 rounded border border-slate-200">
            <h4 className="font-medium mb-2">Your 12-Month Campaign</h4>
            <ul className="list-disc pl-5">
              <li>Full-service marketing campaign</li>
              <li>Bonus language optimization</li>
              <li>Weekly strategy calls</li>
              <li>Custom reporting dashboard</li>
            </ul>
          </div>
          
          <div className="bg-slate-50 p-4 rounded border border-slate-200">
            <h4 className="font-medium mb-2">Executive Support</h4>
            <p>Your dedicated executive account manager:</p>
            <p className="font-bold">John Executive</p>
            <p>Direct: (555) 987-6543</p>
            <p>Email: john@adbizpro.com</p>
          </div>
        </div>
        
        <div className="mt-6 bg-slate-100 p-4 rounded border border-slate-300">
          <p className="font-medium">Your executive onboarding session is scheduled for {new Date(new Date().setDate(new Date().getDate() + 2)).toLocaleDateString()}. Check your email for calendar invitation.</p>
        </div>
      </div>
    </div>
  );
};

export default PlatinumTemplate;
