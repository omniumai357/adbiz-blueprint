
import React from "react";
import AddOnItem, { AddOnItem as AddOnItemType } from "../add-on-item";
import { Tag } from "lucide-react";

interface AddOnsSelectorProps {
  availableAddOns: AddOnItemType[];
  selectedAddOns: string[];
  onAddOnToggle: (id: string) => void;
}

/**
 * AddOnsSelector Component
 * 
 * Provides an interface for selecting add-on services during checkout
 */
const AddOnsSelector = ({ 
  availableAddOns, 
  selectedAddOns, 
  onAddOnToggle 
}: AddOnsSelectorProps) => {
  if (!availableAddOns || availableAddOns.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Tag className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Recommended Add-ons</h2>
      </div>
      
      <div className="space-y-3">
        {availableAddOns.map((item) => (
          <AddOnItem
            key={item.id}
            item={item}
            selected={selectedAddOns.includes(item.id)}
            onToggle={() => onAddOnToggle(item.id)}
          />
        ))}
      </div>
      
      {selectedAddOns.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {selectedAddOns.length} add-on{selectedAddOns.length > 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  );
};

export default AddOnsSelector;
