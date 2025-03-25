
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
        retry: 1,
        refetchOnWindowFocus: false,
        // Updated to use the meta property for error handling
        meta: {
          onError: (error: Error) => {
            handleError(error, 'Query Error');
          }
        }
      },
      mutations: {
        // Updated to use the meta property for error handling
        meta: {
          onError: (error: Error, variables: unknown) => {
            handleError(error, 'Mutation Error');
          }
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
