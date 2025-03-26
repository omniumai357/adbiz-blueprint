
import { authClient } from "./clients/auth-client";
import { profilesClient } from "./clients/profiles-client";
import { ordersClient } from "./clients/orders-client";
import { packagesClient } from "./clients/packages-client";
import { milestonesClient } from "./clients/milestones-client";
import { adminClient } from "./clients/admin-client";
import { apiResponseHandler } from "./response-handler";

/**
 * API Client
 * 
 * A centralized service for making API calls to different resources.
 * This creates a separation between the data fetching logic and the UI components,
 * following the repository pattern for better code organization and testability.
 * 
 * Each domain area (auth, profiles, etc.) has its own client with specific API methods.
 * All API requests should go through this client rather than directly calling Supabase.
 */
export const apiClient = {
  /**
   * Authentication
   * Handles user login, registration, and session management
   */
  auth: authClient,
  
  /**
   * User profile
   * Manages user profile data like personal info and preferences
   */
  profiles: profilesClient,
  
  /**
   * Orders
   * Handles order creation, retrieval, and management
   */
  orders: ordersClient,
  
  /**
   * Packages
   * Manages service packages, pricing, and features
   */
  packages: packagesClient,
  
  /**
   * Milestones and rewards
   * Handles user achievement tracking and reward management
   */
  milestones: milestonesClient,
  
  /**
   * Admin functions
   * Provides administrative capabilities and permission checks
   */
  admin: adminClient,
  
  /**
   * Response handler
   * Provides standardized response handling for all API calls
   */
  responseHandler: apiResponseHandler
};
