import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/ui/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle
} from "@/components/ui/sheet";
import { FormValidationMessage } from "@/components/ui/form-validation-message";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import QuestionnaireProgress from "./QuestionnaireProgress";
import FileUploadSection from "./FileUploadSection";
import ReviewSection from "./ReviewSection";

const businessFormSchema = z.object({
  // Step 1: Basic Business Information
  businessName: z.string().min(1, "Business name is required"),
  industry: z.string().min(1, "Industry is required"),
  otherIndustry: z.string().optional(),
  hasBusinessLicense: z.enum(["yes", "no"]).optional(),
  businessLicenseNumber: z.string().optional(),
  businessDescription: z.string()
    .min(50, "Please provide at least 50 characters")
    .max(1000, "Please keep your description under 1000 characters"),
  yearsInBusiness: z.string().optional(),
  businessSize: z.string().optional(),
  serviceArea: z.string().min(1, "Service area is required"),
  
  // Step 2: Branding & Contact Information
  slogan: z.string().optional(),
  missionStatement: z.string().optional(),
  hasLogo: z.enum(["yes", "no"]).optional(),
  needLogoDesign: z.enum(["yes", "no"]).optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  phoneNumber: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  website: z.string().url().optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  
  // Step 3: Marketing Goals & Online Presence
  hasSocialMedia: z.enum(["yes", "no"]).optional(),
  platformsUsed: z.array(z.string()).optional(),
  facebookUrl: z.string().url().optional().or(z.literal("")),
  instagramHandle: z.string().optional(),
  otherSocialMedia: z.string().optional(),
  marketingGoals: z.array(z.string()).min(1, "Please select at least one marketing goal"),
  
  // Step 4: Target Audience & Unique Selling Points
  targetAudience: z.string().optional(),
  uniqueSellingPoints: z.string().optional(),
  competitorNames: z.string().optional(),
});

type BusinessFormValues = z.infer<typeof businessFormSchema>;

