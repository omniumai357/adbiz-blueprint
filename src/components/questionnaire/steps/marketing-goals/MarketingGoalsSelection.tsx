
import { FC } from "react";
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useMarketingGoalsForm } from "@/hooks/questionnaire/useMarketingGoalsForm";
import { cn } from "@/lib/utils";

interface MarketingGoalsSelectionProps {
  marketingGoalOptions: Array<{ value: string; label: string }>;
}

const MarketingGoalsSelection: FC<MarketingGoalsSelectionProps> = ({ marketingGoalOptions }) => {
  const { form, isGoalSelected, toggleGoalSelection } = useMarketingGoalsForm();
  
  return (
    <FormField
      control={form.control}
      name="marketingGoals"
      render={() => (
        <FormItem>
          <div className="mb-4">
            <FormLabel className="text-base">What are your marketing goals? (Select all that apply) *</FormLabel>
            <p className="text-sm text-muted-foreground mt-1">
              Choose the goals that are most important for your business marketing strategy.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {marketingGoalOptions.map((goal) => (
              <div 
                key={goal.value}
                className={cn(
                  "flex items-start space-x-3 space-y-0 rounded-md border p-3 transition-colors hover:bg-muted/50 cursor-pointer",
                  isGoalSelected(goal.value) && "border-primary bg-primary/5"
                )}
                onClick={() => toggleGoalSelection(goal.value)}
              >
                <FormControl>
                  <Checkbox
                    checked={isGoalSelected(goal.value)}
                    onCheckedChange={() => toggleGoalSelection(goal.value)}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium cursor-pointer">
                    {goal.label}
                  </FormLabel>
                </div>
              </div>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default MarketingGoalsSelection;
