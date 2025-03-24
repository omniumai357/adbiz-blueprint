
import React from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import DownloadOptions from "@/components/DownloadOptions";

interface CheckoutSuccessProps {
  orderId: string;
  packageName: string;
  invoiceNumber: string | null;
  isGeneratingInvoice: boolean;
  userId: string | null;
}

const CheckoutSuccess = ({
  orderId,
  packageName,
  invoiceNumber,
  isGeneratingInvoice,
  userId
}: CheckoutSuccessProps) => {
  const navigate = useNavigate();

  const viewAllReceipts = () => {
    navigate("/receipts");
  };

  return (
    <div className="space-y-8">
      <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Thank You For Your Purchase!</h2>
        <p className="mb-2">Your order has been successfully processed. Order ID: {orderId}</p>
        {isGeneratingInvoice ? (
          <div className="flex justify-center items-center mb-6">
            <Loader2 className="h-6 w-6 animate-spin text-green-600 mr-2" />
            <p className="text-green-600">Generating your invoice...</p>
          </div>
        ) : invoiceNumber ? (
          <p className="mb-6 text-sm text-green-600">
            Invoice #{invoiceNumber} has been sent via your preferred delivery method.
          </p>
        ) : null}
        <DownloadOptions purchaseId={orderId} packageName={packageName} />
        
        {userId && (
          <div className="mt-6 pt-4 border-t border-green-200">
            <p className="text-sm text-green-600 mb-2">
              A copy of this receipt has been stored in your account.
            </p>
            <button 
              onClick={viewAllReceipts}
              className="text-sm underline text-green-700 hover:text-green-800 transition-colors"
            >
              View all receipts
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutSuccess;
