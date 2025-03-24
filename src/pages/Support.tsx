
import React from 'react';
import { Helmet } from 'react-helmet';
import CustomerSupportChatbot from '@/components/CustomerSupportChatbot';

const Support = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>Customer Support | AdBiz.pro</title>
        <meta name="description" content="Get assistance with your AdBiz.pro marketing services. Our AI-powered support team is available to help 24/7." />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Customer Support</h1>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4">How Can We Help?</h2>
            <p className="text-gray-700 mb-4">
              Our AI-powered support assistant is available 24/7 to answer your questions about our marketing services, account management, and technical support.
            </p>
            <p className="text-gray-700 mb-4">
              For complex issues or personalized assistance, you can request to speak with a human agent who will get back to you within 24 hours.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <h3 className="text-lg font-medium text-blue-800 mb-2">Support Hours</h3>
              <p className="text-blue-700">AI Support: 24/7</p>
              <p className="text-blue-700">Human Support: Monday-Friday, 9am-5pm EST</p>
            </div>
          </div>
          
          <div>
            <CustomerSupportChatbot />
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">What is the turnaround time for ad creation?</h3>
              <p className="text-gray-700">Standard turnaround time is 24-48 hours after your order is approved.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Do you offer refunds?</h3>
              <p className="text-gray-700">Yes, we offer a 14-day satisfaction guarantee on all our services.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">How many revisions are included?</h3>
              <p className="text-gray-700">The number of revisions depends on your package: Tier 1 includes 1 revision, Tier 2 includes 2 revisions, and Tier 3 includes 3 revisions. Our Platinum package offers unlimited revisions.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">What file formats do you accept for uploads?</h3>
              <p className="text-gray-700">We accept JPG, PNG, GIF, and SVG for images; MP4, MOV, and AVI for videos; and PDF, DOCX, and XLSX for documents. Maximum file size is 100MB.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
