
import { TourPath, TourStep } from '@/contexts/tour/types';

/**
 * Loads tour paths based on current route
 * @param currentPathname The current route pathname
 * @returns Promise resolving to the appropriate tour paths
 */
export const loadTourPathsForRoute = async (currentPathname: string): Promise<TourPath[]> => {
  if (currentPathname.includes("/services")) {
    const { servicesTourPath } = await import("@/lib/tour/services-tour");
    return [servicesTourPath];
  } else if (currentPathname === "/") {
    const { homeTourPath } = await import("@/lib/tour/home-tour");
    return [homeTourPath];
  } else if (currentPathname.includes("/contact")) {
    const { contactTourPath } = await import("@/lib/tour/contact-tour");
    return [contactTourPath];
  } else if (currentPathname.includes("/checkout")) {
    const { checkoutTourPath } = await import("@/lib/tour/checkout-tour");
    return [checkoutTourPath];
  } else {
    // Default tour for any other page
    const { defaultTourPath } = await import("@/lib/tour/default-tour");
    return [defaultTourPath];
  }
};
