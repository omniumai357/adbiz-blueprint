
import { serviceRegistry } from '@/services/registry/service-registry';
import { ServiceKey, ServiceType } from '@/services/registry/registry-types';

/**
 * Hook to access services from the service registry
 * 
 * This provides a convenient way to use services in React components
 * while maintaining the ability to mock services during testing.
 * 
 * @example
 * // Get the API client with full type safety
 * const api = useService('api');
 * // TypeScript knows this is the API client type
 * 
 * // Get the payment service
 * const paymentService = useService('payment');
 * // TypeScript knows this is the payment service type
 * 
 * @param key The service key to retrieve
 * @returns The requested service instance with proper typing
 */
export function useService<K extends ServiceKey>(key: K): ServiceType<K> {
  return serviceRegistry.get<K>(key);
}
