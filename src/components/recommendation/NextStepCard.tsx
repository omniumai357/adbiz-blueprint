
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, LightbulbIcon, BookOpen, Download } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NextStepRecommendation {
  id: string;
  title: string;
  description: string;
  actionText: string;
  actionLink: string;
  icon?: React.ReactNode;
  priority: number;
  type?: "navigation" | "download" | "ebook" | "contact";
  resourceId?: string;
}

interface NextStepCardProps {
  recommendation: NextStepRecommendation;
  className?: string;
  onResourceDownload?: (resourceId: string, resourceType: string) => void;
}

export const NextStepCard: React.FC<NextStepCardProps> = ({
  recommendation,
  className,
  onResourceDownload,
}) => {
  const navigate = useNavigate();
  
  const handleAction = () => {
    // Handle resource downloads
    if (recommendation.type === "ebook" && recommendation.resourceId && onResourceDownload) {
      onResourceDownload(recommendation.resourceId, "ebook");
      return;
    }
    
    // Handle special actions or navigate to the link
    if (recommendation.actionLink.startsWith("#")) {
      // Handle in-page anchors or special actions
      const elementId = recommendation.actionLink.substring(1);
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Navigate to the specified route
      navigate(recommendation.actionLink);
    }
  };

  // Determine the icon to display
  const renderIcon = () => {
    if (recommendation.icon) {
      return recommendation.icon;
    }
    
    switch (recommendation.type) {
      case "ebook":
        return <BookOpen className="h-5 w-5" />;
      case "download":
        return <Download className="h-5 w-5" />;
      default:
        return <LightbulbIcon className="h-5 w-5" />;
    }
  };

  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-md border-l-4",
        recommendation.type === "ebook" ? "border-l-emerald-500" : 
          recommendation.priority === 1 ? "border-l-primary" : "border-l-muted-foreground",
        className
      )}
    >
      <CardContent className="pt-6 pb-2">
        <div className="flex items-start gap-3">
          <div className="shrink-0 p-1.5 bg-muted rounded-md text-primary">
            {renderIcon()}
          </div>
          <div>
            <h4 className="font-medium text-base mb-1">{recommendation.title}</h4>
            <p className="text-sm text-muted-foreground">{recommendation.description}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pb-4 pt-0">
        <Button 
          variant="ghost" 
          className="ml-auto text-sm flex items-center gap-1 hover:gap-2 transition-all duration-200"
          onClick={handleAction}
        >
          {recommendation.actionText} <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};
