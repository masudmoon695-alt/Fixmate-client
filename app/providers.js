'use client';

import { createContext, useContext } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { authClient } from '@/lib/auth-client';

const BetterAuthContext = createContext(null);

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        {children}
        <Toaster position="top-right" richColors closeButton />
      </div>
    </ThemeProvider>
  );
}

export function useBetterAuthContext() {
  return useContext(BetterAuthContext);
}

export { authClient };
