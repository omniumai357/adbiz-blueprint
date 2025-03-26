
/**
 * Service Registry Types
 * 
 * This file contains type definitions for the service registry
 * to ensure type safety when using services.
 */

// Define the valid service keys
export type ServiceKey = 'api' | 'payment' | 'milestone' | 'invoice' | 'supabase';

// Map service keys to their respective types
export interface ServiceTypeMap {
  api: any; // Replace with actual API client type
  payment: any; // Replace with actual payment service type
  milestone: any; // Replace with actual milestone service type
  invoice: any; // Replace with actual invoice service type
  supabase: any; // Replace with actual supabase client type
}

// Helper type to get the type of a service by its key
export type ServiceType<K extends ServiceKey> = ServiceTypeMap[K];
