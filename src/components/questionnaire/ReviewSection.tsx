
import { FC } from "react";
import { Button } from "@/components/ui/button";

interface ReviewSectionProps {
  formData: any;
  files: {
    logo: File | null;
    images: File[];
    videos: File[];
    documents: File[];
  };
  onShowReview: () => void;
}

const ReviewSection: FC<ReviewSectionProps> = ({ formData, files, onShowReview }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-700">
        Review Your Information
      </h3>
      
      <p className="text-muted-foreground">
        You're almost done! Please review your information before submitting. You can go back to previous steps to make any changes.
      </p>
      
      <div className="bg-secondary/30 p-6 rounded-lg">
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-3">Business Summary</h4>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
              <div>
                <p className="text-sm font-medium">Business Name</p>
                <p className="text-muted-foreground">{formData.businessName}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Industry</p>
                <p className="text-muted-foreground">{formData.industry}</p>
              </div>
              
              <div className="col-span-1 md:col-span-2 mt-2">
                <p className="text-sm font-medium">Business Description</p>
                <p className="text-muted-foreground max-h-20 overflow-auto">
                  {formData.businessDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-3">Contact Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
            <div>
              <p className="text-sm font-medium">Phone</p>
              <p className="text-muted-foreground">{formData.phoneNumber}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-muted-foreground">{formData.email}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-3">Marketing Goals</h4>
          <div className="flex flex-wrap gap-2">
            {formData.marketingGoals?.map((goal: string) => (
              <span 
                key={goal} 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary"
              >
                {goal}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-medium mb-3">Uploaded Files</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-background rounded p-3 text-center">
              <p className="font-medium mb-1">Logo</p>
              <p className="text-sm text-muted-foreground">
                {files.logo ? '1 file' : 'None'}
              </p>
            </div>
            
            <div className="bg-background rounded p-3 text-center">
              <p className="font-medium mb-1">Images</p>
              <p className="text-sm text-muted-foreground">
                {files.images.length} files
              </p>
            </div>
            
            <div className="bg-background rounded p-3 text-center">
              <p className="font-medium mb-1">Videos</p>
              <p className="text-sm text-muted-foreground">
                {files.videos.length} files
              </p>
            </div>
            
            <div className="bg-background rounded p-3 text-center">
              <p className="font-medium mb-1">Documents</p>
              <p className="text-sm text-muted-foreground">
                {files.documents.length} files
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center mt-6">
        <Button
          type="button"
          className="w-full md:w-auto"
          onClick={onShowReview}
        >
          Show Full Review
        </Button>
      </div>
      
      <div className="bg-primary/10 p-4 rounded-md">
        <h4 className="text-sm font-medium mb-2">What happens next?</h4>
        <ol className="list-decimal list-inside text-sm space-y-1 text-muted-foreground ml-2">
          <li>Our team will review your information and files</li>
          <li>We'll create custom marketing materials based on your questionnaire</li>
          <li>You'll receive a notification when your materials are ready for review</li>
          <li>We may contact you if we need any additional information</li>
        </ol>
      </div>
    </div>
  );
};

export default ReviewSection;