const BusinessQuestionnaireForm = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // File upload state
  const [files, setFiles] = useState<{
    logo: File | null;
    images: File[];
    videos: File[];
    documents: File[];
  }>({
    logo: null,
    images: [],
    videos: [],
    documents: []
  });
  
  const [uploadProgress, setUploadProgress] = useState<Record<string, { name: string; progress: number }>>({});
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      businessName: "",
      industry: "",
      otherIndustry: "",
      businessDescription: "",
      serviceArea: "",
      slogan: "",
      missionStatement: "",
      primaryColor: "#ffffff",
      secondaryColor: "#ffffff",
      accentColor: "#ffffff",
      phoneNumber: "",
      email: "",
      website: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      otherSocialMedia: "",
      marketingGoals: [],
      targetAudience: "",
      uniqueSellingPoints: "",
      competitorNames: "",
    },
  });
  
  const watchHasBusinessLicense = form.watch("hasBusinessLicense");
  const watchHasLogo = form.watch("hasLogo");
  const watchHasSocialMedia = form.watch("hasSocialMedia");
  const watchPlatformsUsed = form.watch("platformsUsed") || [];
  
  const nextStep = () => {
    const currentStepData = getStepFields(step);
    const isValid = currentStepData.every(field => {
      const fieldState = form.getFieldState(field as any);
      return !fieldState.invalid;
    });
    
    if (isValid) {
      if (step < 5) {
        setStep(prev => prev + 1);
        window.scrollTo(0, 0);
      }
    } else {
      // Trigger validation for current step fields
      form.trigger(currentStepData as any);
    }
  };
  
  const prevStep = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const getStepFields = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return [
          "businessName", 
          "industry", 
          "businessDescription", 
          "serviceArea"
        ];
      case 2:
        return [
          "phoneNumber", 
          "email"
        ];
      case 3:
        return [
          "marketingGoals"
        ];
      case 4:
        return []; // File upload step doesn't have required fields
      case 5:
        return []; // Review step
      default:
        return [];
    }
  };
  
  const handleFileChange = (fileType: keyof typeof files, newFiles: File | File[] | null) => {
    if (fileType === "logo") {
      setFiles(prev => ({ ...prev, logo: newFiles as File }));
    } else {
      setFiles(prev => ({ 
        ...prev, 
        [fileType]: Array.isArray(newFiles) ? [...newFiles] : []
      }));
    }
  };
  
  const removeFile = (fileType: keyof typeof files, index?: number) => {
    if (fileType === "logo") {
      setFiles(prev => ({ ...prev, logo: null }));
    } else if (index !== undefined) {
      setFiles(prev => ({
        ...prev,
        [fileType]: prev[fileType].filter((_, i) => i !== index)
      }));
    }
  };
  
  const uploadFiles = async (businessId: string) => {
    setIsSubmitting(true);
    
    try {
      const uploadedFiles: Record<string, string[]> = {
        logo: [],
        images: [],
        videos: [],
        documents: []
      };
      
      // Upload logo if exists
      if (files.logo) {
        const fileExt = files.logo.name.split('.').pop();
        const fileName = `${businessId}/logo.${fileExt}`;
        
        const { error, data } = await supabase.storage
          .from('business-assets')
          .upload(fileName, files.logo, {
            cacheControl: '3600',
            upsert: true
          });
          
        if (error) throw error;
        
        uploadedFiles.logo.push(fileName);
      }
      
      // Upload other file types
      const fileTypes: Array<keyof typeof files> = ["images", "videos", "documents"];
      
      for (const type of fileTypes) {
        for (let i = 0; i < files[type].length; i++) {
          const file = files[type][i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${businessId}/${type}/${Date.now()}-${i}.${fileExt}`;
          
          setUploadProgress(prev => ({
            ...prev,
            [`${type}-${i}`]: {
              name: file.name,
              progress: 0
            }
          }));
          
          const { error, data } = await supabase.storage
            .from('business-assets')
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: true
            });
            
          if (error) throw error;
          
          uploadedFiles[type].push(fileName);
          
          setUploadProgress(prev => ({
            ...prev,
            [`${type}-${i}`]: {
              name: file.name,
              progress: 100
            }
          }));
        }
      }
      
      return uploadedFiles;
    } catch (error: any) {
      console.error('Error uploading files:', error);
      setUploadError(error.message || 'Error uploading files. Please try again.');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const onSubmit = async (data: BusinessFormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to submit the questionnaire",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create the business record first
      const { data: businessData, error: businessError } = await supabase
        .from('business_questionnaires')
        .insert({
          user_id: user.id,
          business_name: data.businessName,
          industry: data.industry,
          other_industry: data.otherIndustry,
          business_description: data.businessDescription,
          years_in_business: data.yearsInBusiness,
          business_size: data.businessSize,
          service_area: data.serviceArea,
          has_business_license: data.hasBusinessLicense === 'yes',
          business_license_number: data.businessLicenseNumber,
          slogan: data.slogan,
          mission_statement: data.missionStatement,
          has_logo: data.hasLogo === 'yes',
          need_logo_design: data.needLogoDesign === 'yes',
          brand_colors: {
            primary: data.primaryColor,
            secondary: data.secondaryColor,
            accent: data.accentColor
          },
          contact_info: {
            phone: data.phoneNumber,
            email: data.email,
            website: data.website,
            address: data.address,
            city: data.city,
            state: data.state,
            zip_code: data.zipCode
          },
          social_media: {
            has_social_media: data.hasSocialMedia === 'yes',
            platforms: data.platformsUsed,
            facebook_url: data.facebookUrl,
            instagram_handle: data.instagramHandle,
            other: data.otherSocialMedia
          },
          marketing_goals: data.marketingGoals,
          target_audience: data.targetAudience,
          unique_selling_points: data.uniqueSellingPoints
        })
        .select('id')
        .single();
      
      if (businessError) throw businessError;
      
      const businessId = businessData.id;
      
      // Then upload the files
      const uploadedFiles = await uploadFiles(businessId);
      
      if (uploadedFiles) {
        // Update the business record with the file info
        const { error: updateError } = await supabase
          .from('business_questionnaires')
          .update({
            uploaded_files: uploadedFiles
          })
          .eq('id', businessId);
        
        if (updateError) throw updateError;
      }
      
      toast({
        title: "Questionnaire submitted",
        description: "Thank you! We'll review your information and be in touch soon.",
      });
      
      // Reset form after successful submission
      form.reset();
      setStep(1);
      setFiles({
        logo: null,
        images: [],
        videos: [],
        documents: []
      });
      setUploadProgress({});
      setUploadError(null);
      setShowReview(false);
    } catch (error: any) {
      console.error('Submission error:', error);
      toast({
        title: "Submission failed",
        description: error.message || "There was a problem submitting your questionnaire. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Business Onboarding Questionnaire
      </h2>
      
      <QuestionnaireProgress currentStep={step} />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Step 1: Basic Business Information */}
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
                        <Input {...field} />
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
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="">Select Industry</option>
                          <option value="cleaning">Cleaning Services</option>
                          <option value="plumbing">Plumbing</option>
                          <option value="electrical">Electrical</option>
                          <option value="painting">Painting</option>
                          <option value="landscaping">Landscaping</option>
                          <option value="flooring">Flooring</option>
                          <option value="construction">Construction</option>
                          <option value="homeRepair">Home Repair</option>
                          <option value="other">Other (specify below)</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {form.watch("industry") === "other" && (
                  <FormField
                    control={form.control}
                    name="otherIndustry"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>If Other, please specify:</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                    <FormItem>
                      <FormLabel>Do you have a business license?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="license-yes" />
                            <Label htmlFor="license-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="license-no" />
                            <Label htmlFor="license-no">No</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {watchHasBusinessLicense === "yes" && (
                  <FormField
                    control={form.control}
                    name="businessLicenseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business License Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <FormField
                  control={form.control}
                  name="businessDescription"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Business Description (what do you do?) *</FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={3} 
                          placeholder="Describe your business and the services you provide..."
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="yearsInBusiness"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years in Business</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="">Select Option</option>
                          <option value="new">Just starting (less than 1 year)</option>
                          <option value="1-3">1-3 years</option>
                          <option value="4-7">4-7 years</option>
                          <option value="8-15">8-15 years</option>
                          <option value="15+">15+ years</option>
                        </select>
                      </FormControl>
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
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="">Select Option</option>
                          <option value="solo">Solo (just myself)</option>
                          <option value="small">Small (2-5 employees)</option>
                          <option value="medium">Medium (6-15 employees)</option>
                          <option value="large">Large (16+ employees)</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="serviceArea"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Service Area/Location *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="E.g., San Francisco Bay Area, Greater Chicago, etc."
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
          
          {/* Step 2: Branding & Contact Information */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-700">
                Branding & Contact Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="slogan"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Slogan or Tagline</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="E.g., 'We clean so you don't have to'"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="missionStatement"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Mission Statement</FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={3} 
                          placeholder="What is your business mission or purpose?"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="hasLogo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Do you have a logo?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="logo-yes" />
                            <Label htmlFor="logo-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="logo-no" />
                            <Label htmlFor="logo-no">No</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {watchHasLogo === "no" && (
                  <FormField
                    control={form.control}
                    name="needLogoDesign"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Would you like us to design a logo for you?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex space-x-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="design-yes" />
                              <Label htmlFor="design-yes">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="design-no" />
                              <Label htmlFor="design-no">No</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <div className="md:col-span-2">
                  <Label className="block text-sm font-medium mb-1">
                    Brand Color Preferences
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="primaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-gray-500">Primary Color</FormLabel>
                          <FormControl>
                            <Input
                              type="color"
                              className="h-10 p-1 cursor-pointer"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="secondaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-gray-500">Secondary Color</FormLabel>
                          <FormControl>
                            <Input
                              type="color"
                              className="h-10 p-1 cursor-pointer"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="accentColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-gray-500">Accent Color</FormLabel>
                          <FormControl>
                            <Input
                              type="color"
                              className="h-10 p-1 cursor-pointer"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
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
                        <Input {...field} type="tel" />
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
                        <Input {...field} type="email" />
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
                        <Input 
                          {...field} 
                          type="url" 
                          placeholder="https://www.yourbusiness.com" 
                        />
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
            </div>
          )}
          
          {/* Step 3: Marketing Goals & Presence */}
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
                    <FormItem>
                      <FormLabel>Do you have social media accounts for your business?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="social-yes" />
                            <Label htmlFor="social-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="social-no" />
                            <Label htmlFor="social-no">No</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {watchHasSocialMedia === "yes" && (
                  <FormField
                    control={form.control}
                    name="platformsUsed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Which platforms do you use? (Select all that apply)</FormLabel>
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
                            <div key={platform.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`platform-${platform.id}`}
                                checked={field.value?.includes(platform.id)}
                                onCheckedChange={(checked) => {
                                  const updatedPlatforms = checked
                                    ? [...(field.value || []), platform.id]
                                    : (field.value || []).filter((value) => value !== platform.id);
                                  field.onChange(updatedPlatforms);
                                }}
                              />
                              <Label htmlFor={`platform-${platform.id}`}>{platform.label}</Label>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                {watchPlatformsUsed.includes("facebook") && (
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
                
                {watchPlatformsUsed.includes("instagram") && (
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
                
                {watchPlatformsUsed.includes("other") && (
                  <FormField
                    control={form.control}
                    name="otherSocialMedia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Other Social Media Platforms</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            rows={2}
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
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What are your marketing goals? (Select all that apply) *</FormLabel>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                          { id: "moreLeads", label: "Generate more leads" },
