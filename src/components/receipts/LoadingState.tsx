
import { Loader2 } from "lucide-react";

const LoadingState = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
      <p>Loading your receipts...</p>
    </div>
  );
};

export default LoadingState;
