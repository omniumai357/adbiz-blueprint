
import { serviceRegistry } from './service-registry';

/**
 * Initialize all services
 * This should be called once at application startup
 */
export function initializeServices() {
  // Initialize the service registry
  serviceRegistry.initialize();
  
  console.log('Service registry initialized');
  
  // Perform any other initialization logic
  // For example, set up global error handlers, configure services, etc.
}
