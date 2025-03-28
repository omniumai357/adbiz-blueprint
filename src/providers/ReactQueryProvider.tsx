
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { handleError } from "@/utils/error-handling";

interface ReactQueryProviderProps {
  children: ReactNode;
}

/**
 * Provider for React Query with optimized caching configuration
 * 
 * Provides standardized caching strategies:
 * - Short-lived data (user status): 2 minute stale time
 * - Medium-lived data (milestones, rewards): 5 minute stale time
 * - Long-lived data (profiles, static data): 10 minute stale time
 * - Extended cache time to reduce refetching: 30 minutes
 */
export const ReactQueryProvider = ({ children }: ReactQueryProviderProps) => {
  // Create a client - using the constructor directly without useState
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes default stale time
        retry: (failureCount, error) => {
          // Don't retry on 4xx errors
          if (
            error instanceof Error && 
            'statusCode' in error && 
            typeof error.statusCode === 'number' && 
            error.statusCode >= 400 && 
            error.statusCode < 500
          ) {
            return false;
          }
          
          // Retry up to 2 times for other errors
          return failureCount < 2;
        },
        refetchOnWindowFocus: false,
        gcTime: 1000 * 60 * 30, // 30 minutes - keep unused data in cache longer (updated from cacheTime)
        refetchOnReconnect: "always", // Refetch when connection restored
        placeholderData: (previousData) => previousData, // Keep previous data while refetching
        
        meta: {
          onError: (error: Error) => {
            handleError(error, 'Query Error');
          }
        }
      },
      mutations: {
        retry: false,
        meta: {
          onError: (error: Error) => {
            handleError(error, 'Mutation Error');
          }
        }
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
