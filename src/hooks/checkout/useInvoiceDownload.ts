
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useService } from "@/hooks/services/useService";

/**
 * Hook for managing invoice downloads, printing, and sharing
 * 
 * @param invoiceNumber The invoice number to download
 * @param userId Optional user ID for authenticated users
 * @returns Invoice data and functions for interacting with the invoice
 */
export function useInvoiceDownload(invoiceNumber: string, userId: string | null) {
  const [invoiceHtml, setInvoiceHtml] = useState<string | null>(null);
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);
  
  const invoiceService = useService("invoices");
  
  // Fetch the invoice HTML when the component mounts
  useEffect(() => {
    async function fetchInvoice() {
      if (!invoiceNumber) return;
      
      try {
        setIsLoading(true);
        
        // Get invoice HTML and PDF URL
        const { html, pdfUrl } = await invoiceService.getInvoiceById(invoiceNumber, userId);
        
        if (html) {
          setInvoiceHtml(html);
        }
        
        if (pdfUrl) {
          setInvoiceUrl(pdfUrl);
        }
      } catch (error) {
        console.error("Failed to fetch invoice:", error);
        toast.error("Failed to load invoice", {
          description: "There was an error loading your invoice. Please try again later."
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchInvoice();
  }, [invoiceNumber, userId, invoiceService]);
  
  // Function to print the invoice
  const printInvoice = () => {
    if (!invoiceHtml) {
      toast.error("Invoice not available", {
        description: "The invoice is not available for printing."
      });
      return;
    }
    
    setIsPrinting(true);
    
    try {
      // Create a new window with the invoice HTML
      const printWindow = window.open("", "_blank");
      
      if (!printWindow) {
        throw new Error("Popup blocked");
      }
      
      // Write the invoice HTML to the new window
      printWindow.document.write(invoiceHtml);
      printWindow.document.close();
      
      // Wait for resources to load then print
      printWindow.onload = () => {
        printWindow.print();
        // Close the window after printing (some browsers may not close automatically)
        printWindow.onafterprint = () => {
          printWindow.close();
          setIsPrinting(false);
        };
      };
      
      // Fallback in case onload doesn't fire
      setTimeout(() => {
        setIsPrinting(false);
      }, 5000);
    } catch (error) {
      console.error("Error printing invoice:", error);
      
      if (error instanceof Error && error.message === "Popup blocked") {
        toast.error("Popup Blocked", {
          description: "Please allow popups to print your invoice."
        });
      } else {
        toast.error("Print Error", {
          description: "There was an error printing your invoice. Please try again."
        });
      }
      
      setIsPrinting(false);
    }
  };
  
  // Function to download the invoice
  const downloadInvoice = async () => {
    if (invoiceUrl) {
      // If we have a direct URL to the PDF, use it
      window.open(invoiceUrl, "_blank");
      return;
    }
    
    if (!invoiceHtml) {
      toast.error("Invoice not available", {
        description: "The invoice is not available for download."
      });
      return;
    }
    
    try {
      // Generate a PDF from the invoice HTML
      const { pdfUrl } = await invoiceService.generatePdf(invoiceNumber, userId);
      
      if (pdfUrl) {
        setInvoiceUrl(pdfUrl); // Cache for future use
        window.open(pdfUrl, "_blank");
      } else {
        throw new Error("Failed to generate PDF");
      }
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast.error("Download Error", {
        description: "There was an error downloading your invoice. Please try again."
      });
    }
  };
  
  // Function to share the invoice
  const shareInvoice = async () => {
    if (!invoiceNumber) {
      toast.error("Invoice not available", {
        description: "The invoice is not available for sharing."
      });
      return;
    }
    
    try {
      // Check if the Web Share API is available
      if (navigator.share) {
        await navigator.share({
          title: `Invoice #${invoiceNumber}`,
          text: `Here is your invoice #${invoiceNumber}`,
          url: window.location.href,
        });
      } else {
        // Fallback - copy invoice number to clipboard
        await navigator.clipboard.writeText(`Invoice #${invoiceNumber}`);
        toast.success("Invoice number copied to clipboard");
      }
    } catch (error) {
      console.error("Error sharing invoice:", error);
      
      if (error instanceof Error && error.message.includes("AbortError")) {
        // User canceled the share
        return;
      }
      
      toast.error("Share Error", {
        description: "There was an error sharing your invoice."
      });
    }
  };
  
  return {
    invoiceHtml,
    invoiceUrl,
    isLoading,
    isPrinting,
    printInvoice,
    downloadInvoice,
    shareInvoice
  };
}
