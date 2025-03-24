
import { cn } from "@/lib/utils";
import { Package } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

interface PackageCardProps {
  pkg: Package;
  className?: string;
}

export const PackageCard = ({ pkg, className }: PackageCardProps) => {
  return (
    <div 
      className={cn(
        "relative flex flex-col p-6 bg-card border rounded-lg card-hover transition-all duration-300",
        pkg.popular ? "border-primary shadow-md" : "border-border",
        className
      )}
    >
      {pkg.popular && (
        <div className="absolute top-0 right-0 -translate-y-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
          Popular
        </div>
      )}
      
      <div className="mb-5">
        <h3 className="text-lg font-semibold">{pkg.title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{pkg.description}</p>
      </div>
      
      <div className="mb-6">
        <span className="text-3xl font-bold">${pkg.price}</span>
        {pkg.category === 'monthly' && <span className="text-muted-foreground">/mo</span>}
      </div>
      
      <ul className="space-y-3 mb-8">
        {pkg.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <div className="mt-auto">
        <Button 
          asChild 
          className="w-full button-transition hover:shadow-md"
          variant={pkg.popular ? "default" : "outline"}
        >
          <Link to={`/checkout?package=${pkg.id}`}>
            Choose Plan
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default PackageCard;
