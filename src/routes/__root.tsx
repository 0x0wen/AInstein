import * as React from 'react';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { Sidebar } from "@/components/layout/sidebar"
import { ThemeProvider } from "@/components/theme/ThemeProvider"
export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	return (
		<React.Fragment>
      <ThemeProvider  defaultTheme="dark" storageKey="vite-ui-theme" >
      <div className="flex flex-col min-h-screen">
            <div className="flex flex-1">
              <Sidebar />
              <main className="flex-1 bg-white">			<Outlet />
			  </main>
            </div>
          </div>
        </ThemeProvider>
		</React.Fragment>
	);
}
