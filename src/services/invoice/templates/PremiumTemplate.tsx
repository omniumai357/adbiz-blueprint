
import React from 'react';
import BaseTemplate, { InvoiceTemplateProps } from './BaseTemplate';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

const PremiumTemplate: React.FC<InvoiceTemplateProps> = ({ invoiceData, companyInfo }) => {
  return (
    <div className="invoice-template premium-template p-8">
      <div className="vip-banner bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 text-center rounded-lg mb-6">
        Premium Customer Invoice
      </div>
      
      <BaseTemplate 
        invoiceData={invoiceData} 
        companyInfo={companyInfo}
        renderLineItems={(items) => (
          <div className="invoice-items py-4">
            <Table>
              <TableHeader className="bg-blue-50">
                <TableRow>
                  <TableHead className="w-1/2">Description</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-center">Unit Price</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50/50'}>
                    <TableCell className="font-medium">
                      {item.description}
                      {item.details && (
                        <div className="text-sm text-gray-600 mt-1">{item.details}</div>
                      )}
                      {item.features && (
                        <ul className="text-sm text-gray-600 mt-1 pl-4 list-disc">
                          {item.features.map((feature, i) => (
                            <li key={i}>{feature}</li>
                          ))}
                        </ul>
                      )}
                    </TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-center">${item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-medium">${(item.quantity * item.price).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      />
      
      <div className="mt-8 pt-4 border-t">
        <div className="additional-info bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-lg mb-2 text-blue-700">Thank You for Choosing Our Premium Package</h3>
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
