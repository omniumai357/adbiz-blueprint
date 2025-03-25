
import { FC } from "react";
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuestionnaireContext } from "@/contexts/questionnaire-context";

interface MarketingGoalsSelectionProps {
  marketingGoalOptions: Array<{ value: string; label: string }>;
}

const MarketingGoalsSelection: FC<MarketingGoalsSelectionProps> = ({ marketingGoalOptions }) => {
  const { form } = useQuestionnaireContext();
  
  return (
    <FormField
      control={form.control}
      name="marketingGoals"
      render={() => (
        <FormItem>
          <div className="mb-4">
            <FormLabel>What are your marketing goals? (Select all that apply) *</FormLabel>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {marketingGoalOptions.map((goal) => (
              <FormField
                key={goal.value}
                control={form.control}
                name="marketingGoals"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={goal.value}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(goal.value)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, goal.value])
                              : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== goal.value
                                  )
                                )
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {goal.label}
                      </FormLabel>
                    </FormItem>
                  )
                }}
              />
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default MarketingGoalsSelection;
