
import { Clock } from "lucide-react";

export const ResponseTimeInfo = () => {
  return (
    <div className="bg-secondary/30 rounded-lg p-6 border border-border">
      <h3 className="font-medium flex items-center gap-2 mb-3">
        <Clock className="h-5 w-5 text-primary" />
        Response Time
      </h3>
      <p className="text-muted-foreground text-sm">
        We aim to respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly.
      </p>
    </div>
  );
};
