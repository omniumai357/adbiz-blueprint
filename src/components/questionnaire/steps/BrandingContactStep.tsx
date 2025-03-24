
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";

interface BrandingContactStepProps {
  form: UseFormReturn<any>;
  onNext: () => void;
  onPrev: () => void;
}

const BrandingContactStep: FC<BrandingContactStepProps> = ({ form, onNext, onPrev }) => {
  const hasLogo = form.watch("hasLogo");

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-700">
        Branding & Contact Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <FormField
            control={form.control}
            name="slogan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slogan or Tagline</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="E.g., 'We clean so you don't have to'"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="md:col-span-2">
          <FormField
            control={form.control}
            name="missionStatement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mission Statement</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="What is your business mission or purpose?"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="hasLogo"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Do you have a logo?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="logo-yes" />
                    <label htmlFor="logo-yes">Yes</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="logo-no" />
                    <label htmlFor="logo-no">No</label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {hasLogo === "no" && (
          <FormField
            control={form.control}
            name="needLogoDesign"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Would you like us to design a logo for you?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-row space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="design-yes" />
                      <label htmlFor="design-yes">Yes</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="design-no" />
                      <label htmlFor="design-no">No</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <div className="md:col-span-2">
          <FormLabel className="block mb-2">Brand Color Preferences</FormLabel>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="primaryColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground">Primary Color</FormLabel>
                  <FormControl>
                    <Input 
                      type="color" 
                      {...field} 
                      className="h-10 p-1 cursor-pointer"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="secondaryColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground">Secondary Color</FormLabel>
                  <FormControl>
                    <Input 
                      type="color" 
                      {...field} 
                      className="h-10 p-1 cursor-pointer"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="accentColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground">Accent Color</FormLabel>
                  <FormControl>
                    <Input 
                      type="color" 
                      {...field} 
                      className="h-10 p-1 cursor-pointer"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number *</FormLabel>
              <FormControl>
                <Input {...field} type="tel" placeholder="(555) 555-5555" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address *</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="you@example.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website (if you have one)</FormLabel>
              <FormControl>
                <Input {...field} type="url" placeholder="https://www.yourbusiness.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Address</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Street address" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State/Province</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ZIP/Postal Code</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="flex justify-between mt-8">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
        >
          Back
        </Button>
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

export default BrandingContactStep;
