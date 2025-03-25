import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useProfile } from '@/hooks/data/useProfile';
import { useToast } from '@/hooks/use-toast';

export const useCustomerInfo = () => {
  const { user } = useAuth();
  const { profile, isLoading, error } = useProfile(user?.id);
  const { toast } = useToast();
  
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });
  
  const [validationErrors, setValidationErrors] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });
  
  // Update customer info when profile data loads
  useEffect(() => {
    if (profile) {
      setCustomerInfo(prevInfo => ({
        ...prevInfo,
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        company: profile.company || '',
        // Don't use email and phone if they don't exist on the profile type
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
      address: '',
      city: '',
      state: '',
      zipCode: '',
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
    
    if (!customerInfo.address.trim()) {
      errors.address = 'Address is required';
      isValid = false;
    }
    
    if (!customerInfo.city.trim()) {
      errors.city = 'City is required';
      isValid = false;
    }
    
    if (!customerInfo.state.trim()) {
      errors.state = 'State is required';
      isValid = false;
    }
    
    if (!customerInfo.zipCode.trim()) {
      errors.zipCode = 'ZIP code is required';
      isValid = false;
    } else if (!/^\d{5}(-\d{4})?$/.test(customerInfo.zipCode)) {
      errors.zipCode = 'Invalid ZIP code format';
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
