
/**
 * Service Registry
 * 
 * A centralized registry for all application services that implements a lightweight
 * dependency injection approach. This makes services easier to:
 * - Test (by allowing mock implementations)
 * - Maintain (by centralizing service dependencies)
 * - Discover (by providing a single entry point for all services)
 */

import { apiClient } from '../api/api-client';
import { paymentService } from '../payment/payment-service';
import { milestoneService } from '../milestone/milestone-service';
import { invoiceService } from '../invoice/invoice-service';
import { supabaseClient } from '../api/supabase-client';
import { ServiceKey, ServiceType } from './registry-types';

// Service registry to store and retrieve service instances
class ServiceRegistry {
  private services: Map<string, any> = new Map();
  private initialized = false;

  /**
   * Initialize the registry with default service implementations
   */
  public initialize(): void {
    if (this.initialized) return;

    // Register default service implementations
    this.register('api', apiClient);
    this.register('payment', paymentService);
    this.register('milestone', milestoneService);
    this.register('invoice', invoiceService);
    this.register('supabase', supabaseClient);

    this.initialized = true;
  }

  /**
   * Register a service implementation
   * @param key Service identifier
   * @param implementation Service implementation
   */
  public register<K extends ServiceKey>(key: K, implementation: ServiceType<K>): void {
    this.services.set(key, implementation);
  }

  /**
   * Get a service by key
   * @param key Service identifier
   * @returns The service implementation
   * @throws Error if service is not registered
   */
  public get<K extends ServiceKey>(key: K): ServiceType<K> {
    if (!this.initialized) {
      this.initialize();
    }

    const service = this.services.get(key);
    if (!service) {
      throw new Error(`Service '${key}' not registered`);
    }

    return service as ServiceType<K>;
  }

  /**
   * Check if a service is registered
   * @param key Service identifier
   * @returns True if the service is registered
   */
  public has(key: ServiceKey): boolean {
    return this.services.has(key);
  }

  /**
   * Replace a service with a mock implementation (useful for testing)
   * @param key Service identifier
   * @param mockImplementation Mock service implementation
   */
  public mock<K extends ServiceKey>(key: K, mockImplementation: ServiceType<K>): void {
    this.register(key, mockImplementation);
  }

  /**
   * Reset the registry to its initial state
   * Primarily used for testing
   */
  public reset(): void {
    this.services.clear();
    this.initialized = false;
    this.initialize();
  }
}

// Export a singleton instance
export const serviceRegistry = new ServiceRegistry();
serviceRegistry.initialize();
