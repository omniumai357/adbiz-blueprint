
import { useApiResponse } from './useApiResponse';
import { apiClient } from '@/services/api/api-client';
import { Order } from '@/types/api';

/**
 * Hook for fetching and managing a user's order history
 * 
 * @param userId The ID of the user to fetch orders for
 * @returns Object containing orders data, loading state, and error
 */
export function useOrderHistory(userId: string | undefined) {
  return useApiResponse<Order[]>(
    async () => {
      if (!userId) return [];
      return await apiClient.orders.getUserOrders(userId);
    },
    [userId],
    {
      initialData: [],
      showErrorToast: true,
      errorMessage: 'Failed to load order history'
    }
  );
}
