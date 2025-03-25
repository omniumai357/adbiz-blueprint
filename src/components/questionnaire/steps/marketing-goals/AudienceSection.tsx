
import { FC } from "react";
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useAudienceForm } from "@/hooks/questionnaire/useAudienceForm";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

const AudienceSection: FC = () => {
  const { form, getCharacterCount } = useAudienceForm();
  
  const MAX_CHARS = 500; // Maximum characters for textareas
  
  return (
    <div className="space-y-6">
      <h4 className="text-lg font-medium text-gray-700">
        Target Audience & Business Positioning
      </h4>
      
      <FormField
        control={form.control}
        name="targetAudience"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-2">
              <FormLabel>Who is your target audience?</FormLabel>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Describe your ideal customers, including demographics, interests, and needs.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Describe your ideal customers, including age range, interests, and pain points"
                className="resize-y min-h-[100px]"
                maxLength={MAX_CHARS}
              />
            </FormControl>
            <div className="text-xs text-muted-foreground text-right">
              {getCharacterCount("targetAudience")}/{MAX_CHARS}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="uniqueSellingPoints"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-2">
              <FormLabel>What makes your business unique?</FormLabel>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Share what sets your business apart from competitors.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="List your unique selling points, special services, or competitive advantages"
                className="resize-y min-h-[100px]"
                maxLength={MAX_CHARS}
              />
            </FormControl>
            <div className="text-xs text-muted-foreground text-right">
              {getCharacterCount("uniqueSellingPoints")}/{MAX_CHARS}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="competitorNotes"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-2">
              <FormLabel>Who are your main competitors?</FormLabel>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">List competitors and what you like or dislike about their approach.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="List your main competitors and what you'd like to do differently"
                className="resize-y min-h-[100px]"
                maxLength={MAX_CHARS}
              />
            </FormControl>
            <div className="text-xs text-muted-foreground text-right">
              {getCharacterCount("competitorNotes")}/{MAX_CHARS}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AudienceSection;
