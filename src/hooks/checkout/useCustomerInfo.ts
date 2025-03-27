
import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth';
import { useProfile } from '@/hooks/data/useProfile';
import { useToast } from '@/hooks/use-toast';
import { CustomerInfo } from '@/types/checkout';

export const useCustomerInfo = () => {
  const { user } = useAuth();
  const { profile, isLoading, error } = useProfile(user?.id);
  const { toast } = useToast();
  
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    invoiceDeliveryMethod: 'email'
  });
  
  const [validationErrors, setValidationErrors] = useState({
    firstName: '',
    lastName: '',
  });
  
  // Update customer info when profile data loads
  useEffect(() => {
    if (profile) {
      setCustomerInfo(prevInfo => ({
        ...prevInfo,
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        company: profile.company || '',
        // Don't try to use fields that don't exist on the profile
      }));
    }
  }, [profile]);
  
  // Handle errors from profile loading
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading profile",
        description: "There was a problem loading your profile information.",
        variant: "destructive"
      });
      console.error("Profile loading error:", error);
    }
  }, [error, toast]);
  
  const updateCustomerInfo = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error when field is updated
    if (validationErrors[field as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };
  
  const validateCustomerInfo = () => {
    const errors = {
      firstName: '',
      lastName: '',
    };
    
    let isValid = true;
    
    if (!customerInfo.firstName.trim()) {
      errors.firstName = 'First name is required';
      isValid = false;
    }
    
    if (!customerInfo.lastName.trim()) {
      errors.lastName = 'Last name is required';
      isValid = false;
    }
    
    setValidationErrors(errors);
    return isValid;
  };
  
  return {
    customerInfo,
    updateCustomerInfo,
    validateCustomerInfo,
    validationErrors,
    isLoading
  };
};
