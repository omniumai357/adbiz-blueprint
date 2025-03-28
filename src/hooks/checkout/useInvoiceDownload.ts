
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/ui/use-toast";
import { useService } from "@/hooks/services/useService";

/**
 * Custom hook for managing invoice download, printing, and sharing
 * 
 * @param invoiceNumber The invoice number to download
 * @param userId Optional user ID for authenticated downloads
 * @returns Object containing invoice data and handling functions
 */
export function useInvoiceDownload(invoiceNumber: string | null, userId: string | null = null) {
  const [invoiceHtml, setInvoiceHtml] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Get invoice service from registry
  const invoicesService = useService("invoices");
  
  // Load invoice when invoice number changes
  useEffect(() => {
    async function loadInvoice() {
      if (!invoiceNumber) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch invoice HTML from service
        const response = await invoicesService.getInvoiceHtml(invoiceNumber, userId);
        
        if (response?.html) {
          setInvoiceHtml(response.html);
        } else {
          setError("Invoice content not available");
          toast({
            title: "Error loading invoice",
            description: "The invoice content could not be loaded. Please try again later.",
            variant: "destructive"
          });
        }
      } catch (err) {
        console.error("Error loading invoice:", err);
        setError("Failed to load invoice");
        toast({
          title: "Error loading invoice",
          description: "There was an error loading the invoice. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    // Small delay for better UX when showing loading state
    const timer = setTimeout(() => {
      loadInvoice();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [invoiceNumber, userId, invoicesService, toast]);
  
  // Function to print the invoice
  const printInvoice = async () => {
    if (!invoiceNumber) {
      toast({
        title: "Print error",
        description: "Invoice number is required for printing",
        variant: "destructive"
      });
      return;
    }
    
    setIsPrinting(true);
    
    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      
      if (!printWindow) {
        toast({
          title: "Print blocked",
          description: "Please allow pop-ups to print invoices",
          variant: "destructive"
        });
        return;
      }
      
      // Write invoice HTML to the new window
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice #${invoiceNumber}</title>
            <style>
              @media print {
                body { margin: 0; padding: 16px; }
                @page { size: auto; margin: 10mm; }
              }
              body { font-family: system-ui, -apple-system, sans-serif; }
            </style>
          </head>
          <body>
            ${invoiceHtml || '<p>Invoice content not available</p>'}
            <script>
              // Auto-print when content is loaded
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                  setTimeout(function() {
                    window.close();
                  }, 500);
                }, 500);
              };
            </script>
          </body>
        </html>
      `);
      
      toast({
        title: "Print prepared",
        description: "Your invoice is ready to print",
      });
    } catch (err) {
      console.error("Print error:", err);
      toast({
        title: "Print failed",
        description: "Failed to prepare invoice for printing",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => {
        setIsPrinting(false);
      }, 2000);
    }
  };
  
  // Function to download the invoice as PDF
  const downloadInvoice = async () => {
    if (!invoiceNumber) {
      toast({
        title: "Download error",
        description: "Invoice number is required for download",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Call the service to generate and download PDF
      const success = await invoicesService.downloadInvoicePdf(invoiceNumber, userId);
      
      if (success) {
        toast({
          title: "Download started",
          description: "Your invoice is being downloaded",
        });
      } else {
        throw new Error("Download failed");
      }
    } catch (err) {
      console.error("Download error:", err);
      toast({
        title: "Download failed",
        description: "Failed to download invoice. Please try again later.",
        variant: "destructive"
      });
    }
  };
  
  // Function to share the invoice
  const shareInvoice = async () => {
    if (!invoiceNumber) {
      toast({
        title: "Share error",
        description: "Invoice number is required for sharing",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Use Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: `Invoice #${invoiceNumber}`,
          text: `Check out my invoice #${invoiceNumber}`,
          url: `${window.location.origin}/invoices/${invoiceNumber}`
        });
        
        toast({
          title: "Share successful",
          description: "Your invoice has been shared",
        });
      } else {
        // Fallback to copying link to clipboard
        const invoiceUrl = `${window.location.origin}/invoices/${invoiceNumber}`;
        await navigator.clipboard.writeText(invoiceUrl);
        
        toast({
          title: "Link copied",
          description: "Invoice link copied to clipboard",
        });
      }
    } catch (err) {
      // User cancelled or sharing failed
      console.error("Share error:", err);
      
      if (err instanceof Error && err.message !== "Share canceled") {
        toast({
          title: "Share failed",
          description: "Failed to share invoice",
          variant: "destructive"
        });
      }
    }
  };
  
  return {
    invoiceHtml,
    isLoading,
    isPrinting,
    error,
    printInvoice,
    downloadInvoice,
    shareInvoice
  };
}
