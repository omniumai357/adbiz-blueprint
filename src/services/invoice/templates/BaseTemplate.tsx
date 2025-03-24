
import React from 'react';
import { InvoiceData, InvoiceItem } from '../types';

export interface InvoiceTemplateProps {
  invoiceData: InvoiceData;
  companyInfo?: {
    name: string;
    logo?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
  renderLineItems?: (items: InvoiceItem[]) => React.ReactNode;
}

// Base template that all other templates will extend
const BaseTemplate: React.FC<InvoiceTemplateProps> = ({ 
  invoiceData, 
  companyInfo,
  renderLineItems 
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Calculate subtotal, tax, and total
  const subtotal = invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const taxRate = invoiceData.taxRate || 0;
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  return (
    <div className="invoice-template base-template">
      <div className="invoice-header flex justify-between mb-6">
        <div className="company-info">
          <h1 className="text-2xl font-bold">{companyInfo?.name || 'AdBiz Pro'}</h1>
          {companyInfo?.address && <p className="text-gray-600">{companyInfo.address}</p>}
          {companyInfo?.phone && <p className="text-gray-600">Phone: {companyInfo.phone}</p>}
          {companyInfo?.email && <p className="text-gray-600">Email: {companyInfo.email}</p>}
          {companyInfo?.website && <p className="text-gray-600">Website: {companyInfo.website}</p>}
        </div>
        <div className="invoice-info text-right">
          <h2 className="text-xl font-bold text-gray-800">INVOICE</h2>
          <p className="text-gray-600">Invoice #: {invoiceData.invoiceNumber}</p>
          <p className="text-gray-600">Issue Date: {formatDate(new Date().toISOString())}</p>
          <p className="text-gray-600">Due Date: {formatDate(invoiceData.dueDate)}</p>
        </div>
      </div>

      <div className="customer-info bg-gray-50 p-4 rounded mb-6">
        <h3 className="text-gray-700 font-semibold mb-2">Bill To:</h3>
        <p className="font-medium">{invoiceData.customerName}</p>
        <p className="text-gray-600">Email: {invoiceData.customerEmail}</p>
        {invoiceData.customerPhone && <p className="text-gray-600">Phone: {invoiceData.customerPhone}</p>}
      </div>

      {/* Use custom line items renderer if provided, otherwise use default */}
      {renderLineItems ? (
        renderLineItems(invoiceData.items)
      ) : (
        <div className="invoice-items">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-2">Description</th>
                <th className="text-center p-2">Quantity</th>
                <th className="text-center p-2">Price</th>
                <th className="text-right p-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item: InvoiceItem, index: number) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{item.description}</td>
                  <td className="text-center p-2">{item.quantity}</td>
                  <td className="text-center p-2">${item.price.toFixed(2)}</td>
                  <td className="text-right p-2">${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="invoice-totals mt-6 flex justify-end">
        <div className="w-1/3">
          <div className="flex justify-between py-2">
            <span className="font-medium">Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {taxRate > 0 && (
            <div className="flex justify-between py-2">
              <span className="font-medium">Tax ({taxRate}%):</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between py-2 border-t font-bold">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="invoice-footer mt-8 pt-4 border-t text-gray-600">
        <p>Thank you for your business!</p>
        <p>Payment is due by {formatDate(invoiceData.dueDate)}</p>
        {invoiceData.notes && (
          <div className="mt-4">
            <h4 className="font-medium">Notes:</h4>
            <p>{invoiceData.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BaseTemplate;
