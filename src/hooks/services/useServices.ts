
/**
 * useServices Hook
 * 
 * A hook that provides access to multiple services at once,
 * allowing components to consume services in a consistent way.
 */

import { useService } from './useService';
import { ServiceKey, ServiceType } from '@/services/registry/registry-types';

/**
 * Hook that provides access to multiple application services.
 * 
 * @param services Array of service keys to retrieve
 * @returns Object containing the requested services
 */
export function useServices<K extends ServiceKey[]>(
  ...services: K
): { [P in K[number]]: ServiceType<P> } {
  const result = {} as { [P in K[number]]: ServiceType<P> };
  
  for (const serviceKey of services) {
    // Use the existing useService hook to get each service
    const service = useService(serviceKey as any);
    result[serviceKey as K[number]] = service;
  }
  
  return result;
}

/**
 * Example usage:
 * 
 * const { api, payment, invoice } = useServices('api', 'payment', 'invoice');
 * 
 * This gets multiple services with a single hook call, reducing boilerplate.
 */
