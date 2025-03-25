
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { handleError } from "@/utils/error-handling";

interface ReactQueryProviderProps {
  children: ReactNode;
}

export const ReactQueryProvider = ({ children }: ReactQueryProviderProps) => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
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
        gcTime: 1000 * 60 * 10, // 10 minutes
        
        onError: (error) => {
          handleError(error, 'Query Error');
        }
      },
      mutations: {
        retry: false,
        onError: (error, variables, context) => {
          handleError(error, 'Mutation Error');
        }
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
