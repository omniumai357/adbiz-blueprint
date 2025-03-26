
/**
 * Service Registry Types
 * 
 * This file contains type definitions for the service registry
 * to ensure type safety when using services.
 */

// Import service types
import { apiClient } from '../api/api-client';
import { paymentService } from '../payment/payment-service';
import { milestoneService } from '../milestone/milestone-service';
import { invoiceService } from '../invoice/invoice-service';
import { supabaseClient } from '../api/supabase-client';

// Define the valid service keys
export type ServiceKey = 'api' | 'payment' | 'milestone' | 'invoice' | 'supabase';

// Define actual service types based on their implementations
export type ApiClientType = typeof apiClient;
export type PaymentServiceType = typeof paymentService;
export type MilestoneServiceType = typeof milestoneService;
export type InvoiceServiceType = typeof invoiceService;
export type SupabaseClientType = typeof supabaseClient;

// Map service keys to their respective types
export interface ServiceTypeMap {
  api: ApiClientType;
  payment: PaymentServiceType;
  milestone: MilestoneServiceType;
  invoice: InvoiceServiceType;
  supabase: SupabaseClientType;
}

// Helper type to get the type of a service by its key
export type ServiceType<K extends ServiceKey> = ServiceTypeMap[K];
