import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const CustomQueryClientProvider = ({children}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default CustomQueryClientProvider;
