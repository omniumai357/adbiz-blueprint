
import React from 'react';
import BaseTemplate, { InvoiceTemplateProps } from './BaseTemplate';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

const PlatinumTemplate: React.FC<InvoiceTemplateProps> = ({ invoiceData, companyInfo }) => {
  return (
    <div className="invoice-template platinum-template p-8">
      <div className="platinum-banner bg-gradient-to-r from-amber-500 to-amber-700 text-white p-4 text-center rounded-lg mb-6">
        <h2 className="text-xl font-bold">Exclusive Platinum Member Invoice</h2>
      </div>
      
      <BaseTemplate 
        invoiceData={invoiceData} 
        companyInfo={companyInfo}
        renderLineItems={(items) => (
          <div className="invoice-items py-4">
            <Table>
              <TableHeader className="bg-amber-50">
                <TableRow>
                  <TableHead className="w-1/2">Service Description</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-center">Unit Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-amber-50/50'}>
                    <TableCell>
                      <div className="font-bold text-amber-800">{item.description}</div>
                      {item.details && (
                        <div className="text-sm text-gray-700 mt-1">{item.details}</div>
                      )}
                      {item.features && (
                        <ul className="text-sm text-gray-700 mt-2 pl-4 space-y-1">
                          {item.features.map((feature, i) => (
                            <li key={i} className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {item.timeframe && (
                        <div className="text-sm text-amber-700 mt-2 font-medium">
                          Delivery timeframe: {item.timeframe}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-center font-medium">${item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-bold text-amber-800">${(item.quantity * item.price).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      />
      
      <div className="mt-8 pt-4 border-t border-amber-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <h3 className="font-semibold text-amber-800 mb-2">Executive Benefits</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>24/7 VIP Support Hotline</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Executive Strategy Consultations</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Quarterly Business Review</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <h3 className="font-semibold text-amber-800 mb-2">Platinum Exclusives</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Priority Feature Requests</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Industry Networking Events</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Complimentary Workshops</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatinumTemplate;
