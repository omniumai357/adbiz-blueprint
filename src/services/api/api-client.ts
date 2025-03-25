
import { authClient } from "./clients/auth-client";
import { profilesClient } from "./clients/profiles-client";
import { ordersClient } from "./clients/orders-client";
import { packagesClient } from "./clients/packages-client";
import { milestonesClient } from "./clients/milestones-client";
import { adminClient } from "./clients/admin-client";

/**
 * API Client
 * 
 * A centralized service for making API calls to different resources.
 * This creates a separation between the data fetching logic and the UI components.
 */
export const apiClient = {
  /**
   * Authentication
   */
  auth: authClient,
  
  /**
   * User profile
   */
  profiles: profilesClient,
  
  /**
   * Orders
   */
  orders: ordersClient,
  
  /**
   * Packages
   */
  packages: packagesClient,
  
  /**
   * Milestones and rewards
   */
  milestones: milestonesClient,
  
  /**
   * Admin functions
   */
  admin: adminClient
};
