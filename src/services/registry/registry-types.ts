
/**
 * Service Registry Types
 * 
 * This file defines the types for the service registry system.
 */

// Define all possible service keys
export type ServiceKey = 
  | 'api' 
  | 'auth' 
  | 'packages' 
  | 'users' 
  | 'orders'
  | 'invoices'
  | 'payment'
  | 'milestone'
  | 'supabase';

// Define the mapping of service keys to their implementation types
export type ServiceTypeMap = {
  'api': any;
  'auth': any;
  'packages': any;
  'users': any;
  'orders': any;
  'invoices': any;
  'payment': any;
  'milestone': any;
  'supabase': any;
};

// Get the service implementation type based on the service key
export type ServiceType<K extends ServiceKey> = ServiceTypeMap[K];
