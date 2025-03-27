
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/ui/use-toast";
import { useAuth } from "@/features/auth";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import InvoiceViewer from "@/components/invoice/InvoiceViewer";
import ReceiptsList from "@/components/receipts/ReceiptsList";
import ReceiptSearchForm from "@/components/receipts/ReceiptSearchForm";
import { useReceipts } from "@/hooks/useReceipts";
import { ReceiptSearchParams } from "@/components/receipts/types";

const Receipts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useState<ReceiptSearchParams>({});
  const pageSize = 5; // Number of receipts per page
  
  const { receipts, loading, pagination } = useReceipts(user?.id, currentPage, pageSize, searchParams);

  const handleSearch = (params: ReceiptSearchParams) => {
    setSearchParams(params);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleResetSearch = () => {
    setSearchParams({});
    setCurrentPage(1); // Reset to first page when clearing search
  };

  const viewInvoice = (invoiceNumber: string) => {
    setSelectedInvoice(invoiceNumber);
  };

  const downloadReceipt = (receiptId: string) => {
    // In a real app, this would download the receipt
    toast({
      title: "Download started",
      description: "Your receipt is being downloaded"
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container px-4 mx-auto max-w-4xl">
          <div className="flex items-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">Your Receipts</h1>
          </div>
          
          <ReceiptSearchForm 
            onSearch={handleSearch}
            onReset={handleResetSearch}
          />
          
          <ReceiptsList
            receipts={receipts}
            loading={loading}
            onViewInvoice={viewInvoice}
            onDownloadReceipt={downloadReceipt}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </div>
      </main>
      
      {selectedInvoice && (
        <InvoiceViewer 
          invoiceNumber={selectedInvoice} 
          onClose={() => setSelectedInvoice(null)} 
        />
      )}
    </div>
  );
};

export default Receipts;
