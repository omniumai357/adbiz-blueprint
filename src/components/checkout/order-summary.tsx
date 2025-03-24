
import React from "react";
import { formatCurrency } from "@/lib/utils/format-utils";

interface OrderSummaryProps {
  packageName: string;
  packagePrice: number;
  invoiceNumber?: string;
}

const OrderSummary = ({ packageName, packagePrice, invoiceNumber }: OrderSummaryProps) => {
  return (
    <div className="mb-8 p-4 bg-gray-50 rounded-md">
      <h3 className="text-lg font-medium mb-4">Order Summary</h3>
      {invoiceNumber && (
        <div className="mb-4 pb-2 border-b border-gray-200">
          <span className="text-sm text-gray-500">Invoice #: {invoiceNumber}</span>
        </div>
      )}
      <div className="flex justify-between">
        <span>{packageName}</span>
        <span>{formatCurrency(packagePrice)}</span>
      </div>
    </div>
  );
};

export default OrderSummary;
