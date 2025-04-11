import { Sidebar } from '@/components/layout/sidebar';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Sidebar />
      <main className="flex-1 bg-white">
        <Outlet />
      </main>
    </>
  );
}
