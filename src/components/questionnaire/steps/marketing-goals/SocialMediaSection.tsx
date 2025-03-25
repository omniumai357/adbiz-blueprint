
import { FC } from "react";
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQuestionnaireContext } from "@/contexts/questionnaire-context";

const SocialMediaSection: FC = () => {
  const { form } = useQuestionnaireContext();
  const hasSocialMedia = form.watch("hasSocialMedia");
  const platformsUsed = form.watch("platformsUsed") || [];
  
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="hasSocialMedia"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Do you have social media accounts for your business?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-row space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="social-yes" />
                  <label htmlFor="social-yes">Yes</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="social-no" />
                  <label htmlFor="social-no">No</label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {hasSocialMedia === "yes" && (
        <FormField
          control={form.control}
          name="platformsUsed"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Which platforms do you use? (Select all that apply)</FormLabel>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: "facebook", label: "Facebook" },
                  { id: "instagram", label: "Instagram" },
                  { id: "twitter", label: "Twitter" },
                  { id: "linkedin", label: "LinkedIn" },
                  { id: "youtube", label: "YouTube" },
                  { id: "tiktok", label: "TikTok" },
                  { id: "pinterest", label: "Pinterest" },
                  { id: "other", label: "Other" },
                ].map((platform) => (
                  <FormField
                    key={platform.id}
                    control={form.control}
                    name="platformsUsed"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={platform.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(platform.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, platform.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== platform.id
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {platform.label}
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
      )}
      
      {platformsUsed.includes("facebook") && (
        <FormField
          control={form.control}
          name="facebookUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facebook Page URL</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="https://facebook.com/yourbusiness"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      {platformsUsed.includes("instagram") && (
        <FormField
          control={form.control}
          name="instagramHandle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instagram Handle</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="@yourbusiness"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      {platformsUsed.includes("twitter") && (
        <FormField
          control={form.control}
          name="twitterHandle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Twitter Handle</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="@yourbusiness"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      {platformsUsed.includes("linkedin") && (
        <FormField
          control={form.control}
          name="linkedinUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn URL</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="https://linkedin.com/company/yourbusiness"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      {platformsUsed.includes("other") && (
        <FormField
          control={form.control}
          name="otherSocialMedia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Other Social Media Platforms</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Please specify other platforms and your handles/URLs"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default SocialMediaSection;
