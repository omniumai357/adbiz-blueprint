
import { format } from "date-fns";
import { Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/format-utils";
import { Receipt } from "@/components/receipts/types";

interface ReceiptCardProps {
  receipt: Receipt;
  onViewInvoice: (invoiceNumber: string) => void;
  onDownloadReceipt: (receiptId: string) => void;
}

const ReceiptCard = ({ receipt, onViewInvoice, onDownloadReceipt }: ReceiptCardProps) => {
  return (
    <Card key={receipt.id} className="p-5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <p className="text-sm text-gray-500 mb-1">
            {format(new Date(receipt.created_at), "MMMM d, yyyy")}
          </p>
          <h3 className="font-medium text-lg mb-1">
            {receipt.package_title || "Purchase"}
          </h3>
          <p className="text-primary font-bold">
            {formatCurrency(receipt.total_amount)}
          </p>
          {receipt.invoice_number && (
            <p className="text-sm mt-1">
              Invoice: #{receipt.invoice_number}
            </p>
          )}
        </div>
        
        <div className="flex mt-4 md:mt-0 space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDownloadReceipt(receipt.id)}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          
          {receipt.invoice_number && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewInvoice(receipt.invoice_number!)}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Invoice
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ReceiptCard;
