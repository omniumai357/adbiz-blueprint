
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/ui/use-toast";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Download, ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils/format-utils";
import { format } from "date-fns";

interface Receipt {
  id: string;
  created_at: string;
  total_amount: number;
  invoice_number?: string;
  package_title?: string;
}

const Receipts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceipts = async () => {
      if (!user) {
        navigate("/auth");
        return;
      }

      try {
        setLoading(true);
        // Get orders with invoice info
        const { data, error } = await supabase
          .from('orders')
          .select(`
            id, 
            created_at, 
            total_amount, 
            status,
            package_id,
            company_info,
            invoices(invoice_number)
          `)
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Get package details
        const packageIds = data.map(order => order.package_id).filter(Boolean);
        const { data: packagesData } = await supabase
          .from('packages')
          .select('id, title')
          .in('id', packageIds);
        
        const packageMap = packagesData?.reduce((acc, pkg) => {
          acc[pkg.id] = pkg.title;
          return acc;
        }, {});

        // Format receipt data
        const formattedReceipts = data.map(order => ({
          id: order.id,
          created_at: order.created_at,
          total_amount: order.total_amount,
          invoice_number: order.invoices && order.invoices[0]?.invoice_number,
          package_title: order.package_id ? packageMap[order.package_id] : undefined
        }));

        setReceipts(formattedReceipts);
      } catch (error) {
        console.error("Error fetching receipts:", error);
        toast({
          title: "Failed to load receipts",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, [user, navigate, toast]);

  const viewInvoice = (invoiceNumber: string) => {
    // In a real app, this would open the invoice in a new tab
    window.open(`/invoice/${invoiceNumber}`, '_blank');
  };

  const downloadReceipt = (receiptId: string) => {
    // In a real app, this would download the receipt
    toast({
      title: "Download started",
      description: "Your receipt is being downloaded"
    });
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
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
              <p>Loading your receipts...</p>
            </div>
          ) : receipts.length === 0 ? (
            <Card className="p-8 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2">No receipts found</h2>
              <p className="text-gray-500 mb-6">You haven't made any purchases yet.</p>
              <Button onClick={() => navigate("/services")}>
                Browse Services
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {receipts.map((receipt) => (
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
                        onClick={() => downloadReceipt(receipt.id)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      
                      {receipt.invoice_number && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => viewInvoice(receipt.invoice_number!)}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Invoice
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Receipts;
