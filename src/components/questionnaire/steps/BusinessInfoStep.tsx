
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";

interface BusinessInfoStepProps {
  form: UseFormReturn<any>;
  onNext: () => void;
}

const BusinessInfoStep: FC<BusinessInfoStepProps> = ({ form, onNext }) => {
  const hasBusinessLicense = form.watch("hasBusinessLicense");
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-700">
        Basic Business Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="businessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Your business name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry/Sector *</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Industry" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="cleaning">Cleaning Services</SelectItem>
                  <SelectItem value="plumbing">Plumbing</SelectItem>
                  <SelectItem value="electrical">Electrical</SelectItem>
                  <SelectItem value="painting">Painting</SelectItem>
                  <SelectItem value="landscaping">Landscaping</SelectItem>
                  <SelectItem value="flooring">Flooring</SelectItem>
                  <SelectItem value="construction">Construction</SelectItem>
                  <SelectItem value="homeRepair">Home Repair</SelectItem>
                  <SelectItem value="other">Other (specify below)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {form.watch("industry") === "other" && (
          <FormField
            control={form.control}
            name="otherIndustry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Please specify your industry</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Your specific industry" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <FormField
          control={form.control}
          name="hasBusinessLicense"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Do you have a business license?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="license-yes" />
                    <label htmlFor="license-yes">Yes</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="license-no" />
                    <label htmlFor="license-no">No</label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {hasBusinessLicense === "yes" && (
          <FormField
            control={form.control}
            name="businessLicenseNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business License Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Your license number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <div className="md:col-span-2">
          <FormField
            control={form.control}
            name="businessDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Description (what do you do?) *</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Describe your business and the services you provide..."
                    className="min-h-24"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="yearsInBusiness"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years in Business</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Option" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="new">Just starting (less than 1 year)</SelectItem>
                  <SelectItem value="1-3">1-3 years</SelectItem>
                  <SelectItem value="4-7">4-7 years</SelectItem>
                  <SelectItem value="8-15">8-15 years</SelectItem>
                  <SelectItem value="15+">15+ years</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="businessSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Size</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Option" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="solo">Solo (just myself)</SelectItem>
                  <SelectItem value="small">Small (2-5 employees)</SelectItem>
                  <SelectItem value="medium">Medium (6-15 employees)</SelectItem>
                  <SelectItem value="large">Large (16+ employees)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="md:col-span-2">
          <FormField
            control={form.control}
            name="serviceArea"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Area/Location *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="E.g., San Francisco Bay Area, Greater Chicago, etc."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      
      <div className="flex justify-end mt-8">
        <Button
          type="button"
          onClick={onNext}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default BusinessInfoStep;
