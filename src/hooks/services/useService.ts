
import { serviceRegistry } from '@/services/registry/service-registry';
import { ServiceKey, ServiceType } from '@/services/registry/registry-types';

/**
 * Hook to access services from the service registry
 * 
 * This provides a convenient way to use services in React components
 * while maintaining the ability to mock services during testing.
 * 
 * @example
 * // Get the API client
 * const api = useService('api');
 * 
 * // Get the payment service
 * const paymentService = useService('payment');
 * 
 * @param key The service key to retrieve
 * @returns The requested service instance
 */
export function useService<K extends ServiceKey>(key: K): ServiceType<K> {
  return serviceRegistry.get<K>(key);
}
