import { Sidebar } from '@/components/layout/sidebar';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated')({
  component: RouteComponent,
});

function RouteComponent() {
  const { studykitId = '' } = Route.useParams();
  
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar studykitId={studykitId}/>
      <main className="flex-1 bg-white">
        <Outlet />
      </main>
    </div>
  );
}