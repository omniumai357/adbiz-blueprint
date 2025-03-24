
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { generateInvoiceHtml } from '@/services/invoice/templates/templateFactory';
import { InvoiceData, InvoiceItem } from '@/services/invoice/types';
import { Button } from '@/components/ui/button';
import { Loader2, Printer, Download, X } from 'lucide-react';

interface InvoiceViewerProps {
  invoiceNumber: string;
  onClose: () => void;
}

interface DatabaseInvoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  amount: number;
  items: any[];
  due_date: string;
  order_id: string | null;
  user_id: string | null;
  created_at: string;
  delivery_method: string;
  delivery_status: string | null;
  status: string;
  sent_at?: string | null;
  sms_sent_at?: string | null;
  notes?: string | null;
  issue_date?: string;
}

const InvoiceViewer: React.FC<InvoiceViewerProps> = ({ invoiceNumber, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [invoiceData, setInvoiceData] = useState<DatabaseInvoice | null>(null);
  const [invoiceHtml, setInvoiceHtml] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        
        const { data: invoice, error: invoiceError } = await supabase
          .from('invoices')
          .select('*')
          .eq('invoice_number', invoiceNumber)
          .single();
        
        if (invoiceError) throw invoiceError;
        if (!invoice) throw new Error('Invoice not found');
        
        // Type assertion to ensure all properties are properly typed
        const typedInvoice = invoice as DatabaseInvoice;
        setInvoiceData(typedInvoice);
        
        let templateType = 'standard';
        if (typedInvoice.items && Array.isArray(typedInvoice.items) && typedInvoice.items.length > 0) {
          const firstItem = typedInvoice.items[0] as { description: string };
          if (firstItem && typeof firstItem.description === 'string') {
            const itemName = firstItem.description.toLowerCase();
            if (itemName.includes('premium') || itemName.includes('tier3')) {
              templateType = 'premium';
            } else if (itemName.includes('platinum')) {
              templateType = 'platinum';
            }
          }
        }
        
        const invoiceItems: InvoiceItem[] = Array.isArray(typedInvoice.items) 
          ? typedInvoice.items.map((item: any) => ({
              description: String(item.description || ''),
              quantity: Number(item.quantity || 1),
              price: Number(item.price || 0),
              details: item.details,
              features: item.features,
              timeframe: item.timeframe
            }))
          : [];
          
        const invoiceDataForTemplate: InvoiceData = {
          orderId: typedInvoice.order_id || 'unknown',
          customerName: typedInvoice.customer_name,
          customerEmail: typedInvoice.customer_email,
          customerPhone: typedInvoice.customer_phone,
          amount: typedInvoice.amount,
          items: invoiceItems,
          dueDate: typedInvoice.due_date,
          invoiceNumber: typedInvoice.invoice_number,
          userId: typedInvoice.user_id,
          deliveryMethod: typedInvoice.delivery_method as 'email' | 'sms' | 'both',
          templateType: templateType as 'standard' | 'premium' | 'platinum',
          notes: typedInvoice.notes
        };
        
        const html = generateInvoiceHtml(invoiceDataForTemplate, templateType);
        setInvoiceHtml(html);
      } catch (err) {
        console.error('Error fetching invoice:', err);
        setError('Failed to load invoice');
      } finally {
        setLoading(false);
      }
    };
    
    if (invoiceNumber) {
      fetchInvoice();
    }
  }, [invoiceNumber]);
  
  const printInvoice = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(invoiceHtml);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };
  
  const downloadInvoice = () => {
    const element = document.createElement('a');
    const file = new Blob([invoiceHtml], {type: 'text/html'});
    element.href = URL.createObjectURL(file);
    element.download = `invoice-${invoiceNumber}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Invoice #{invoiceNumber}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-grow overflow-auto p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p>Loading invoice...</p>
            </div>
          ) : error ? (
            <div className="text-center text-destructive p-8">
              <p>{error}</p>
            </div>
          ) : (
            <iframe 
              srcDoc={invoiceHtml}
              title={`Invoice #${invoiceNumber}`}
              className="w-full h-full min-h-[60vh] border rounded"
            />
          )}
        </div>
        
        <div className="p-4 border-t flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={printInvoice}
            disabled={loading || !!error}
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button 
            variant="outline"
            onClick={downloadInvoice}
            disabled={loading || !!error}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceViewer;
