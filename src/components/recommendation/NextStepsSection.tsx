
import React from "react";
import { NextStepCard, NextStepRecommendation } from "./NextStepCard";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { showSuccessToast } from "@/utils/toast-utils";

interface NextStepsSectionProps {
  recommendations: NextStepRecommendation[];
  className?: string;
  title?: string;
  onResourceDownload?: (resourceId: string, resourceType: string) => void;
}

export const NextStepsSection: React.FC<NextStepsSectionProps> = ({ 
  recommendations, 
  className,
  title = "Recommended Next Steps",
  onResourceDownload
}) => {
  const { toast } = useToast();
  
  // Handle resource downloads
  const handleResourceDownload = (resourceId: string, resourceType: string) => {
    if (onResourceDownload) {
      onResourceDownload(resourceId, resourceType);
      return;
    }
    
    // Default handling if no custom handler provided
    showSuccessToast(
      `${resourceType === 'ebook' ? 'E-book' : 'Tutorial'} access granted`,
      `You now have access to this resource.`
    );
  };
  
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-6", className)}>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations
          .sort((a, b) => a.priority - b.priority)
          .map((recommendation) => (
            <NextStepCard 
              key={recommendation.id} 
              recommendation={recommendation}
              onResourceDownload={(resourceId, resourceType) => handleResourceDownload(resourceId, resourceType)}
            />
          ))}
      </div>
    </div>
  );
};
