
import { serviceRegistry } from "@/services/registry/service-registry";

// Define the available services
export type ServiceName = 
  | "api" 
  | "auth" 
  | "packages" 
  | "users" 
  | "orders"
  | "invoices"  // Add the new invoice service
  | "milestone"; // Add milestone service

/**
 * Hook to access the registered services
 * 
 * @param name The name of the service to retrieve
 * @returns The requested service instance
 */
export function useService(name: ServiceName) {
  if (!serviceRegistry.has(name)) {
    console.warn(`Service '${name}' not registered. Available services: ${Array.from(serviceRegistry.getRegisteredServices()).join(', ')}`);
  }
  
  return serviceRegistry.get(name);
}
