
import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ResponsiveFormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  isLoading?: boolean;
}

/**
 * A responsive form section component that provides consistent styling
 * and layout for form sections across the application
 */
const ResponsiveFormSection: React.FC<ResponsiveFormSectionProps> = ({
  title,
  description,
  children,
  className,
  contentClassName,
  isLoading = false
}) => {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl">{title}</CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className={cn("", contentClassName)}>
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
};

export default ResponsiveFormSection;
