
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { useResponsive } from '@/hooks/useResponsive';

/**
 * ContactCTA Component
 * 
 * Displays a call-to-action section encouraging users to contact
 * the team for assistance with choosing service packages.
 * 
 * This component is strategically placed on the Services page
 * to convert interested users into leads.
 */
export const ContactCTA = () => {
  const { isMobile } = useResponsive();
  
  return (
    <div 
      id="contact-cta" 
      className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 rounded-lg mb-6 sm:mb-8 border border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <h3 className="text-lg sm:text-xl font-semibold mb-2">Need Assistance?</h3>
      <p className="mb-4 text-sm sm:text-base text-gray-600 dark:text-gray-300">
        Our team is ready to help you choose the right package for your business needs.
      </p>
      <Button 
        className="w-full sm:w-auto" 
        size={isMobile ? "sm" : "default"}
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        Contact Us
      </Button>
    </div>
  );
};
