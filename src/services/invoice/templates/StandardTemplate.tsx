
import React from 'react';
import BaseTemplate, { InvoiceTemplateProps } from './BaseTemplate';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

const StandardTemplate: React.FC<InvoiceTemplateProps> = ({ invoiceData, companyInfo }) => {
  return (
    <div className="invoice-template standard-template p-8">
      <BaseTemplate 
        invoiceData={invoiceData} 
        companyInfo={companyInfo}
        renderLineItems={(items) => (
          <div className="invoice-items py-4">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-1/2">Description</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-center">Unit Price</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <TableCell className="font-medium">
                      {item.description}
                      {item.details && (
                        <div className="text-sm text-gray-500 mt-1">{item.details}</div>
                      )}
                    </TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-center">${item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${(item.quantity * item.price).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      />
      <div className="standard-footer text-center text-gray-500 text-sm pt-8 mt-8 border-t">
        <p>Thank you for choosing our Standard services!</p>
      </div>
    </div>
  );
};

export default StandardTemplate;
