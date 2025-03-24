
import React from "react";

interface OrderSummaryProps {
  packageName: string;
  packagePrice: number;
}

const OrderSummary = ({ packageName, packagePrice }: OrderSummaryProps) => {
  return (
    <div className="mb-8 p-4 bg-gray-50 rounded-md">
      <h3 className="text-lg font-medium mb-4">Order Summary</h3>
      <div className="flex justify-between">
        <span>{packageName}</span>
        <span>${packagePrice.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderSummary;
