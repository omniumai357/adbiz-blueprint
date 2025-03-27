
import React from "react";
import { Badge } from "@/components/ui/badge";
import { BadgePercent, ShoppingBag } from "lucide-react";

interface OrderSummaryHeaderProps {
  packageName?: string;
  invoiceNumber?: string | null;
  savingsPercentage?: number;
}

const OrderSummaryHeader = ({ 
  packageName, 
  invoiceNumber, 
  savingsPercentage = 0 
}: OrderSummaryHeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium flex items-center">
          <ShoppingBag className="h-5 w-5 mr-2" />
          Order Summary {packageName ? `- ${packageName}` : ''}
        </h3>
        {savingsPercentage > 0 && (
          <div className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium flex items-center">
            <BadgePercent className="h-3 w-3 mr-1" />
            {savingsPercentage}% off
          </div>
        )}
      </div>
      
      {invoiceNumber && (
        <div className="mb-4 pb-2 border-b border-gray-200">
          <span className="text-sm text-gray-500">Invoice #: {invoiceNumber}</span>
        </div>
      )}
    </>
  );
};

export default OrderSummaryHeader;
