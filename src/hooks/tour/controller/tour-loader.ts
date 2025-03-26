
import { TourPath, TourStep } from '@/contexts/tour/types';

/**
 * Loads tour paths based on current route
 * @param currentPathname The current route pathname
 * @returns Promise resolving to the appropriate tour paths
 */
export const loadTourPathsForRoute = async (currentPathname: string): Promise<TourPath[]> => {
  if (currentPathname.includes("/services")) {
    return [{
      id: "services-tour",
      name: "Services Tour",
      steps: [
        {
          id: "service-welcome",
          elementId: "service-header",
          title: "Our Services",
          content: "Welcome to our services page. Here you'll find all the services we offer.",
          position: "bottom",
          target: "service-header" // Add target property
        },
        {
          id: "service-pricing",
          elementId: "pricing-section",
          title: "Service Pricing",
          content: "Our pricing is transparent and competitive.",
          position: "top",
          target: "pricing-section" // Add target property
        },
        {
          id: "service-details",
          elementId: "details-section",
          title: "Service Details",
          content: "Click on any service to see more details.",
          position: "right",
          target: "details-section" // Add target property
        }
      ]
    }];
  } else if (currentPathname === "/") {
    return [{
      id: "home-tour",
      name: "Home Tour",
      steps: [
        {
          id: "home-welcome",
          elementId: "welcome-section",
          title: "Welcome",
          content: "Welcome to our site! This tour will guide you through key features.",
          position: "bottom",
          target: "welcome-section", // Add target property
          path: {
            style: "dashed",
            targetElementId: "welcome-section"
          }
        },
        {
          id: "home-features",
          elementId: "features-section",
          title: "Features",
          content: "Check out our key features here.",
          position: "bottom",
          target: "features-section" // Add target property
        }
      ]
    }];
  } else if (currentPathname.includes("/contact")) {
    return [{
      id: "contact-tour",
      name: "Contact Tour",
      steps: [
        {
          id: "contact-intro",
          elementId: "contact-header",
          title: "Contact Us",
          content: "Here you can find our contact information.",
          position: "bottom",
          target: "contact-header" // Add target property
        },
        {
          id: "contact-form",
          elementId: "contact-form",
          title: "Contact Form",
          content: "Fill out this form to send us a message.",
          position: "left",
          target: "contact-form" // Add target property
        },
        {
          id: "contact-info",
          elementId: "contact-info",
          title: "Contact Information",
          content: "Here's our address and phone number.",
          position: "top",
          target: "contact-info" // Add target property
        }
      ]
    }];
  } else if (currentPathname.includes("/checkout")) {
    return [{
      id: "checkout-tour",
      name: "Checkout Tour",
      steps: [
        {
          id: "checkout-welcome",
          elementId: "checkout-header",
          title: "Checkout",
          content: "Welcome to the checkout page. Follow the steps to complete your purchase.",
          position: "bottom",
          target: "checkout-header" // Add target property
        }
      ]
    }];
  } else {
    // Default tour for any other page
    return [{
      id: "default-tour",
      name: "Site Tour",
      steps: [
        {
          id: "default-welcome",
          elementId: "page-header",
          title: "Welcome",
          content: "Welcome to our site! Feel free to explore and let us know if you have any questions.",
          position: "bottom",
          target: "page-header" // Add target property
        }
      ]
    }];
  }
};
