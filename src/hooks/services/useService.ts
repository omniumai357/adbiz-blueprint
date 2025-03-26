
import { serviceRegistry } from '@/services/registry/service-registry';

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
 */
export function useService<T>(key: 'api' | 'payment' | 'milestone' | 'invoice' | 'supabase'): T {
  return serviceRegistry.get<T>(key);
}
