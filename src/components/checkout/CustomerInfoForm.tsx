
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  website: string;
}

interface CustomerInfoFormProps {
  customerInfo: CustomerInfo;
  onChange: (info: CustomerInfo) => void;
}

const CustomerInfoForm = ({ customerInfo, onChange }: CustomerInfoFormProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({
      ...customerInfo,
      [name]: value
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Customer Information</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input 
            id="firstName" 
            name="firstName" 
            value={customerInfo.firstName} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input 
            id="lastName" 
            name="lastName" 
            value={customerInfo.lastName} 
            onChange={handleInputChange} 
            required 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          name="email" 
          type="email" 
          value={customerInfo.email} 
          onChange={handleInputChange} 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input 
          id="phone" 
          name="phone" 
          value={customerInfo.phone} 
          onChange={handleInputChange} 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="company">Company</Label>
        <Input 
          id="company" 
          name="company" 
          value={customerInfo.company} 
          onChange={handleInputChange} 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="website">Website (optional)</Label>
        <Input 
          id="website" 
          name="website" 
          value={customerInfo.website} 
          onChange={handleInputChange} 
        />
      </div>
    </div>
  );
};

export default CustomerInfoForm;
