'use client';

import { HeroUIProvider } from '@heroui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useState } from 'react';

export let queryClient: QueryClient;

export default function Providers({ children }: { children: React.ReactNode }) {
  const [qc] = useState(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5,
          gcTime: 1000 * 60 * 30,
          retry: 2,
          refetchOnWindowFocus: false,
        },
      },
    });
    return queryClient;
  });

  return (
    <QueryClientProvider client={qc}>
      <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
        <HeroUIProvider>{children}</HeroUIProvider>
      </NextThemesProvider>
    </QueryClientProvider>
  );
}
