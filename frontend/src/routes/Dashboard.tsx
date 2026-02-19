import { useAuth } from '../auth/AuthProvider';
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from '@/components/AppSidebar.tsx'

/**
 * Renders the application dashboard with a sidebar and a logout control.
 *
 * Uses authentication context to obtain the current user and `logout` action; clicking the Logout button invokes `logout`.
 *
 * @returns The JSX element containing the sidebar, logout button, and dashboard content.
 */
export default function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <SidebarProvider>
      <main className='flex flex-row gap-2'>
        {/* Sidebar */}
        <AppSidebar />
        <button
            onClick={logout}>
          Logout
        </button>
        <br />
        Dashboard
      </main>
    </SidebarProvider>
  );
}