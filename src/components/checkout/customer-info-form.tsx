
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InputField from "./form/input-field";
import FormGrid from "./form/form-grid";
import { CustomerInfoFormProps } from "@/types/checkout";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

/**
 * CustomerInfoForm Component
 * 
 * A responsive form for collecting customer information during checkout
 */
const CustomerInfoForm: React.FC<CustomerInfoFormProps> = ({
  customerInfo,
  onChange,
  isLoading
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...customerInfo, [name]: value });
  };

  const handleDeliveryMethodChange = (value: "email" | "sms" | "both") => {
    onChange({ ...customerInfo, invoiceDeliveryMethod: value });
  };

  const isPhoneRequired = 
    customerInfo.invoiceDeliveryMethod === "sms" || 
    customerInfo.invoiceDeliveryMethod === "both";

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">Customer Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <FormGrid>
            <InputField
              id="firstName"
              name="firstName"
              label="First Name"
              value={customerInfo.firstName || ""}
              onChange={handleChange}
              disabled={isLoading}
              required
              placeholder="Enter your first name"
            />
            <InputField
              id="lastName"
              name="lastName"
              label="Last Name"
              value={customerInfo.lastName || ""}
              onChange={handleChange}
              disabled={isLoading}
              required
              placeholder="Enter your last name"
            />
          </FormGrid>

          <InputField
            id="email"
            name="email"
            label="Email"
            type="email"
            value={customerInfo.email || ""}
            onChange={handleChange}
            disabled={isLoading}
            required
            placeholder="Enter your email address"
          />

          <InputField
            id="phone"
            name="phone"
            label="Phone Number"
            type="tel"
            value={customerInfo.phone || ""}
            onChange={handleChange}
            disabled={isLoading}
            required={isPhoneRequired}
            placeholder="Enter your phone number"
          />

          <InputField
            id="company"
            name="company"
            label="Company Name"
            value={customerInfo.company || ""}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="Enter your company name (optional)"
          />

          <div className="space-y-3">
            <Label className="text-sm font-medium">Invoice Delivery Method</Label>
            <RadioGroup
              value={customerInfo.invoiceDeliveryMethod || "email"}
              onValueChange={(value) => handleDeliveryMethodChange(value as "email" | "sms" | "both")}
              className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4"
            >
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent cursor-pointer">
                <RadioGroupItem value="email" id="delivery-email" />
                <Label htmlFor="delivery-email" className="cursor-pointer">Email</Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent cursor-pointer">
                <RadioGroupItem value="sms" id="delivery-sms" />
                <Label htmlFor="delivery-sms" className="cursor-pointer">SMS</Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent cursor-pointer">
                <RadioGroupItem value="both" id="delivery-both" />
                <Label htmlFor="delivery-both" className="cursor-pointer">Both</Label>
              </div>
            </RadioGroup>
            {isPhoneRequired && !customerInfo.phone && (
              <p className="text-xs text-amber-600">Phone number is required for SMS delivery</p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CustomerInfoForm;
