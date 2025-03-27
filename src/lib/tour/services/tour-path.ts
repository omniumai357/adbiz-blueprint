
import { TourPath, TourStep } from '@/contexts/tour/types';

/**
 * Create a tour path for the services page
 */
export const createServicesPageTour = (): TourPath => {
  const steps: TourStep[] = [
    {
      id: 'services-intro',
      elementId: 'services-heading',
      target: '#services-heading',
      title: 'Our Services',
      content: 'Explore our wide range of services tailored to your business needs.',
      position: 'bottom',
      placement: 'bottom',
      animation: 'fade-in'
    },
    {
      id: 'services-categories',
      elementId: 'service-categories',
      target: '#service-categories',
      title: 'Service Categories',
      content: 'Browse services by category to find what you need.',
      position: 'bottom',
      placement: 'bottom',
      animation: 'fade-in'
    },
    {
      id: 'service-details',
      elementId: 'service-details',
      target: '#service-details',
      title: 'Service Details',
      content: 'Click on any service to view detailed information and pricing.',
      position: 'right',
      placement: 'right',
      animation: 'slide-in'
    }
  ];
  
  return {
    id: 'services-tour',
    name: 'Services Tour',
    description: 'A guided tour of our services page',
    steps,
    route: '/services',
    allowSkip: true,
    showProgress: true,
    autoStart: false
  };
};
