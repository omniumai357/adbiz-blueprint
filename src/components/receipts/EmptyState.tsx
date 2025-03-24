
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const EmptyState = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="p-8 text-center">
      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
      <h2 className="text-xl font-semibold mb-2">No receipts found</h2>
      <p className="text-gray-500 mb-6">You haven't made any purchases yet.</p>
      <Button onClick={() => navigate("/services")}>
        Browse Services
      </Button>
    </Card>
  );
};

export default EmptyState;
