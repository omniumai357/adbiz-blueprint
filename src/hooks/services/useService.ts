import { apiService } from "@/services/api/api-service";
import { authService } from "@/services/auth/auth-service";
import { packageService } from "@/services/packages/package-service";
import { userService } from "@/services/user/user-service";
import { orderService } from "@/services/order/order-service";
import { invoiceServiceApi } from "@/services/invoice/invoice-service-api";

// Define the available services
export type ServiceName = 
  | "api" 
  | "auth" 
  | "packages" 
  | "users" 
  | "orders"
  | "invoices";  // Add the new invoice service

/**
 * Hook to access the registered services
 * 
 * @param name The name of the service to retrieve
 * @returns The requested service instance
 */
export function useService(name: ServiceName) {
  // Services mapping
  const services = {
    api: apiService,
    auth: authService,
    packages: packageService,
    users: userService,
    orders: orderService,
    invoices: invoiceServiceApi  // Register the new invoice service
  };
  
  return services[name];
}
