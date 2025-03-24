
import { Receipt } from "@/components/receipts/types";
import ReceiptCard from "@/components/receipts/ReceiptCard";
import EmptyState from "@/components/receipts/EmptyState";
import LoadingState from "@/components/receipts/LoadingState";

interface ReceiptsListProps {
  receipts: Receipt[];
  loading: boolean;
  onViewInvoice: (invoiceNumber: string) => void;
  onDownloadReceipt: (receiptId: string) => void;
}

const ReceiptsList = ({ 
  receipts, 
  loading, 
  onViewInvoice, 
  onDownloadReceipt 
}: ReceiptsListProps) => {
  if (loading) {
    return <LoadingState />;
  }
  
  if (receipts.length === 0) {
    return <EmptyState />;
  }
  
  return (
    <div className="space-y-4">
      {receipts.map((receipt) => (
        <ReceiptCard
          key={receipt.id}
          receipt={receipt}
          onViewInvoice={onViewInvoice}
          onDownloadReceipt={onDownloadReceipt}
        />
      ))}
    </div>
  );
};

export default ReceiptsList;
