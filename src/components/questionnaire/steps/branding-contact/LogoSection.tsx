
import { FC } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useQuestionnaireContext } from "@/contexts/questionnaire-context";

const LogoSection: FC = () => {
  const { form } = useQuestionnaireContext();
  const hasLogo = form.watch("hasLogo");

  return (
    <>
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
    </>
  );
};

export default LogoSection;
