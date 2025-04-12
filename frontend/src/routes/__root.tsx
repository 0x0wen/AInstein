import * as React from 'react';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <div className="flex flex-col min-h-screen bg-background">
          <div className="flex flex-1">
            <Outlet />
          </div>
        </div>
      </ThemeProvider>
    </React.Fragment>
  );
}
