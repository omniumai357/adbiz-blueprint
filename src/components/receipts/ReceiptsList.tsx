
import { Receipt } from "@/components/receipts/types";
import ReceiptCard from "@/components/receipts/ReceiptCard";
import EmptyState from "@/components/receipts/EmptyState";
import LoadingState from "@/components/receipts/LoadingState";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

interface ReceiptsListProps {
  receipts: Receipt[];
  loading: boolean;
  onViewInvoice: (invoiceNumber: string) => void;
  onDownloadReceipt: (receiptId: string) => void;
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
  };
  onPageChange: (page: number) => void;
}

const ReceiptsList = ({ 
  receipts, 
  loading, 
  onViewInvoice, 
  onDownloadReceipt,
  pagination,
  onPageChange
}: ReceiptsListProps) => {
  if (loading) {
    return <LoadingState />;
  }
  
  if (receipts.length === 0) {
    return <EmptyState />;
  }
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const { page, totalPages } = pagination;
    const pageNumbers = [];
    
    // Always show current page
    // Try to show 2 pages before and after current page
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, page + 2);
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };
  
  const pageNumbers = getPageNumbers();
  
  return (
    <div className="space-y-6">
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
      
      {pagination.totalPages > 1 && (
        <Pagination className="my-4">
          <PaginationContent>
            {pagination.page > 1 && (
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => onPageChange(pagination.page - 1)} 
                  className="cursor-pointer"
                />
              </PaginationItem>
            )}
            
            {pageNumbers.map(pageNumber => (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  isActive={pageNumber === pagination.page}
                  onClick={() => onPageChange(pageNumber)}
                  className={pageNumber === pagination.page ? "" : "cursor-pointer"}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            {pagination.page < pagination.totalPages && (
              <PaginationItem>
                <PaginationNext 
                  onClick={() => onPageChange(pagination.page + 1)} 
                  className="cursor-pointer"
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default ReceiptsList;
