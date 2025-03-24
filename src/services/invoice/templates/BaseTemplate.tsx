
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
}

// Base template that all other templates will extend
const BaseTemplate: React.FC<InvoiceTemplateProps> = ({ invoiceData, companyInfo }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="invoice-template base-template">
      <div className="invoice-header">
        <div className="company-info">
          <h1>{companyInfo?.name || 'AdBiz Pro'}</h1>
          {companyInfo?.address && <p>{companyInfo.address}</p>}
          {companyInfo?.phone && <p>Phone: {companyInfo.phone}</p>}
          {companyInfo?.email && <p>Email: {companyInfo.email}</p>}
          {companyInfo?.website && <p>Website: {companyInfo.website}</p>}
        </div>
        <div className="invoice-info">
          <h2>INVOICE</h2>
          <p>Invoice #: {invoiceData.invoiceNumber}</p>
          <p>Issue Date: {formatDate(new Date().toISOString())}</p>
          <p>Due Date: {formatDate(invoiceData.dueDate)}</p>
        </div>
      </div>

      <div className="customer-info">
        <h3>Bill To:</h3>
        <p>{invoiceData.customerName}</p>
        <p>Email: {invoiceData.customerEmail}</p>
        {invoiceData.customerPhone && <p>Phone: {invoiceData.customerPhone}</p>}
      </div>

      <div className="invoice-items">
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item: InvoiceItem, index: number) => (
              <tr key={index}>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="text-right font-bold">Total:</td>
              <td className="font-bold">${invoiceData.amount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="invoice-footer">
        <p>Thank you for your business!</p>
        <p>Payment is due by {formatDate(invoiceData.dueDate)}</p>
      </div>
    </div>
  );
};

export default BaseTemplate;
