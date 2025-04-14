import { Sidebar } from '@/components/layout/sidebar';
import { createFileRoute, Outlet, MatchRoute, useRouterState } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated')({
  component: RouteComponent,
});

function RouteComponent() {
  const routerState = useRouterState();
  
  // Find the studykit route match if it exists
  const studyKitMatch = routerState.matches.find(match => 
    match.routeId.includes('study-kit')
  );
  
  // Get the studykitId parameter if it exists
  const studykitId = studyKitMatch?.params?.id;
  const conversationId = studyKitMatch?.search?.conversation;
  const view = studyKitMatch?.search?.view;
  
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar studykitId={studykitId} conversationId={conversationId} view={view}/>
      <main className="flex-1 bg-white">
        <Outlet />
      </main>
    </div>
  );
}