
import React from "react";
import { CheckCircle2, PlusCircle, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/format-utils";

export interface AddOnItem {
  id: string;
  name: string;
  description: string;
  price: number;
  popular?: boolean;
  valueProposition?: string;
}

interface AddOnItemProps {
  item: AddOnItem;
  selected: boolean;
  onToggle: () => void;
}

const AddOnItem = ({ item, selected, onToggle }: AddOnItemProps) => {
  return (
    <div 
      className={cn(
        "relative flex items-center border rounded-lg p-4 cursor-pointer transition-all",
        selected 
          ? "border-primary bg-primary/5" 
          : "border-border hover:border-primary/50 hover:bg-muted/50"
      )}
      onClick={onToggle}
    >
      {item.popular && (
        <div className="absolute top-0 right-0 -translate-y-1/2 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
          Popular
        </div>
      )}
      
      <div className="mr-3">
        {selected ? (
          <CheckCircle2 className="h-5 w-5 text-primary" />
        ) : (
          <PlusCircle className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">{item.name}</h4>
          <div className="flex items-center">
            <span className="font-medium">{formatCurrency(item.price)}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
        {item.valueProposition && (
          <div className="mt-2 text-xs flex items-center text-primary">
            <DollarSign className="h-3 w-3 mr-1" />
            <span>{item.valueProposition}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddOnItem;
