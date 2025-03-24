import { useState } from "react";
import { z } from "zod";
import { useAppForm } from "@/hooks/forms/useAppForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import QuestionnaireProgress from "./QuestionnaireProgress";
import FileUploadSection from "./file-upload/FileUploadSection";
import ReviewSection from "./ReviewSection";
import { FormValidationMessage } from "@/components/ui/form-validation-message";
import { useFileUpload } from "@/hooks/useFileUpload";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/ui/use-toast";

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  industry: z.string().min(1, "Industry is required"),
  otherIndustry: z.string().optional(),
  hasBusinessLicense: z.enum(["yes", "no"]).optional(),
  businessLicenseNumber: z.string().optional(),
  businessDescription: z.string().min(50, "Please provide at least 50 characters"),
  yearsInBusiness: z.string().optional(),
  businessSize: z.string().optional(),
  serviceArea: z.string().min(1, "Service area is required"),
  
  slogan: z.string().optional(),
  missionStatement: z.string().optional(),
  hasLogo: z.enum(["yes", "no"]).optional(),
  needLogoDesign: z.enum(["yes", "no"]).optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  
  phoneNumber: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  website: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  
  hasSocialMedia: z.enum(["yes", "no"]).optional(),
  platformsUsed: z.array(z.string()).optional(),
  facebookUrl: z.string().optional(),
  instagramHandle: z.string().optional(),
  twitterHandle: z.string().optional(),
  linkedinUrl: z.string().optional(),
  otherSocialMedia: z.string().optional(),
  
  marketingGoals: z.array(z.string()).min(1, "Please select at least one goal"),
  targetAudience: z.string().optional(),
  uniqueSellingPoints: z.string().optional(),
  competitorNotes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface BusinessQuestionnaireFormProps {
  onComplete?: (data: any) => void;
}

