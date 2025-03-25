
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, LightbulbIcon, BookOpen, Download, Video, PlayCircle, Gift, TagIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NextStepRecommendation {
  id: string;
  title: string;
  description: string;
  actionText: string;
  actionLink: string;
  icon?: React.ReactNode;
  priority: number;
  type?: "navigation" | "download" | "ebook" | "contact" | "tutorial" | "partner-discount";
  resourceId?: string;
  partnerInfo?: {
    name: string;
    discountPercentage?: number;
    discountCode?: string;
    expiresAt?: string;
  };
}

interface NextStepCardProps {
  recommendation: NextStepRecommendation;
  className?: string;
  onResourceDownload?: () => void;
}

export const NextStepCard: React.FC<NextStepCardProps> = ({
  recommendation,
  className,
  onResourceDownload,
}) => {
  const navigate = useNavigate();
  
  const handleAction = () => {
    // Handle resource downloads
    if ((recommendation.type === "ebook" || recommendation.type === "tutorial") && recommendation.resourceId && onResourceDownload) {
      onResourceDownload();
      return;
    }
    
    // For partner discounts, copy discount code to clipboard if available
    if (recommendation.type === "partner-discount" && recommendation.partnerInfo?.discountCode) {
      navigator.clipboard.writeText(recommendation.partnerInfo.discountCode)
        .then(() => {
          // Show toast notification that code was copied
          const discountCode = recommendation.partnerInfo?.discountCode;
          window.dispatchEvent(new CustomEvent('show-toast', {
            detail: {
              title: "Code copied!",
              description: `Discount code ${discountCode} copied to clipboard`
            }
          }));
        })
        .catch(err => {
          console.error('Could not copy text: ', err);
        });
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
      case "tutorial":
        return <PlayCircle className="h-5 w-5" />;
      case "partner-discount":
        return <TagIcon className="h-5 w-5" />;
      default:
        return <LightbulbIcon className="h-5 w-5" />;
    }
  };

  // Get the border color based on recommendation type
  const getBorderColor = () => {
    if (recommendation.type === "tutorial") return "border-l-purple-500";
    if (recommendation.type === "ebook") return "border-l-emerald-500";
    if (recommendation.type === "partner-discount") return "border-l-amber-500";
    if (recommendation.priority === 1) return "border-l-primary";
    return "border-l-muted-foreground";
  };

  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-md border-l-4",
        getBorderColor(),
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
            
            {/* Display partner discount info if available */}
            {recommendation.type === "partner-discount" && recommendation.partnerInfo && (
              <div className="mt-2 text-sm">
                <div className="flex items-center gap-1 text-amber-600 font-medium">
                  <Gift className="h-4 w-4" />
                  {recommendation.partnerInfo.discountPercentage && (
                    <span>{recommendation.partnerInfo.discountPercentage}% off</span>
                  )}
                </div>
                {recommendation.partnerInfo.discountCode && (
                  <div className="mt-1 bg-amber-50 border border-amber-200 p-1.5 rounded text-amber-700 font-mono text-xs flex justify-between items-center">
                    <span>{recommendation.partnerInfo.discountCode}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-xs hover:bg-amber-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(recommendation.partnerInfo?.discountCode || '');
                        window.dispatchEvent(new CustomEvent('show-toast', {
                          detail: {
                            title: "Code copied!",
                            description: `Discount code copied to clipboard`
                          }
                        }));
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                )}
                {recommendation.partnerInfo.expiresAt && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Expires: {new Date(recommendation.partnerInfo.expiresAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
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
