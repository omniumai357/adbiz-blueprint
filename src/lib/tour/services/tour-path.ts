
import { TourPath } from '@/contexts/tour/types';
import { createStep } from '@/lib/tour/core/tourPathFactory';

/**
 * Tour path for the services page
 */
export const servicesTourPath: TourPath = {
  id: 'services-tour',
  name: 'Services Page Tour',
  steps: [
    // Welcome to services
    {
      id: 'services-welcome',
      elementId: 'services-header',
      title: 'Welcome to Our Services',
      content: 'This tour will show you the various services we offer.',
      placement: 'bottom',
      animation: 'fade-in'
    },
    
    // Service categories
    {
      id: 'service-categories',
      elementId: 'service-categories-section',
      title: 'Service Categories',
      content: 'Browse through our different service categories.',
      placement: 'right',
      animation: 'slide-in'
    },
    
    // Service pricing
    {
      id: 'service-pricing',
      elementId: 'pricing-section',
      title: 'Pricing Plans',
      content: 'Compare our different pricing plans to find what suits you best.',
      placement: 'left',
      animation: 'fade-in'
    }
  ],
  allowSkip: true,
  showProgress: true,
  route: '/services'
};