const BusinessQuestionnaireForm = ({ onComplete }: BusinessQuestionnaireFormProps) => {
  const [step, setStep] = useState(1);
  const [showReview, setShowReview] = useState(false);
  const { toast } = useToast();
  
  const {
    files,
    uploadProgress,
    uploadError,
    uploading,
    handleFileChange,
    onRemoveFile,
    uploadFiles,
    setUploadError
  } = useFileUpload();
  
  const form = useAppForm(formSchema, {
    defaultValues: {
      marketingGoals: [],
      platformsUsed: [],
    },
  });
  
  const { watch } = form;
  
  const hasBusinessLicense = watch("hasBusinessLicense");
  const hasLogo = watch("hasLogo");
  const hasSocialMedia = watch("hasSocialMedia");
  const platformsUsed = watch("platformsUsed") || [];
  
  const nextStep = () => {
    if (step === 1) {
      const { businessName, industry, businessDescription, serviceArea } = form.getValues();
      if (!businessName || !industry || !businessDescription || !serviceArea) {
        form.trigger(["businessName", "industry", "businessDescription", "serviceArea"]);
        return;
      }
    } else if (step === 2) {
      const { phoneNumber, email } = form.getValues();
      if (!phoneNumber || !email) {
        form.trigger(["phoneNumber", "email"]);
        return;
      }
    } else if (step === 3) {
      const { marketingGoals } = form.getValues();
      if (!marketingGoals || marketingGoals.length === 0) {
        form.trigger(["marketingGoals"]);
        return;
      }
    }
    
    setStep((prev) => Math.min(prev + 1, 5));
  };
  
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  
  const onShowReview = () => {
    setShowReview(true);
  };
  
  const onSubmit = async (data: FormValues) => {
    try {
      const businessId = `business-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      const { data: authData } = await supabase.auth.getSession();
      const userId = authData.session?.user?.id;
      
      const formattedData = {
        ...data,
        has_business_license: data.hasBusinessLicense === "yes",
        has_logo: data.hasLogo === "yes",
        need_logo_design: data.needLogoDesign === "yes",
        brand_colors: {
          primary: data.primaryColor,
          secondary: data.secondaryColor,
          accent: data.accentColor,
        },
        contact_info: {
          phone: data.phoneNumber,
          email: data.email,
          website: data.website,
          address: {
            street: data.address,
            city: data.city,
            state: data.state,
            zip: data.zipCode,
          },
        },
        social_media: hasSocialMedia === "yes" ? {
          platforms: data.platformsUsed,
          facebook: data.facebookUrl,
          instagram: data.instagramHandle,
          twitter: data.twitterHandle,
          linkedin: data.linkedinUrl,
          other: data.otherSocialMedia,
        } : null,
      };
      
      const filesUploaded = await uploadFiles(userId || businessId);
      
      if (!filesUploaded) {
        return;
      }
      
      const { error } = await supabase
        .from("business_questionnaires")
        .insert({
          user_id: userId || "system",
          business_name: data.businessName,
          industry: data.industry,
          other_industry: data.otherIndustry,
          business_description: data.businessDescription,
          business_size: data.businessSize,
          years_in_business: data.yearsInBusiness,
          service_area: data.serviceArea,
          business_license_number: data.businessLicenseNumber,
          slogan: data.slogan,
          mission_statement: data.missionStatement,
          has_business_license: data.hasBusinessLicense === "yes",
          has_logo: data.hasLogo === "yes",
          need_logo_design: data.needLogoDesign === "yes",
          brand_colors: {
            primary: data.primaryColor,
            secondary: data.secondaryColor,
            accent: data.accentColor,
          },
          contact_info: {
            phone: data.phoneNumber,
            email: data.email,
            website: data.website,
            address: {
              street: data.address,
              city: data.city,
              state: data.state,
              zip: data.zipCode,
            },
          },
          social_media: hasSocialMedia === "yes" ? {
            platforms: data.platformsUsed,
            facebook: data.facebookUrl,
            instagram: data.instagramHandle,
            twitter: data.twitterHandle,
            linkedin: data.linkedinUrl,
            other: data.otherSocialMedia,
          } : null,
          marketing_goals: data.marketingGoals,
          target_audience: data.targetAudience,
          unique_selling_points: data.uniqueSellingPoints,
          uploaded_files: {
            has_logo: files.logo ? true : false,
            image_count: files.images.length,
            video_count: files.videos.length,
            document_count: files.documents.length,
          },
        });
      
      if (error) {
        console.error("Error saving business data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was a problem saving your information. Please try again.",
        });
        return;
      }
      
      toast({
        title: "Submission successful!",
        description: "Your business information has been saved. Our team will review it shortly.",
      });
      
      if (onComplete) {
        onComplete({
          businessId,
          data: formattedData,
          files,
        });
      }
      
    } catch (error) {
      console.error("Error processing questionnaire:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };
  
  const marketingGoalOptions = [
    { value: "moreLeads", label: "Generate more leads" },
    { value: "brandAwareness", label: "Increase brand awareness" },
    { value: "higherBookings", label: "Get more bookings/appointments" },
    { value: "expandService", label: "Expand service area" },
    { value: "increaseRevenue", label: "Increase revenue" },
    { value: "attractEmployees", label: "Attract employees/contractors" },
    { value: "newWebsite", label: "Create/improve website" },
    { value: "onlineReputation", label: "Improve online reputation" },
    { value: "socialMedia", label: "Grow social media presence" },
    { value: "rebrand", label: "Rebrand business" },
  ];
  
  return (
    <div className="bg-card rounded-lg shadow-sm border p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        Business Information Questionnaire
      </h2>
      
      <QuestionnaireProgress currentStep={step} />
      
      {form.submitError && (
        <FormValidationMessage message={form.submitError} />
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && (
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
                  onClick={nextStep}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}
          
          {step === 2 && (
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
                  onClick={prevStep}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={nextStep}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-700">
                Marketing Goals & Online Presence
              </h3>
              
              <div className="grid grid-cols-1 gap-6">
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
                
                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="targetAudience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Audience</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Describe your ideal customers (age range, demographics, needs, etc.)"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="uniqueSellingPoints"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unique Selling Points</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="What makes your business different from competitors?"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="competitorNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Competitor Information</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="List your main competitors and what you know about their marketing"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={nextStep}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}
          
          {step === 4 && (
            <FileUploadSection
              files={files}
              onFileChange={handleFileChange}
              onRemoveFile={onRemoveFile}
              uploadProgress={uploadProgress}
              uploadError={uploadError}
              hasLogo={hasLogo === "yes"}
            />
          )}
          
          {step === 5 && (
            <ReviewSection
              formData={form.getValues()}
              files={files}
              onShowReview={onShowReview}
            />
          )}
          
          {step === 4 && (
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={nextStep}
              >
                Continue to Review
              </Button>
            </div>
          )}
          
          {step === 5 && (
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={form.isSubmitting || uploading}
              >
                {form.isSubmitting || uploading ? "Processing..." : "Submit Questionnaire"}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default BusinessQuestionnaireForm;
