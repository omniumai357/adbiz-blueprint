
import React from 'react';
import BaseTemplate, { InvoiceTemplateProps } from './BaseTemplate';

const StandardTemplate: React.FC<InvoiceTemplateProps> = ({ invoiceData, companyInfo }) => {
  return (
    <BaseTemplate 
      invoiceData={invoiceData} 
      companyInfo={companyInfo}
    />
  );
};

export default StandardTemplate;
