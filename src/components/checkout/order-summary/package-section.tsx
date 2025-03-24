
import React from "react";
import { Package } from "lucide-react";
import OrderBaseItem from "./order-base-item";
import { AddOnItem } from "../add-on-item";
import { Separator } from "@/components/ui/separator";

interface PackageSectionProps {
  packageName: string;
  packagePrice: number;
  selectedAddOns: AddOnItem[];
}

const PackageSection = ({ packageName, packagePrice, selectedAddOns }: PackageSectionProps) => {
  return (
    <div className="space-y-3">
      <OrderBaseItem 
        name={packageName} 
        price={packagePrice} 
        icon={<Package className="h-4 w-4 mr-2 text-muted-foreground" />} 
      />
      
      {selectedAddOns.length > 0 && (
        <>
          <Separator className="my-2" />
          <div className="text-sm font-medium mb-2">Add-ons:</div>
          {selectedAddOns.map((addon) => (
            <OrderBaseItem 
              key={addon.id} 
              name={addon.name} 
              price={addon.price} 
            />
          ))}
        </>
      )}
    </div>
  );
};

export default PackageSection;
